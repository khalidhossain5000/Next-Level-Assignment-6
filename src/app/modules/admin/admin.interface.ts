import type { UserStatus } from "../../../generated/prisma/enums";

export interface IUpdateStatusPayload {
    status:UserStatus;
    targetUserId:string;
}