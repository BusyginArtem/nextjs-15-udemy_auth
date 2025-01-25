import { z } from "zod";

const passwordValidation = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

export const authFormSchema = z
  .object({
    email: z.string().trim().min(1, "Email is required").email("Must be a valid email"),
    password: z.string().trim().min(1, "Password is required").regex(passwordValidation, {
      message: "8 characters minimum and must contain (A-Z, a-z, 0-9 and (#?!@$%^&*-))",
    }),
    confirmPassword: z.string().trim().min(1, "Confirm password is required"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

export type AuthFormSchema = z.infer<typeof authFormSchema>;
