"use server";

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/users";
import { transformZodErrors } from "@/lib/utils";
import { loginFormSchema, signUpFormSchema } from "@/lib/validation/form";

// type Status = "succeed" | "failed" | "idle";

type SignUpFields = {
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginFields = {
  email: string;
  password: string;
};

// export type FormState = {
//   status: Status;
//   fields?: LoginFields | SignUpFields;
//   errors?: { path: string; message: string }[];
// };

export type FormState =
  | {
      status: "succeed";
      fields: LoginFields | SignUpFields;
      errors: undefined;
    }
  | {
      status: "failed";
      fields: SignUpFields | LoginFields | undefined;
      errors: { path: string; message: string }[] | undefined;
    }
  | {
      status: "idle";
      fields: undefined;
      errors: undefined;
    };

export async function signup(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);

  const parsedFields = signUpFormSchema.safeParse(formData);

  if (parsedFields.success) {
    const hashedPassword = hashUserPassword(parsedFields.data.password);

    try {
      const userId = await createUser(parsedFields.data.email, hashedPassword);

      await createAuthSession(userId);
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
    const fields: SignUpFields = {
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

export async function login(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsedFields = loginFormSchema.safeParse(formData);

  if (parsedFields.success) {
    const user = await getUserByEmail(parsedFields.data.email);

    if (!user) {
      return {
        status: "failed",
        errors: [{ message: "User with this email doesn't exist!", path: "email" }],
        fields: parsedFields.data,
      };
    }

    const isValidPassword = verifyPassword(user.password, parsedFields.data.password);

    if (!isValidPassword) {
      return {
        status: "failed",
        errors: [{ message: "Password is wrong!", path: "password" }],
        fields: parsedFields.data,
      };
    }

    await createAuthSession(user.id);

    return {
      status: "succeed",
      errors: undefined,
      fields: parsedFields.data,
    };
  }

  if (parsedFields.error) {
    const fields: LoginFields = {
      email: "",
      password: "",
    };

    for (const key of Object.keys(formData)) {
      if (key === "email" || key === "password") {
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
