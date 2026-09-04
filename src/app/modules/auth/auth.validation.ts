import z from "zod";

const registerUserValidationZodSchema = z.object({
    name: z.string("Not a string").min(5, "Name must be at least 5 char").max(50, "Name can not have more that 50 character"),
    email: z.email("Invalid email address,Try again"),
    password: z.string("Password should be a string"),
    role: z.enum(["CUSTOMER", "TECHNICIAN","ADMIN"]),

})

const loginSchema = z.object({
    email: z.email("Invalid email address,Try again"),
    password: z.string("Password should be a string")
})
export const userValidation = {
    registerUserValidationZodSchema,
    loginSchema

}