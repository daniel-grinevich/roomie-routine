import { InsertRoutine, routines, SelectUser, users } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { getUsersFriendsList } from "@/server/db/queries/select";



export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Get the start of the current day
        let startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        //validate the data coming in from varioius forms

        // Check that intervalValue is a number
        if (typeof data.intervalValue !== 'number') {
            return NextResponse.json({ error: 'intervalValue must be a number' }, { status: 400 });
        }

        // Check that intervalUnit is a string that contains days, weeks, or months
        if (!['days', 'weeks', 'months'].includes(data.intervalUnit)) {
            return NextResponse.json({ error: 'intervalUnit must be one of days, weeks, or months' }, { status: 400 });
        }

        // name should exist and be a string
        if (!data.name || typeof data.name !== 'string') {
            return NextResponse.json({ error: 'name must be a string' }, { status: 400 });
        }

        // description should exist and be a string
        if (!data.description || typeof data.description !== 'string') {
            return NextResponse.json({ error: 'description must be a string' }, { status: 400 });
        }

        // assignedTo should exist and be either the current user or a frind of the current user
        if (!data.assignedTo || typeof data.assignedTo !== 'string') {
            return NextResponse.json({ error: 'assignedTo must be a string' }, { status: 400 });
        }
        if (data.assignedTo !== data.createdBy) {
            const friendsList: SelectUser[] = await getUsersFriendsList(data.createdBy);
            
            let checker: boolean = false;
            let i = 0;
            while(!checker && i < friendsList.length) {
                if (friendsList[i] === data.assignedTo) {
                    checker = true;
                } 
            }
            if (!checker) {
                return NextResponse.json({error: "No friend found"},{status: 400})
            }
        }

        await db.insert(routines).values(data);  
        return NextResponse.json({ status: 200});
    } catch (error) {
        console.error('Error creating routine:', error);
        return NextResponse.json({ error: 'Failed to create routine' }, { status: 500 });
    }
  }