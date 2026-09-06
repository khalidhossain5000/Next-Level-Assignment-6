import type { TechnicianProfileStatus } from "../../../generated/prisma/enums";

export interface ITechcianProfileUploadPayload{
    expertise:string[];
    experience:number;
    bio:string;

}


export interface ITechProfileApproval {
    technicianId:string;
    status:TechnicianProfileStatus
}