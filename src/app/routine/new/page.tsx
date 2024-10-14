"use client";

import RoutineForm from "@/components/routineForm/RoutineForm";
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react";



// This component is responsible for creating new routines. It uses SessionProvider to ensure
// that RoutineForm has access to the current user's session information.
export default function CreateRoutinePage() {
    const { data: session, status } = useSession();

    const [groups, setGroups] = useState(null);
    const [friends, setFriends] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return; // Ensure session exists
    
        const fetchData = async () => {
          try {
            // First API call to fetch groups
            const resGroups = await fetch(`/api/users/${session.user.id}/groups`);
            if (!resGroups.ok) {
              throw new Error('Failed to fetch groups');
            }
            const dataGroups = await resGroups.json();
            setGroups(dataGroups.groups);
    
            // Second API call to fetch friends
            const resFriends = await fetch(`/api/users/${session.user.id}/friends`);
            if (!resFriends.ok) {
              throw new Error('Failed to fetch friends');
            }
            const dataFriends = await resFriends.json();
            setFriends(dataFriends.friends);
    
            setLoading(false); // Set loading to false after both fetches
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
          }
        };
    
        fetchData();
      }, [session]);

    if (status === 'unauthenticated') {
        return <p>Must be signed in to access this page!</p>
    } else {
        return (
            <div>
                <div className="border border-black p-4">
                    <h1 className="text-5xl">Create Routine</h1>
                </div>
                <div className="my-4 grid gap-4 grid-cols-[1fr,1fr]">
                    {isLoading === false ? <RoutineForm groups={groups} friends={friends} user={session?.user.id} /> : <p>Loading</p>}
                    <div>
                        <h1>test</h1>
                    </div>
                </div>
            </div>
        );
    }
}