"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//
import { FormState, signup } from "@/actions/auth";
import { authFormSchema } from "@/lib/validation/form";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AuthForm() {
  const [formState, formAction] = useActionState<FormState, FormData>(signup, {
    status: "idle",
  });

  const form = useForm<z.output<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      ...(formState?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

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

  return (
    <form
      action={formAction}
      ref={formRef}
      onSubmit={(evt) => {
        evt.preventDefault();
        form.handleSubmit(() => {
          startTransition(() => {
            formAction(new FormData(formRef.current!));
          });
        })(evt);
      }}
      className='w-[90%] max-w-[40rem] rounded-lg px-10 py-6 my-20 mx-auto bg-[#b8b4c3] shadow-md flex flex-col'
    >
      <div>
        <img
          src='/images/auth-icon.jpg'
          alt='A lock icon'
          className='block w-24 h-24 rounded-full mx-auto mt-4 drop-shadow-md'
        />
      </div>
      <p className='auth-form_row'>
        <label htmlFor='email' className='auth-form_label'>
          Email
        </label>
        <input
          type='email'
          id='email'
          className={cn("auth-form_input", {
            "auth-form_input_error": form.formState.errors?.email,
          })}
          {...form.register("email")}
        />

        {form.formState.errors?.email?.message && (
          <span className='auth-form_input_error_msg'>{form.formState.errors.email.message}</span>
        )}
      </p>
      <p className='auth-form_row'>
        <label htmlFor='password' className='auth-form_label'>
          Password
        </label>
        <input
          type='password'
          id='password'
          className={cn("auth-form_input", {
            "auth-form_input_error": form.formState.errors?.password,
          })}
          {...form.register("password")}
        />

        {form.formState.errors?.password?.message && (
          <span className='auth-form_input_error_msg'>{form.formState.errors.password.message}</span>
        )}
      </p>
      <p className='auth-form_row'>
        <label htmlFor='confirmPassword' className='auth-form_label'>
          Confirm password
        </label>
        <input
          type='password'
          id='confirmPassword'
          className={cn("auth-form_input", {
            "auth-form_input_error": form.formState.errors?.confirmPassword,
          })}
          {...form.register("confirmPassword")}
        />

        {form.formState.errors?.confirmPassword?.message && (
          <span className='auth-form_input_error_msg'>{form.formState.errors.confirmPassword.message}</span>
        )}
      </p>

      {formState?.errors && (
        <ul className='flex flex-col gap-1'>
          {formState.errors.map((error, idx) => (
            <li key={idx} className='flex flex-row gap-1 text-xs text-red-700'>
              {error.path} - {error.message}
            </li>
          ))}
        </ul>
      )}

      <p>
        <button
          type='submit'
          className='w-full p-2 rounded-md bg-[#4b34a9] text-[#d0cfd6] hover:bg-[#432aa3] focus:outline-none mt-8'
        >
          Create Account
        </button>
      </p>
      <p>
        <Link href='/' className='block my-4 text-center text-[#564f6e] hover:text-[#4b34a9] no-underline'>
          Login with existing account.
        </Link>
      </p>
      <span className='text-black text-xs'>* Hello#World9</span>
    </form>
  );
}
