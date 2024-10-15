import { NextResponse } from 'next/server';
import { groupUsers, InsertGroup, routineGroups } from '@/server/db/schema';
import { db } from "@/server/db";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const data: InsertGroup = await request.json();
        const newGroup = await db.insert(routineGroups).values(data).returning();  
        await db.insert(groupUsers).values({
            groupId: newGroup[0].id,
            userId: data.createdBy,
        })
        return NextResponse.json({group: newGroup[0]},{status:200})
    }
    catch (error) {
        console.log("Error inserting group: ", error);
        throw error;
    }
}