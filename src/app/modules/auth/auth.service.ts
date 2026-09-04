/** biome-ignore-all lint/style/useNodejsImportProtocol: <explanation> */
/** biome-ignore-all lint/complexity/useOptionalChain: <explanation> */
/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IGoogleLoginPayload, ILoginUserPayload, IRegisterUser, IRequestUser, IUpadteUserProfile, IVerifyEmailPayload } from "./auth.interface"
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redisClient } from "../../lib/redis";
import path from "path"
import ejs from "ejs"
import { transporter } from "../../lib/nodemailer";
import config from "../../config";
import { AuthProvider, Role, UserStatus } from "../../../generated/prisma/enums";
import { jwtUtils } from "../../utils/jwt";
// biome-ignore lint/style/useImportType: <explanation>
import { JwtPayload, SignOptions } from "jsonwebtoken";
import type { TokenPayload } from "google-auth-library";
import { googleClient } from "../../lib/googleAuth";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { Prisma } from "../../../generated/prisma/client";



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
		"src/app/templates/welcome-email.ejs",
	);
	const templateData = {
		name: createdUser.name,
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




//login user with email pass

const loginUser = async (payload: ILoginUserPayload) => {
	const { password } = payload;
	const email = payload.email.trim().toLowerCase();
console.log(payload,'in login user')
	const user = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (!user) throw new AppError(httpStatus.NOT_FOUND, "User havent register yet,register first")


	if (user.status === "BAN") throw new AppError(httpStatus.BAD_REQUEST, "User is banned")



	const isPasswordMatched = await bcrypt.compare(
		password,
		user?.password as string,
	);


	if (!isPasswordMatched) throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials try again")



	const jwtPayload = {
		userId: user.id,
		email: user.email,
		name: user.name,
		role: user.role
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
		refreshToken
	}


}

//refresh token validation for getting new token

const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtils.verifyToken(
		token,
		config.jwt_refresh_secret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			config.node_env === "development"
				? verifiedRefreshToken.error
				: "Invalid refresh token",
		);
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await prisma.user.findUnique({
		where: { id: data.userId },
	});

	if (!user || user.status !== "ACTIVE") {
		throw new AppError(httpStatus.UNAUTHORIZED, "User is inactive or not found");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

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
	};
};



//google login

const googleLogin = async (payload: IGoogleLoginPayload) => {
	let googleIdTokenPayload: TokenPayload | null | undefined = null;

	// 1. Verify Google ID token
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: payload.idToken,
			audience: config.google_client_id,
		});

		googleIdTokenPayload = ticket.getPayload();
	} catch (error) {
		console.log("Google login id token failed", error);

		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid or expired Google ID token"
		);
	}

	if (!googleIdTokenPayload) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid or expired Google ID token"
		);
	}

	if (!googleIdTokenPayload.email) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Email not found in Google account"
		);
	}

	if (!googleIdTokenPayload.name) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Name not found in Google account"
		);
	}

	const email = googleIdTokenPayload.email.trim().toLowerCase();
	const googleId = googleIdTokenPayload.sub;

	// 2. First check existing Google user
	let user = await prisma.user.findUnique({
		where: {
			googleId,
		},
	});

	// 3. Existing Google user
	if (user) {
		if (user.status === UserStatus.BAN) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"User is banned"
			);
		}


	}

	// 4. If Google user not found, check email
	if (!user) {
		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		// 5. Same email exists as credential user
		if (existingUser) {
			if (!existingUser.emailVerified) {
				throw new AppError(
					httpStatus.FORBIDDEN,
					"Email is not verified"
				);
			}

			if (existingUser.status === UserStatus.BAN) {
				throw new AppError(
					httpStatus.FORBIDDEN,
					"User is banned"
				);
			}

			// Link Google account with existing user
			user = await prisma.user.update({
				where: {
					id: existingUser.id,
				},
				data: {
					googleId,
				},
			});
		}
	}

	// 6. Completely new Google user
	if (!user) {
		// New user registration needs role
		if (!payload.role) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Role is required for new Google registration"
			);
		}

		// Public Google registration should not allow ADMIN
		if (
			payload.role !== Role.CUSTOMER &&
			payload.role !== Role.TECHNICIAN
		) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Invalid registration role"
			);
		}

		user = await prisma.$transaction(async (tx) => {
			const createdUser = await tx.user.create({
				data: {
					name: googleIdTokenPayload!.name!,
					email,
					profileImage: googleIdTokenPayload!.picture,
					role: payload.role!,
					googleId,
					authProvider: AuthProvider.GOOGLE,
					emailVerified: true,
				},

			});

			if (createdUser.role === Role.TECHNICIAN) {
				await tx.technicianProfile.create({
					data: {
						userId: createdUser.id,
					},
				});
			}

			return createdUser;
		});
	}

	// 7. Final safety check
	if (!user) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"User not found"
		);
	}

	if (user.status === UserStatus.BAN) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"User is banned"
		);
	}

	// 8. Generate JWT payload
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions
	);

	return {
		accessToken,
		refreshToken,
	};
};


//get me
const getMe = async (user: IRequestUser) => {
	const isUserExists = await prisma.user.findUnique({
		where: {
			id: user.userId,
		},
		include: {
			technicianProfile: true
		},
		omit: {
			password: true,
		},
	});

	if (!isUserExists) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	return isUserExists;
};


//update user profile service

const updateUserProfileInDb = async (payload: IUpadteUserProfile, profileImage: Express.Multer.File | null, userId: string) => {

	let profileImageUrl: string | null = null;
	let profileImagePublicId: string | null = null;

	//profile image upload

	if (profileImage) {
		const uploadResult = await new Promise<UploadApiResponse>(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							resource_type: "image",
						},
						(error, result) => {
							if (error) {
								return reject(error);
							}

							if (!result) {
								return reject(
									new AppError(
										httpStatus.INTERNAL_SERVER_ERROR,
										"No result returned from Cloudinary"
									)
								);
							}

							resolve(result);
						}
					)
					.end(profileImage.buffer);
			}
		);

		profileImageUrl = uploadResult.secure_url;
		profileImagePublicId = uploadResult.public_id;
	}



	if (!payload.name) throw new AppError(httpStatus.BAD_REQUEST, "Name is required")

	const updateData: Prisma.UserUpdateInput = {
		name: payload.name,
	};

	if (profileImage) {
		updateData.profileImage = profileImageUrl!;
		updateData.profileImagePublicId = profileImagePublicId!;
	}

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: updateData,
		omit: {
			password: true
		}
	});

	return updatedUser

}

export const authServices = {
	registerUserInDb,
	verifyOtpAndCreateUser,
	loginUser,
	refreshToken,
	googleLogin,
	getMe,
	updateUserProfileInDb
}