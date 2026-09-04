import type { InfrastructureStatus } from "../../../../generated/prisma/enums";

export interface IAreaInterface{
    name:string;
    code:string;
    address:string;
    feederId:string;
    status:InfrastructureStatus;
}