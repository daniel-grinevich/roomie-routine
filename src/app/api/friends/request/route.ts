import { NextResponse } from 'next/server';
import { createFriendRequest } from '@/server/db/queries/insert';
import { getUserByEmailName } from '@/server/db/queries/select';
import { SelectUser } from '@/server/db/schema';
import { db } from '@/server/db';


export async function POST(request: Request) {

    const data = await request.json();
    const { friendEmail, friendName, userId } = data;

    const friends: SelectUser[] = await getUserByEmailName(friendEmail, friendName);

    if (friends.length === 0 ) {
        return NextResponse.json({message: `No friend found`});
    }

    const friend: SelectUser = friends[0];
    await createFriendRequest({ userId: userId, friendId: friend.id });

    return NextResponse.json({ message: `Friend request sent to ${friendName} (${friendEmail}) successfully!` });
}