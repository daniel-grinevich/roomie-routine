


import { getServerAuthSession } from "@/server/auth";
import { routines, routineGroups, users, groupUsers, groupsToRoutines} from "@/server/db/schema";
import { calculateDayDifference } from '@/utils/dateUtils';
import { db } from "@/server/db";
import { eq, or } from 'drizzle-orm';
import { SelectRoutine, SelectGroup } from "@/server/db/schema";
import HomePage from '@/components/homepage/HomePage';

async function getRoutinesByUser(userId: string): Promise<SelectRoutine[]> {
  const res = await db
    .selectDistinctOn([routines.id], 
      {
        id: routines.id,
        name: routines.name,
        description: routines.description,
        intervalValue: routines.intervalValue,
        intervalUnit: routines.intervalUnit,
        assignedTo: routines.assignedTo,
        createdBy: routines.createdBy,
        createdAt: routines.createdAt,
        resetAt: routines.resetAt,
        lastToDoIt: routines.lastToDoIt,
      }
    )
    .from(groupUsers)
    .innerJoin(groupsToRoutines, eq(groupUsers.groupId, groupsToRoutines.groupId))
    .innerJoin(routines, eq(groupsToRoutines.routineId, routines.id));

  return res;
}

async function getGroupsByUser(userId: string): Promise<SelectGroup[]> {
  const res = await db.select().from(routineGroups).where(eq(routineGroups.createdBy, userId));
  return res;
}

async function getUserName(userId: string): Promise<any> {
  const res = await db.select().from(users).where(eq(users.id, userId));
  console.log(res);
  return res;
}

export default async function Page() {
  const session = await getServerAuthSession();

  if (!session) {
    return <div>You must be signed in to view this page.</div>;
  }

  const userId = session.user.id;
  const routineList = await getRoutinesByUser(userId);
  const userCreatedGroupList = await getGroupsByUser(userId);

  // Preprocessing: Calculate days left for routines
  const routineListWithDaysLeft =  routineList.map((routine) => {
    const daysLeft = calculateDayDifference(routine.resetAt, new Date());
    return { ...routine, daysLeft };
  });

  // Pass the fetched data as props to the client component
  return <HomePage routineList={routineListWithDaysLeft} userCreatedGroupList={userCreatedGroupList} />;
}