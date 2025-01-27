"use client";

import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//
import { FormState } from "@/actions/auth";
import { LoginFormSchema, SignUpFormSchema } from "../validation/form";

export default function useFormState({
  formState,
  formSchema,
  defaultValues,
}: {
  formState: FormState;
  formSchema: any;
  defaultValues: LoginFormSchema | SignUpFormSchema;
}) {
  const form = useForm<LoginFormSchema | SignUpFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      ...(formState?.fields ?? {}),
    },
  });

  useEffect(() => {
    if (formState.status === "succeed") {
      redirect("/training");
    }
  }, [formState.status]);

  useEffect(() => {
    const emailError = formState?.errors?.find((error) => error.path === "email");

    if (emailError) {
      form.setError("email", emailError);
    }
  }, [formState?.errors]);

  //   form.formState.errors

  return [form, form.formState.errors];
}
