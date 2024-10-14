import { SelectUser } from '@/server/db/schema';
import { NextResponse } from 'next/server';
import { getUserGroups, getUsersFriendsList } from '@/server/db/queries/select' 



export async function GET(request: Request, {params}: { params: { userId: string}}): Promise<NextResponse> {
    const userId  = params.userId;
    console.log('userid: ', userId);

    const friends: Array<SelectUser> = await getUsersFriendsList(userId);

    console.log("returned result of friends list: ", friends)

    return NextResponse.json({status: 200, friends: friends});
}