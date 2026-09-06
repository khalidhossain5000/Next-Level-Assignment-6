import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
import type { ITechcianProfileUploadPayload, ITechProfileApproval } from "./technician-profile.interface";
import { TechnicianProfileStatus } from "../../../generated/prisma/enums";

const updateTechnicicanProfileInDb = async (payload: ITechcianProfileUploadPayload, resume: Express.Multer.File | null,
 technicianUserId: string)=> {
    //s-1 upload resume

    const resumeUploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "auto",
                    },

                    async (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        if (!result) {
                            return reject(
                                new AppError(
                                    httpStatus.INTERNAL_SERVER_ERROR,
                                    "No result returned from Cloudinary",
                                ),
                            );
                        }

                        resolve(result);
                    },
                )
                .end(resume?.buffer);
        },
    );


//now resume is upload now update it in technical profile


const updatedTechnicianProfile=await prisma.technicianProfile.update({
    where:{
        userId:technicianUserId
    },
    data:{
        expertise:payload.expertise,
        experience:payload.experience,
        bio:payload.bio,
        resume:resumeUploadResult.secure_url,
        resumePublicId:resumeUploadResult.public_id
    },
    include:{
        user:{
            omit:{
                password:true
            }
        }
    }
})



return updatedTechnicianProfile







}



const technicianProfileApprovalInDb=async(payload:ITechProfileApproval)=>{
//s-1 check if technican profile is exist or not

const techProfile=await prisma.technicianProfile.findUnique({
    where:{
        id:payload.technicianId
    }
})



if(!techProfile){
    throw new AppError(httpStatus.NOT_FOUND,"Technican profile is not exist")
}


//can not reject a approved profile

if(payload.status===TechnicianProfileStatus.REJECTED && techProfile.technicianvProfileVerificationStatus===TechnicianProfileStatus.APPROVED){
            throw new AppError(httpStatus.BAD_REQUEST,`Technican profile is approved cant reject it again`)

}


if(payload.status===TechnicianProfileStatus.PENDING && (techProfile.technicianvProfileVerificationStatus===TechnicianProfileStatus.APPROVED || techProfile.technicianvProfileVerificationStatus===TechnicianProfileStatus.REJECTED ) ){
            throw new AppError(httpStatus.BAD_REQUEST,`Technican profile is approved OR REJECTED CANT MAKE IT PENDING`)

}



if(techProfile.technicianvProfileVerificationStatus===payload.status){
        throw new AppError(httpStatus.CONFLICT,`Technican profile is already ${payload.status}`)

}

//update the status

const updatedResult=await prisma.technicianProfile.update({
    where:{
        id:payload.technicianId
    },
    data:{
        technicianvProfileVerificationStatus:payload.status
    }
})

return updatedResult


}










export const TechnicianProfileService = {
    updateTechnicicanProfileInDb,
    technicianProfileApprovalInDb
}