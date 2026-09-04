import z from "zod";

const createZoneZodSchema=z.object({
    name:z.string("Name is not a string").min(5,"Name should minimum have 5 char").max(100,"Name should not be more than 100 chars"),
    code:z.string("Not a string").min(5,"Code should minimum have 5 char").max(10,"Max 10 chars"),
    description:z.string("Not a string").min(5,"Description should minimum have 5 char").max(150,"Max 150 chars"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
})



export const ZoneValidation={
    createZoneZodSchema
}