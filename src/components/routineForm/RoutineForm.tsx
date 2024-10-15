"use client";

import { SelectGroup, SelectUser } from "@/server/db/schema";
import { useState } from "react";

interface Group {
  name: string;
  createdBy: string | null;
}

interface Routine {
  name: string;
  description: string;
  intervalValue: number;
  intervalUnit: string;
  assignedTo: string | null;
  createdBy: string;
  groupId: number | null;
}

// Function to create a new group
async function createNewGroupRequest(group: Group) {
  const res = await fetch(`/api/groups/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(group),
  });

  if (!res.ok) {
    throw new Error('Failed to create group');
  }
  return res.json();
}

// Function to create a new routine
async function createNewRoutineRequest(routine: Routine) {
  const res = await fetch(`/api/routines/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routine),
  });

  if (!res.ok) {
    throw new Error('Failed to create routine');
  }
  return res.json();
}

export default function RoutineForm({ groups, friends, user }: { groups: SelectGroup[], friends: SelectUser[], user: string | null }) {
  const [name, setName] = useState('');
  const [intervalValue, setIntervalValue] = useState('');
  const [intervalUnit, setIntervalUnit] = useState('days');
  const [assignedTo, setAssignedTo] = useState<string | null>('Myself');
  const [description, setDescription] = useState('');
  const [groupInput, setGroupInput] = useState('');
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [filteredFriends, setFilteredFriends] = useState(friends);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

  // Handle group input change and filter suggestions
  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupInput(e.target.value);
    setSelectedGroupId(null); // Reset selected group
    const suggestions = groups.filter(group =>
      group.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredGroups(suggestions);
  };

  // Handle assigned to input change and filter suggestions for friends
  const handleAssignedToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignedTo(e.target.value);
    setSelectedFriendId(null); // Reset selected friend
    const suggestions = friends.filter(friend =>
      friend?.name?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredFriends(suggestions);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        // Determine which group to use (create new if not selected)
        let groupId = selectedGroupId;
        console.log("Selected Group ID before creation: ", groupId);
        
        // Create a new group if no existing group is selected and there is a group input
        if (groupId === null && groupInput) {
            console.log("Creating a new group...");
            const newGroup: Group = { name: groupInput, createdBy: user };

            // Wait for the new group creation
            const createdGroup = await createNewGroupRequest(newGroup);
            console.log("New Group Created: ", createdGroup.group);
            groupId = createdGroup.group.id; // Retrieve the new group ID
            console.log("New Group ID: ", groupId);
        }

        // Ensure the groupId is properly assigned
        if (!groupId) {
            console.error("Error: Group ID is not set properly.");
            return; // Prevent routine creation if no valid group ID
        }

        // Determine who the routine is assigned to
        const routineAssignedTo = selectedFriendId !== null 
            ? filteredFriends.find(friend => friend.id === selectedFriendId)?.name 
            : (assignedTo === 'Myself' ? user : assignedTo);

        // Log the assignment for debugging
        console.log("Routine will be assigned to: ", routineAssignedTo);

        // Create the routine object
        const newRoutine: Routine = {
            name,
            description,
            intervalValue: Number(intervalValue),
            intervalUnit,
            assignedTo: routineAssignedTo,
            createdBy: user,
            groupId: groupId, // Use the groupId from either selection or creation
        };

        // Submit the new routine
        const resultRoutines = await createNewRoutineRequest(newRoutine);
        console.log("New Routine Created: ", resultRoutines);
    } catch (error) {
        console.error("Error in creating routine or group: ", error);
    }
  };

  return (
    <div className="p-4">
      <h5>Create Routine</h5>
      <form className="flex flex-wrap gap-2" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="flex flex-col relative border border-black p-4 flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="name-input">Name:</label>
          <input
            id="name-input"
            name="name"
            type="text"
            placeholder="Enter routine name"
            className="mt-6"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Interval Field */}
        <div className="flex flex-col relative border border-black p-4 flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="interval-input">Frequency:</label>
          <div className="mt-6 flex gap-2">
            <input
              id="interval-input"
              name="interval"
              type="number"
              placeholder="Enter frequency"
              className="flex-grow"
              value={intervalValue}
              onChange={(e) => setIntervalValue(e.target.value)}
            />
            <select
              id="interval-unit-select"
              name="intervalUnit"
              value={intervalUnit}
              onChange={(e) => setIntervalUnit(e.target.value)}
              className="flex-none"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* Assigned To Field */}
        <div className="flex flex-col relative border border-black p-4 flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="assigned-to-input">Assigned to:</label>
          <input
            id="assigned-to-input"
            name="assignedTo"
            type="text"
            value={assignedTo ?? ""}
            className="mt-6"
            onChange={handleAssignedToInputChange}
          />
          {assignedTo !== 'Myself' && filteredFriends.length > 0 && (
            <div className="mt-2 flex flex-col border border-black p-2 gap-4">
              <p className="text-xs text-gray-500">Did you mean?</p>
              <ul>
                {filteredFriends.map((friend) => (
                  <li
                    key={friend.id}
                    onClick={() => {
                      setAssignedTo(friend.name);
                      setSelectedFriendId(friend.id);
                    }}
                    className="cursor-pointer"
                  >
                    {friend.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className="flex flex-col relative border border-black p-4 w-full md:flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="description-input">Description:</label>
          <textarea
            id="description-input"
            name="description"
            placeholder="Enter description"
            className="mt-6 h-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Group Field */}
        <div className="flex flex-col relative border border-black p-4 flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="group-input">Group:</label>
          <input
            id="group-input"
            name="group"
            type="text"
            placeholder="Enter group name"
            className="mt-6"
            value={groupInput}
            onChange={handleGroupInputChange}
          />
          {groupInput && filteredGroups.length > 0 && (
            <div className="mt-2 flex flex-col border border-black p-2 gap-4">
              <p className="text-xs text-gray-500">Is this the group you mean?</p>
              <ul>
                {filteredGroups.map((group) => (
                  <li
                    key={group.id}
                    onClick={() => {
                      setGroupInput(group.name);
                      setSelectedGroupId(group.id);
                    }}
                    className="cursor-pointer"
                  >
                    {group.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-end pt-4">
          <button type="submit" className="border text-sm border-black p-2 min-w-[150px] hover:bg-black hover:text-white">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}