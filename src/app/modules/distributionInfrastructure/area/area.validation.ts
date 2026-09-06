import z from "zod";

 const createAreaZodSchema = z.object({
    name: z.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars"),
    code: z.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars"),
    address: z.string("Not a string").min(5, " address should minimum have 5 char").max(300, "Max 300 chars"),
    feederId:z.string("Not a string")
})

const updateAreaZodSchema = z.object({
    name: z.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars").optional(),
    code: z.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars").optional(),
    address: z.string("Not a string").min(5, "Address should minimum have 5 char").max(300, "Max 300 chars").optional(),
    feederId: z.string("Not a string").min(1, "Feeder ID is required").optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export const areaValidation ={
    createAreaZodSchema,
    updateAreaZodSchema,
}

