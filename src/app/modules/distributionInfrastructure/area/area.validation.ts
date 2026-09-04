import z from "zod";

 const createAreaZodSchema = z.object({
    name: z.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars"),
    code: z.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars"),
    address: z.string("Not a string").min(5, " address should minimum have 5 char").max(300, "Max 300 chars"),
    feederId:z.string("Not a string")
})

export const areaValidation ={
    createAreaZodSchema
}

