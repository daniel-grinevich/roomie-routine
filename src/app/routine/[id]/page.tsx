import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { routineGroups, routines, SelectGroup, SelectRoutine, groupsToRoutines, users, SelectUser, groupUsers } from "@/server/db/schema";
import Link from "next/link";
import DeleteRoutineButton from "@/components/deleteRoutineButton/DeleteRoutineButton";

export default async function DetailRoutinePage({ params }: { params: { id: number } }) {
    const session = await getServerAuthSession();

    if (!session) {
        return <div>You must be signed in to view this page.</div>;
    }

    const routineList: SelectRoutine[] = await db
        .select()
        .from(routines)
        .where(eq(routines.id, params.id));

    const userList: SelectUser[] = await db
        .selectDistinct({
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
            emailVerified: users.emailVerified,
        })
        .from(groupUsers)
        .innerJoin(users, eq(users.id, groupUsers.userId))
        .innerJoin(groupsToRoutines, eq(groupUsers.groupId, groupsToRoutines.groupId))
        .innerJoin(routines, eq(groupsToRoutines.routineId, routines.id))
        .where(eq(routines.id, params.id));

    const groupList: SelectGroup[] = await db
        .select({
            id: routineGroups.id,
            name: routineGroups.name,
            createdBy: routineGroups.createdBy,
            color: routineGroups.color,
        })
        .from(routineGroups)
        .innerJoin(groupsToRoutines, eq(routineGroups.id, groupsToRoutines.groupId))
        .where(eq(groupsToRoutines.routineId, params.id));

    if (routineList.length === 0) {
        return <div>Routine not found</div>;
    }
    const routine = routineList[0];

    return (
        <div>
            <div className="border border-black p-4">
                <h1 className="text-5xl">Routine Details</h1>
            </div>
            <div className="grid gap-4 grid-cols-[1fr,1fr,1fr] mt-4">
                <div className="border border-black p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl">Name: {routine.name}</h1>
                        <p className="text-sm">Description: {routine.description}</p>
                        <p className="text-sm">Interval Value: {routine.intervalValue}</p>
                        <p className="text-sm">Interval Unit: {routine.intervalUnit}</p>
                        <p className="text-sm">Assigned To: {routine.assignedTo}</p>   
                        <p className="text-sm">Created By: {routine.createdBy}</p>
                        <p className="text-sm">Last To Do It: {routine.lastToDoIt}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link href={`/routine/${params.id}/edit`}>
                            <button className="border text-sm border-black p-2">Update</button>
                        </Link>
                        <DeleteRoutineButton routineId={params.id} />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="border border-black p-4">
                        <h2 className="text-3xl">Groups</h2>
                        {groupList.map((group) => (
                            <p key={group.id} className="text-sm">{group.name}</p>
                        ))}
                    </div>
                </div>
             
                <div className="border border-black p-4">
                    <h2 className="text-3xl">Users on this routine</h2>
                    {userList.map((user) => (
                        <p key={user.id} className="text-sm">{user.name}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}