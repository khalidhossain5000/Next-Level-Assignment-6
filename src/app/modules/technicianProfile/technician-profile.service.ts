import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status"
const updateTechnicicanProfileInDb = async (payload: any, resume: Express.Multer.File | null,
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

    console.log({ resumeUploadResult }, 'RESUME UPLOAD RESULT IS HERE');













}



export const TechnicianProfileService = {
    updateTechnicicanProfileInDb
}