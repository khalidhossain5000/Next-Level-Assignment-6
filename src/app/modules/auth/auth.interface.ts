import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IRegisterUser {
    name:string;
    email:string;
    password:string;
    role:Role;
    status:UserStatus;
    profileImage?:string;
}