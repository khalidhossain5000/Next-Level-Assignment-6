import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IRegisterUser } from "./auth.interface"
import httpStatus from "http-status";
import bcrypt from "bcryptjs";


const registerUserInDb = async (payload: IRegisterUser) => {
    const { name, password, role } = payload
    const email = payload.email.trim().toLowerCase();

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });
    if (isUserExists) throw new AppError(httpStatus.CONFLICT, "User already exists with this email");

    //s-2 hashed the password
    const hashPassword = await bcrypt.hash(password, 10);

    //redis store start
}



export const authServices = {
    registerUserInDb
}