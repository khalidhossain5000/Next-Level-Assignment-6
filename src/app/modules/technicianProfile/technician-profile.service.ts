import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
import type { ITechcianProfileUploadPayload } from "./technician-profile.interface";

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



export const TechnicianProfileService = {
    updateTechnicicanProfileInDb
}