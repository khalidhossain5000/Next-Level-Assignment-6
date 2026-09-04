import type { InfrastructureStatus } from "../../../../generated/prisma/enums";

export interface IFeederInterface{
    name:string;
    code:string;
    voltageLevel:string;
   
    substationId:string;
    status:InfrastructureStatus;
}