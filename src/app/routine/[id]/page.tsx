import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { routines, SelectRoutine } from "@/server/db/schema";


export default async function DetailRoutinePage({ params }: { params: { id: number } }) {

    const session = await getServerAuthSession();

    if (!session) {
        return <div>You must be signed in to view this page.</div>;
    }

    const routineList: SelectRoutine[] = await db.select().from(routines).where(eq(routines.id, params.id));

    if (routineList.length === 0) {
        return <div>Routine not found</div>;
    }
    const routine = routineList[0];



    return <div>{routine.name}</div>
}