import { routineGroups, routines, SelectGroup, SelectRoutine } from '@/server/db/schema'; // Import your schema
import { db } from '@/server/db/index'; // Import your database connection
import RoutineCard from '@/components/routineCard/RoutineCard';
import { calculateDayDifference } from '@/utils/dateUtils'
import { getServerAuthSession } from "@/server/auth";
import { eq, inArray } from 'drizzle-orm';


async function getRoutinesByUser(userId: string): Promise<SelectRoutine[]> {
  const res = await db.select().from(routines).where(eq(routines.createdBy, userId));
  return res;
}

async function getGroupsByUser(userId: string): Promise<SelectGroup[]> {
  const res = await db.select().from(routineGroups).where(eq(routineGroups.createdBy, userId));
  return res;
}




// async function getGroupsByRoutines(routineList: SelectRoutine[]): Promise<SelectGroup[]> {
//   const routineIds = routineList.map(routine => routine.id); // Extract routine IDs from the list
//   const res = await db.selectDistinct()
//                     .from(groupRoutines)
//                     .leftJoin(routines, eq(groupRoutines.groupId, routines.id))
//                     .leftJoin(groups, eq(groups.id, groupRoutines.groupId))
//                     .where(inArray(routines.id, routineIds)); // Use inQuery to check if routines.id is in routineIds
//   return res;
// }


export default async function HomePage() {
  const session = await getServerAuthSession();

  const routineList = await getRoutinesByUser(session?.user?.id || '');
  const userCreatedGroupList = await getGroupsByUser(session?.user?.id || '');

  // const groupList = await getGroupsByRoutines(routineList);

  const routineListWithDaysLeft = routineList.map((routine) => {
    const daysLeft = calculateDayDifference(routine.resetAt, new Date());
    return { ...routine, daysLeft };
  });

  if (!session) {
    // You can redirect to the sign-in page or show a message
    return <div>You must be signed in to view this page.</div>;
  }


  return (
    <div id="container" className="mx-auto max-w-7xl">
      <div className="border border-black p-4">
        <h1 className="text-5xl">Routines</h1>
      </div>
      <div id="routine-group-container" className="flex flex-row gap-4 mt-4">
        <div className='border border-black p-4 w-fit bg-black text-white'>
          <h2 className="text-sm">All</h2>
        </div>
        {userCreatedGroupList.map((group) => (
          <div>{group.name}</div>
        ))}
      </div>
      <div id="mainContent" className="grid gap-4 my-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {routineListWithDaysLeft.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} daysLeft={routine.daysLeft} />
        ))}
      </div>
    </div>
  );
}