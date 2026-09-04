import z from "zod";

const technicianProfileZodSchema=z.object({
    expertise:z  .array(z.string().min(5, "Expertise must be at least 5 characters"))
  .min(1, "At least one expertise is required"),
  experience:z.number().int().min(0).default(0),
  bio:z.string("Bio should be string").min(10,"minimum 10 char required").max(200,"Bio should not be more that 200 char"),
  resumeUrl: z.url().optional(),
})




export const TechnicianProfileValidation={
    technicianProfileZodSchema
}