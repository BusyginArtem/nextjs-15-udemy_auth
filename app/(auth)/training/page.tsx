import { verifyAuth } from "@/lib/auth";
import { getTrainings } from "@/lib/training";
import { redirect } from "next/navigation";

export default async function TrainingPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/");
  }

  const trainingSessions = getTrainings();

  return (
    <main>
      <h1>Find your favorite activity</h1>
      <ul className='max-w-[40rem] mx-auto my-8 list-none grid gap-4 grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))]'>
        {trainingSessions.map((training) => (
          <li
            key={training.id}
            className='relative flex flex-col items-center my-4 rounded bg-[#0a0a0a] shadow-[0_0_10px_0_rgba(0,0,0,0.4)]'
          >
            <img className='w-full' src={`/trainings/${training.image}`} alt={training.title} />
            <div className='text-center'>
              <h2 className='mt-4 mb-0 ml-0 mr-0 px-4 text-[#d0cfd6] text-base uppercase'>{training.title}</h2>
              <p className='m-4 text-[#7c7a80]'>{training.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
