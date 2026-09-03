/** biome-ignore-all lint/style/useNodejsImportProtocol: <explanation> */
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IRegisterUser } from "./auth.interface"
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redisClient } from "../../lib/redis";

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

}



export const authServices = {
    registerUserInDb
}