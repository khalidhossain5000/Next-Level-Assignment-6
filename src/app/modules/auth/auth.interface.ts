import type { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IRegisterUser {
    name:string;
    email:string;
    password:string;
    role:Role;
    status:UserStatus;
    profileImage?:string;
}



export interface IVerifyEmailPayload{
    email:string;
    otp:string
}