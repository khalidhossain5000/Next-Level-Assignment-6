import z from "zod";

 const createFeederZodSchema = z.object({
    name: z.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars"),
    code: z.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars"),
    voltageLevel: z.string("Not a string").min(5, "capacity should minimum have 5 char").max(50, "Max 150 chars"),
    substationId:z.string("Not a string")
})

export const feederValidation ={
    createFeederZodSchema
}

