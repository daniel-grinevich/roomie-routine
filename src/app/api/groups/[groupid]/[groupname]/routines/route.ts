import { SelectRoutine } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { getRoutinesByGroup } from "@/server/db/queries/select";

export async function GET(request: Request, { params }: { params: { groupid: string, groupname: string } }): Promise<Response> {

    const { groupid, groupname } = params;

    console.log("GROUP ID: ", groupid, "GROUP NAME: ", groupname);

    const groupId = parseInt(groupid);

    if (isNaN(groupId)) {
        return NextResponse.json({ error: 'Invalid groupId' }, { status: 400 });
    }

    try {
        let res: SelectRoutine[] = await getRoutinesByGroup(groupId, groupname);
        return NextResponse.json({ routines: res }, { status: 200 });
    } catch (error) {
        console.error('Error fetching routines:', error);
        return NextResponse.json({ error: 'Failed to fetch routines' }, { status: 500 });
    }
}