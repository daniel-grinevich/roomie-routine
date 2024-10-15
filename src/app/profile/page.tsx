import { getServerAuthSession } from "@/server/auth";
import { SelectFriendRequest, SelectUser, users } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import AddFriendForm from "@/components/addFriendForm/AddFriendForm";
import FriendRequests from "@/components/friendRequests/FriendRequests";
import {getUsersFriendsList, getUsersPendingFriendRequests} from "@/server/db/queries/select";


async function getUserInfo(userId: string): Promise<SelectUser> {
    const res = await db.select().from(users).where(eq(users.id, userId));
    return res[0];
}

export default async function Profile() {

    const session = await getServerAuthSession();
    const userId = session?.user?.id;

    let userInfo: SelectUser | undefined = undefined;
    let friendsList: Array<SelectUser> = [];
    let pendingRequest: Array<SelectFriendRequest> = [];

    if (userId) {
        userInfo = await getUserInfo(userId);
        friendsList = await getUsersFriendsList(userId);
        pendingRequest = await getUsersPendingFriendRequests(userId);
    }

    return (
        <div>
            <div className="border border-black p-4">
                <h1 className="text-5xl">Profile</h1>
            </div>
            <div className="border border-black p-4 mt-3">
            {userInfo?.image && (
                <img
                    src={userInfo.image}
                    height="50"
                    width="50"
                    alt="user-image"
                />
            )}
                {userInfo ? (
                    <div>
                        <p>name: {userInfo.name}</p>
                        <p>email: {userInfo.email}</p>
                    </div>
                ) : (
                    <p>No user information available.</p>
                )}
            </div>
            <div className="flex flex-row gap-4 mt-4">
                <div className="relative border border-black w-[30vw]">
                    <h2 className="text-md border-b border-r border-black p-3 bg-black text-white text-center">Friend List</h2>
                    <div className="mt-4 p-3">
                        {friendsList.length === 0? (
                            <p>No friends yet. You should add one :) and hopefully it doesn't break this website haha.</p>
                        ) : (
                            friendsList?.map((friend) => (
                                <p className="text-sm">{friend.name}</p>
                            ))
                        )}
                    </div>
                </div>
                <div className="relative border border-black w-[30vw]">
                    <h2 className="text-md border-b border-r border-black p-3 bg-black text-white text-center">Add Friend</h2>
                    <AddFriendForm />
                </div>
                <div className="border border-black  w-[30vw]">
                    <h2 className="text-md border-b border-r border-black p-3 bg-black text-white text-center">Pending Friend Requests</h2>
                    <FriendRequests data={pendingRequest} />
                </div>
            </div>
        </div>
    )
}