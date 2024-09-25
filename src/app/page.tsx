import { routines, SelectRoutine } from '@/server/db/schema'; // Import your schema
import { db } from '@/server/db/index'; // Import your database connection
import RoutineCard from '@/components/routineCard/RoutineCard';
import { calculateDayDifference } from '@/utils/dateUtils'
import { Suspense } from 'react';

async function getRoutines(): Promise<SelectRoutine[]> {
  const res = await db.select().from(routines);
  return res;
}

export default async function HomePage() {
  const routineList = await getRoutines();

  const routineListWithDaysLeft = routineList.map((routine) => {
    const daysLeft = calculateDayDifference(routine.resetAt, new Date());
    return { ...routine, daysLeft };
  });


  return (
    <div id="container" className="mx-auto max-w-7xl">
      <div className="border border-black p-4">
        <h1 className="text-5xl">Routines</h1>
      </div>
      <div id="mainContent" className="grid gap-4 my-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {routineListWithDaysLeft.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} daysLeft={routine.daysLeft} />
        ))}
      </div>
    </div>
  );
}