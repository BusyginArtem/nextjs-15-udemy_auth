"use client";

import { type LogoutFormState, logout } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import React, { useActionState, useEffect } from "react";

export default function LogoutForm() {
  const [formState, formAction, isPending] = useActionState<LogoutFormState, FormData>(logout, {
    status: "idle",
    error: undefined,
  });

  useEffect(() => {
    if (formState.status === "succeed") {
      redirect("/");
    }
  }, [formState.status]);

  /* {formState?.error && (
        <p className='flex flex-row gap-1 text-xs text-red-700'>
            {formState.error}
        </p>
      )} */

  return (
    <form action={formAction}>
      <button
        disabled={isPending}
        type='submit'
        className={cn(
          "cursor-pointer px-6 py-2 border-none bg-purple-700 text-gray-300 rounded-md hover:bg-purple-800 active:bg-purple-800",
          {
            "disabled:bg-gray-600 cursor-wait": isPending,
          }
        )}
      >
        Logout
      </button>
    </form>
  );
}
