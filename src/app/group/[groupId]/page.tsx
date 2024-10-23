"use client";

import { SelectGroup } from "@/server/db/schema";

const getGroupData = async (groupId: number): Promise<SelectGroup> => {
    let groupResult: SelectGroup;
    try {
        const res = await fetch(`/api/groups/${groupId}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!res.ok) {
            throw new Error('Failed to fetch group data');
        }
        const data = await res.json();
        groupResult = data.group;
        return groupResult;
    }
    catch (error) {
        console.error('Error fetching group data:', error);
        throw error;
    }
}

export default function GroupPage({params}: { params: {id: number}}) {
    const groupId: number = params.id; 
    const groupDetails: SelectGroup = getGroupData(groupId);


    return (
        <div>
            {groupDetails.name}
        </div>
    )
}