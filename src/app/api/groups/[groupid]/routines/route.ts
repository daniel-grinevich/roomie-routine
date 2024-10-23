import { NextResponse } from 'next/server';
import { db } from "@/server/db";
import { groupsToRoutines } from "@/server/db/schema";

export async function POST(request: Request, { params }: { params: { groupid: string } }) {
    const { groupid } = params;
    const { routineId } = await request.json();

    try {
        const newGroup = await db.insert(groupsToRoutines).values({
            groupId: parseInt(groupid),
            routineId: routineId,
        }).returning();
        return NextResponse.json({data: newGroup},{ status: 200 });

    }
    catch (error) {
        console.error('Error adding routine to group:', error);
        return NextResponse.json({ error: 'Failed to add routine to group' }, { status: 500 });
    }
}