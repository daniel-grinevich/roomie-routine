import { NextResponse } from "next/server";
import { getGroupsById } from "@/server/db/queries/select";


export async function GET(request: Request, {params}: { params: { groupid: number } }) {
    const { groupid } = params;

    try {
        const res = await getGroupsById(groupid);
        return NextResponse.json({ group: res }, { status: 200 });
    }
}