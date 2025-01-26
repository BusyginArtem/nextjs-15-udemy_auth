import LoginForm from "@/components/Auth/login-from";
import SignUpForm from "@/components/Auth/signup-form";
import { FormMode } from "@/lib/types";

type SearchParams = Promise<{ ["mode"]: FormMode }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const mode = searchParams.mode || "login";

  return <main className='max-w-[75%] mx-auto my-12'>{mode === "login" ? <LoginForm /> : <SignUpForm />}</main>;
}
