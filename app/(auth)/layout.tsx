import LogoutForm from "@/components/Auth/logout-form";

export const metadata = {
  title: "Training App | Next Auth",
  description: "Next.js Authentication",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='flex justify-between items-center max-w-[50rem] mx-auto my-8'>
        <p className='text-lg'>Welcome back!</p>

        <LogoutForm />
      </header>
      {children}
    </>
  );
}
