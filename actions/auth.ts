"use server";

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/users";
import { transformZodErrors } from "@/lib/utils";
import { authFormSchema } from "@/lib/validation/form";

type Status = "succeed" | "failed" | "idle";
type Fields = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type FormState = {
  status: Status;
  fields?: Fields;
  errors?: { path: string; message: string }[];
};

export async function signup(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);

  const parsedFields = authFormSchema.safeParse(formData);

  if (parsedFields.success) {
    const hashedPassword = hashUserPassword(parsedFields.data.password);

    try {
      await createUser(parsedFields.data.email, hashedPassword);
    } catch (error) {
      if ((error as any).code === "SQLITE_CONSTRAINT_UNIQUE") {
        return {
          status: "failed",
          errors: [{ message: "Email is taken!", path: "email" }],
          fields: parsedFields.data,
        };
      }

      throw error;
    }

    return {
      status: "succeed",
      errors: undefined,
      fields: parsedFields.data,
    };
  }

  if (parsedFields.error) {
    const fields: Fields = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    for (const key of Object.keys(formData)) {
      if (key === "email" || key === "password" || key === "confirmPassword") {
        fields[key] = formData[key] as string;
      }
    }

    return {
      status: "failed",
      errors: transformZodErrors(parsedFields.error),
      fields: fields,
    };
  }

  return {
    status: "failed",
    errors: undefined,
    fields: undefined,
  };
}
