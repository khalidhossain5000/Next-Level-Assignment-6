import z from "zod";

const createLoadSheddingZodSchema = z
    .object({
        title: z
            .string("Title is not a string")
            .min(3, "Title should minimum have 3 chars")
            .max(150, "Title should not be more than 150 chars"),
        startTime: z.coerce.date("Start time must be a valid date"),
        endTime: z.coerce.date("End time must be a valid date"),
        status: z
            .enum([ "ONGOING", "SCHEDULED", "CANCELLED", "COMPLETED"])
            .optional(),
        reason: z
            .string("Reason is not a string")
            .min(5, "Reason should minimum have 5 chars")
            .max(400, "Reason should not be more than 400 chars").optional(),
        areaId: z.string("Area ID is not a string").min(1, "Area ID is required"),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: "End time must be later than start time",
        path: ["endTime"],
    });

export const loadSheddingValidation = {
    createLoadSheddingZodSchema,
};

