import type { ZoneStatus } from "../../../../generated/prisma/enums";

export interface ICreateZonePayload{
    name:string;
    code:string;
    description:string;
    status:ZoneStatus
}
