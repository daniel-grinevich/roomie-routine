import { getUserGroups } from "@/server/db/queries/select"
import { getServerAuthSession } from "@/server/auth";
import { SelectGroup } from "@/server/db/schema";


export default async function GroupPage() {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    if (!userId) {
        return <div>You must be signed in to view this page.</div>;
    }
    const groupList: SelectGroup[] = await getUserGroups(userId);

    return (
        <div>
            {groupList.length === 0 ? (
                <p>You have not created any groups yet.</p>
            ) : (
                groupList.map((group) => (
                    <p key={group.id}>{group.name}</p>
                ))
            )}
        </div>
    )
}