import type { InfrastructureStatus } from "../../../../generated/prisma/enums";

export interface ICreateZonePayload{
    name:string;
    code:string;
    description:string;
    status:InfrastructureStatus
}

export interface IUpdateZonePayload {
    name?: string;
    code?: string;
    description?: string;
    status?: InfrastructureStatus;
}
