"use client";

import { SelectGroup, SelectRoutine } from '@/server/db/schema'; // Import your schema
import RoutineCard from '@/components/routineCard/RoutineCard';
import { useEffect, useState } from 'react';
import { calculateDayDifference } from '@/utils/dateUtils';

interface HomePageProps {
    routineList: (SelectRoutine & { daysLeft: number})[]; // Add 'daysLeft' to the routine type
    userCreatedGroupList: SelectGroup[];
}

const getRoutinesByGroup = async (groupId: number, groupName: string): Promise<SelectRoutine[]> => {
    let res = await fetch(`/api/groups/${groupId}/${groupName}/routines`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch routines');
    }
    const data = await res.json();
    return data.routines;
};

export default function HomePage({ routineList, userCreatedGroupList }: HomePageProps) {

    const [groupId, setGroupId] = useState<number | null>(null);
    const [groupName, setGroupName] = useState<string | null>(null);
    const [routines, setRoutines] = useState(routineList);
    const [selectedRoutine, setSelectedRoutine] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [navGroupText, setNavGroupText] = useState<string>("Filter By Group 🔍:");


    useEffect(() => {
        const fetchRoutines = async () => {
            if (groupId && groupName) {

                try {
                    let res: SelectRoutine[] = await getRoutinesByGroup(groupId, groupName);
                    console.log("RES", res);
                    const updatedRoutines = res.map((routine) => {
                        const daysLeft = calculateDayDifference(routine.resetAt, new Date());
                        return { ...routine, daysLeft };
                    });
                    console.log("UPDATED ROUTINES", updatedRoutines);
                    setRoutines(updatedRoutines);
                }
                catch (error) {
                    console.error('Error fetching routines:', error);
                }
            }
        };
        fetchRoutines();
    }, [groupId, groupName]);

    useEffect(() => {
        console.log(selectedRoutine);
    }, [selectedRoutine]);

    const handleParentClick = () => {
        console.log("Parent clicked");
        setSelectedRoutine(null);
        setNavGroupText("Filter By Group 🔍:");

    }

    const handleRoutineCardClick = (event: React.MouseEvent<HTMLDivElement>, routineId: number) => {
        event.stopPropagation();
        setSelectedRoutine(null);
        setSelectedRoutine(routineId);
        setNavGroupText("Assign Routine To Group 🛠️:");
    }

    // Handle group selection
    const handleGroupClick = (group: SelectGroup, event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); // Prevent deselection when clicking on group

        setSelectedRoutine(null);
        setGroupId(group.id);
        setGroupName(group.name);
    };

    // Handle "All" group selection
    const handleAllClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); // Prevent deselection when clicking on "All"
        setSelectedRoutine(null);
        setGroupId(null);
        setGroupName(null);
        setRoutines(routineList);
    }


    return (
        <div id="container" className="mx-auto max-w-7xl" onClick={() => handleParentClick()}>
            <div className="border border-black p-4">
                <h1 className="text-5xl">Routines</h1>
            </div>
           {/* Group Selector */}
           <p className='mt-4 text-xs'>{navGroupText}</p>
           <div id="routine-group-container" className="flex flex-row gap-4 w-full overflow-x-scroll scroll-x-smooth mt-2">
                {/* "All" group */}
                <div
                    className={`border p-3 w-fit text-xs font-medium cursor-pointer ${
                        groupId === null && groupName === null
                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                            : 'bg-white text-black border-black'
                    }`}
                    onClick={handleAllClick}
                >
                    <h4>All</h4>
                </div>

                {/* User Created Groups */}
                {userCreatedGroupList.map((group) => (
                    <div 
                        key={group.id} 
                        className={`border p-3 w-fit text-xs font-medium cursor-pointer ${
                            groupId === group.id && groupName === group.name
                                ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                                : 'bg-white text-black border-black'
                        }`}
                        onClick={(e) => handleGroupClick(group, e)}
                    >
                        <h4>{group.name}</h4>
                    </div>
                ))}
            </div>
            <div id="mainContent" className="grid gap-4 my-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {routines.map((routine) => (
                    <RoutineCard 
                        key={routine.id} 
                        routine={routine} 
                        daysLeft={routine.daysLeft}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {handleRoutineCardClick(e, routine.id)}}
                        isSelected={selectedRoutine === routine.id}
                    />
                ))}
            </div>
        </div>
    );
}