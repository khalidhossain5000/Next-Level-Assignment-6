import z from "zod";

const createOutageZodSchema = z.object({
    cause: z.string("cause Cause is not a string").min(5, "Cause should minimum have 5 char").max(50, "Cause should not be more than 50 chars"),
    description: z.string("description description Not a string").min(5, "description should minimum have 5 char").max(400, "Max 400 chars"),
    areaId: z.string("Not a string areaId")
})

const updateOutageZodSchema = z.object({
    cause: z.string("cause Cause is not a string").min(5, "Cause should minimum have 5 char").max(50, "Cause should not be more than 50 chars").optional(),
    description: z.string("description description Not a string").min(5, "description should minimum have 5 char").max(400, "Max 400 chars").optional(),
    areaId: z.string("Not a string areaId").optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one outage field is required",
})

export const outageValidation = {
    createOutageZodSchema,
    updateOutageZodSchema,
}

