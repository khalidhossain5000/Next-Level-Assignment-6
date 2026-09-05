import z from "zod";

const plannedOutageStatus = z.enum([
    "SCHEDULED",
    "ONGOING",
    "CANCELLED",
    "COMPLETED",
]);

const createPlannedOutageZodSchema = z
    .object({
        title: z
            .string("Title is not a string")
            .trim()
            .min(3, "Title should minimum have 3 chars")
            .max(150, "Title should not be more than 150 chars"),
        reason: z
            .string("Reason is not a string")
            .trim()
            .min(3, "Reason should minimum have 3 chars")
            .max(400, "Reason should not be more than 400 chars"),
        description: z
            .string("Description is not a string")
            .trim()
            .min(5, "Description should minimum have 5 chars")
            .max(1000, "Description should not be more than 1000 chars"),
        status: plannedOutageStatus.optional(),
        startTime: z.coerce.date("Start time must be a valid date"),
        endTime: z.coerce.date("End time must be a valid date"),
        areaId: z.string("Area ID is not a string").trim().min(1, "Area ID is required"),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: "End time must be later than start time",
        path: ["endTime"],
    });

const updatePlannedOutageZodSchema = z
    .object({
        title: z
            .string("Title is not a string")
            .trim()
            .min(3, "Title should minimum have 3 chars")
            .max(150, "Title should not be more than 150 chars")
            .optional(),
        reason: z
            .string("Reason is not a string")
            .trim()
            .min(3, "Reason should minimum have 3 chars")
            .max(400, "Reason should not be more than 400 chars")
            .optional(),
        description: z
            .string("Description is not a string")
            .trim()
            .min(5, "Description should minimum have 5 chars")
            .max(1000, "Description should not be more than 1000 chars")
            .optional(),
        status: plannedOutageStatus.optional(),
        startTime: z.coerce.date("Start time must be a valid date").optional(),
        endTime: z.coerce.date("End time must be a valid date").optional(),
        areaId: z.string("Area ID is not a string").trim().min(1, "Area ID is required").optional(),
    })
    .refine(
        (data) =>
            data.startTime === undefined ||
            data.endTime === undefined ||
            data.endTime > data.startTime,
        {
            message: "End time must be later than start time",
            path: ["endTime"],
        },
    );

export const PlannedOutageZodSchema = createPlannedOutageZodSchema;

export const plannedOutageValidation = {
    createPlannedOutageZodSchema,
    updatePlannedOutageZodSchema,
};