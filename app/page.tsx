import LoginForm from "@/components/Auth/login-from";
import SignUpForm from "@/components/Auth/signup-form";
import { verifyAuth } from "@/lib/auth";
import { FormMode } from "@/lib/types";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ ["mode"]: FormMode }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const result = await verifyAuth();

  if (result.user) {
    return redirect("/training");
  }

  const searchParams = await props.searchParams;
  const mode = searchParams.mode || "login";

  return <main className='max-w-[75%] mx-auto my-12'>{mode === "login" ? <LoginForm /> : <SignUpForm />}</main>;
}
