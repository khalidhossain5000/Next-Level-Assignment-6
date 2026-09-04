/** biome-ignore-all lint/style/useNodejsImportProtocol: <explanation> */
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IRegisterUser, IVerifyEmailPayload } from "./auth.interface"
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redisClient } from "../../lib/redis";
import path from "path"
import ejs from "ejs"
import { transporter } from "../../lib/nodemailer";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";



const registerUserInDb = async (payload: IRegisterUser) => {
	const { name, password, role } = payload
	const email = payload.email.trim().toLowerCase();

	const isUserExists = await prisma.user.findUnique({
		where: { email },
	});
	if (isUserExists) throw new AppError(httpStatus.CONFLICT, "User already exists with this email");

	//s-2 hashed the password
	const hashedPassword = await bcrypt.hash(password, 10);

	//redis store start

	//2.1 get otp value
	const otpValue = crypto.randomInt(100000, 1000000).toString();
	const otpKey = `user-registration-otp:${email}`;
	//set the otp in redis with expiration
	await redisClient.set(otpKey, otpValue, {
		expiration: {
			type: "EX",
			value: 10 * 60,  // 10 minutes in seconds
		},
	});

	//2.2 storing the user data in redis
	const userRegisterKey = `user-registration-data:${email}`;

	const redisUserDataPayload = {
		name,
		email,
		password: hashedPassword,
		role
	};

	await redisClient.set(
		userRegisterKey,
		JSON.stringify(redisUserDataPayload),
		{
			expiration: {
				type: "EX",
				value: 10 * 60,
			},
		},
	);

	//redis store end

	//send email fuunc logic over here

	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/verify-email.ejs",
	);
	const templateData = {
		name,
		otp: otpValue,
		expirationTime: 10,
	};

	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.smtp_user,
		to: email,
		subject: "Email verification otp ",
		html,
	});

}


//verify otp and create user in the db

const verifyOtpAndCreateUser = async (payload: IVerifyEmailPayload) => {
	const { otp } = payload;

	const email = payload.email.trim().toLowerCase();

	const isUserExist = await prisma.user.findUnique({
		where: { email },
	});

	

	if (isUserExist && isUserExist.emailVerified === true) throw new AppError(httpStatus.BAD_REQUEST, "User already verified,Please login now");

	if (isUserExist?.status === "BAN") throw new AppError(httpStatus.FORBIDDEN, "User is banned,Please contact support for more information");

	//otp verify

	const otpKey = `user-registration-otp:${email}`;
	const redisOtp = await redisClient.get(otpKey);
	if (!redisOtp) throw new AppError(httpStatus.BAD_REQUEST, "OTP expired or not found,Please register again");
	if (redisOtp !== otp) throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP,Please try again");
	redisClient.del(otpKey);



	//get user info from redis

	const userRegisterKey = `user-registration-data:${email}`;

	const redisUserData = await redisClient.get(userRegisterKey);

	if (!redisUserData) throw new AppError(httpStatus.BAD_REQUEST, "User data not found,Otp is expired,Please register again");

	const userPayload: IRegisterUser = JSON.parse(redisUserData);

	//otp match and verifcation done now create user in db

	const createdUser = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({
			data: {
				name: userPayload.name,
				email: userPayload.email,
				password: userPayload.password,
				role: userPayload.role,
				emailVerified: true
			},
			omit: { password: true },

		})
		if (user.role === Role.TECHNICIAN) {
			await tx.technicianProfile.create({
				data: {
					userId: user.id
				}
			})
		}
	

		return user
	})
		await redisClient.del(userRegisterKey);



//ewlcome emil startshere here

	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/patient-welcome-email.ejs",
	);
	const templateData = {
		name: name,
	};
	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.smtp_user,
		to: email,
		subject: "Welcome to PowerPulse ",
		html,
	});

	//welcome email enda here












	//user created in db now generate access and refresh token with jwt
	const jwtPayload = {
		userId: createdUser.id,
		email: createdUser.email,
		name: createdUser.name,
		role: createdUser.role
	}



	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);












	return {
		accessToken,
		refreshToken,
		createdUser
	}
}

export const authServices = {
	registerUserInDb,
	verifyOtpAndCreateUser
}