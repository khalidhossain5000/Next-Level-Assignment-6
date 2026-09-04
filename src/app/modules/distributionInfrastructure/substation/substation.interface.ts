import type { InfrastructureStatus } from "../../../../generated/prisma/enums";

export interface ISubstationPayload{
    name:string;
    code:string;
    capacity:string;
    location:string;
    status:InfrastructureStatus
}