import z from "zod";

 const createSubstationZodSchema = z.object({
    name: z.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars"),
    code: z.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars"),
    capacity: z.string("Not a string").min(5, "capacity should minimum have 5 char").max(50, "Max 150 chars"),
    location:z.string("Not a string").min(5, "Location should minimum have 5 char").max(60, "Max 60 chars"),
    zoneId:z.string("Not a string"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
})

export const substationValidation ={
    createSubstationZodSchema
}

