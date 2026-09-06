import z from "zod";

 const createOutageZodSchema = z.object({
    cause: z.string("cause Cause is not a string").min(5, "Cause should minimum have 5 char").max(50, "Cause should not be more than 50 chars"),
    description: z.string("description description Not a string").min(5, "description should minimum have 5 char").max(400, "Max 400 chars"),   
    areaId:z.string("Not a string areaId")
})

export const outageValidation ={
    createOutageZodSchema
}

