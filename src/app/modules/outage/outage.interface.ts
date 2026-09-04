import { OutagePriority } from "../../../generated/prisma/enums";

export interface IOutagePayload {
    cause:string;
    description:string;
    priority:OutagePriority
}