"use client";

import RoutineForm from "@/components/routineForm/RoutineForm";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface Friend {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
}

export default function CreateRoutinePage() {
  const { data: session, status } = useSession();

  const [groups, setGroups] = useState<{ id: number; name: string; createdBy: string; color: string | null; }[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Optional: Manage errors

  useEffect(() => {
    if (!session) return; // Ensure session exists

    const fetchData = async () => {
      try {
        // First API call to fetch groups
        const resGroups = await fetch(`/api/users/${session.user.id}/groups`);
        if (!resGroups.ok) {
          throw new Error("Failed to fetch groups");
        }
        const dataGroups = await resGroups.json();
        setGroups(dataGroups.groups);

        // Second API call to fetch friends
        const resFriends = await fetch(`/api/users/${session.user.id}/friends`);
        if (!resFriends.ok) {
          throw new Error("Failed to fetch friends");
        }
        const dataFriends = await resFriends.json();
        setFriends(dataFriends.friends);

        setLoading(false); // Set loading to false after both fetches
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Must be signed in to access this page!</p>;
  }

  return (
    <div>
      <div className="border border-black p-4">
        <h1 className="text-5xl">Create Routine</h1>
      </div>
      <div className="my-4 grid gap-4 grid-cols-[1fr,1fr]">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p> // Display error if it occurred
        ) : (
          <RoutineForm groups={groups} friends={friends} user={session?.user.id ?? null} />
        )}
        <div>
          <h1>test</h1>
        </div>
      </div>
    </div>
  );
}