"use client";

import { useEffect, useState } from "react";
import { SelectGroup } from "@/server/db/schema";

// Fetch group data from the API
const getGroupData = async (groupId: number): Promise<SelectGroup> => {
    try {
        const res = await fetch(`/api/groups/${groupId}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch group data');
        }
        const data = await res.json();
        return data.group;
    } catch (error) {
        console.error('Error fetching group data:', error);
        throw error;
    }
};

export default function GroupPage({ params }: { params: { id: number } }) {
    const groupId: number = params.id;
    const [groupDetails, setGroupDetails] = useState<SelectGroup | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch group data when the component mounts
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const groupData = await getGroupData(groupId);
                setGroupDetails(groupData);
            } catch (error) {
                setError("Failed to load group data.");
            } finally {
                setLoading(false);
            }
        };

        fetchGroupData();
    }, [groupId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {groupDetails ? (
                <>
                    <h1>{groupDetails.name}</h1>
                    <p>Created by: {groupDetails.createdBy}</p>
                    <p>Color: {groupDetails.color ?? "No color assigned"}</p>
                </>
            ) : (
                <p>No group data available</p>
            )}
        </div>
    );
}