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
  assignedTo: string;
  createdBy: string;
  groupId: number | null;
}

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
  const [interval, setInterval] = useState('');
  const [intervalUnit, setIntervalUnit] = useState('');
  const [assignedTo, setAssignedTo] = useState('Myself');
  const [description, setDescription] = useState('');
  const [groupInput, setGroupInput] = useState('');
  const [filterGroup, setFilterGroup] = useState(groups);
  const [filterFriend, setFilterFriend] = useState(friends);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupInput(e.target.value);
    setSelectedGroup(null); // Reset selected group

    const suggestions = groups.filter((group) =>
      group.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterGroup(suggestions);
  };

  const handleAssignedToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignedTo(e.target.value);
    setSelectedFriend(null); // Reset selected friend

    if (friends.length > 0) {
      const suggestions = friends.filter((friend) =>
        friend?.name?.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilterFriend(suggestions);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Fetch form values
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const routineName = formData.get('name') as string;
    const routineInterval = formData.get('interval') as string;
    const routineIntervalUnit = formData.get('intervalUnit') as string;
    const routineAssignedTo = formData.get('assignedTo') as string;
    const routineDescription = formData.get('description') as string;

    let groupId = selectedGroup;

    // Check if the group exists or needs to be created
    if (groupId === null) {
      // Selected group does not exist, create a new group
      const newGroup: Group = {
        name: groupInput,
        createdBy: user,
      };
      const createdGroup = await createNewGroupRequest(newGroup);
      groupId = createdGroup.id; // Assuming the response contains the new group's id
    }

    // Create a new routine
    const newRoutine: Routine = {
      name: routineName,
      description: routineDescription,
      intervalValue: Number(routineInterval),
      intervalUnit: routineIntervalUnit,
      assignedTo: routineAssignedTo,
      createdBy: user,
      groupId: groupId, // Link routine to the selected or newly created group
    };

    let res = await createNewRoutineRequest(newRoutine);
  };

  return (
    <div className="p-4">
      <h5>Routine:</h5>
      <form className="flex flex-wrap gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col relative border border-black p-4 flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="name-input">Name:</label>
          <input id="name-input" name="name" type="text" placeholder="Enter name" className="mt-6" />
        </div>
        <div className="flex flex-col relative border border-black p-4 flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="interval-input">Frequency:</label>
          <div className="mt-6 flex gap-2">
            <input id="interval-input" name="interval" type="text" placeholder="Enter frequency" className="flex-grow" />
            <select id="interval-unit-select" name="intervalUnit" className="flex-none">
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col relative border border-black p-4 flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="assigned-to-input">Assigned to:</label>
          <input id="assigned-to-input" name="assignedTo" type="text" value={assignedTo} className="mt-6" onChange={handleAssignedToInputChange} />
        </div>
        <div className="flex flex-col relative border border-black p-4 w-full md:flex-grow">
          <label className="text-black absolute top-0 left-0 text-xs" htmlFor="description-input">Description:</label>
          <textarea id="description-input" name="description" placeholder="Enter description" className="mt-6 h-full"></textarea>
        </div>
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
          {groupInput && filterGroup && (
            <div className="mt-2 flex flex-col border border-black p-2 gap-4">
              <p className="text-xs text-gray-500">Is this the group you're thinking of?</p>
              <ul>
                {filterGroup.map((group) => (
                  <li
                    key={group.id}
                    onClick={() => {
                      setGroupInput(group.name);
                      setSelectedGroup(group.id);
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
        <div className="w-full flex justify-end pt-4">
          <button type="submit" className="border text-sm border-black p-2 min-w-[150px] hover:bg-black hover:text-white">Create</button>
        </div>
      </form>
    </div>
  );
}