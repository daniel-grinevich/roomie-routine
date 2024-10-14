import { NextResponse } from 'next/server';
import { InsertGroup, routineGroups } from '@/server/db/schema';
import { db } from "@/server/db";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const data: InsertGroup = await request.json();
        await db.insert(routineGroups).values(data);
        return NextResponse.json({body: "succesfully created a new group"},{status:200})
    }
    catch (error) {
        console.log("Error inserting group: ", error);
        throw error;
    }
}