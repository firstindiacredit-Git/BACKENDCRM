import { z } from "zod";

const emailSchema = z
  .string()
  .email()
  .refine(
    (email) => {
      const allowedProvider = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "protonMail.com",
        "icloud.com",
        "hotmail.com",
      ];
      const emailProvider = email.split("@")[1];
      return allowedProvider.includes(emailProvider);
    },
    { message: "Email provider not allowed. Please use a valid provider" }
  );
const passwordSchema = z.string().min(8, {
  message: "Password must be 8 characters long",
});

export const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Lirst name is required" }),
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().min(1, { message: "phone must be 10 nums long" }),
  referralId: z.string().min(1, { message: "referral ID is required" }),
});
