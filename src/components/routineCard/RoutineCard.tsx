"use client";

import { useState } from "react";
import { SelectRoutine } from "@/server/db/schema";
import { calculateDayDifference, calculateFutureResetDate } from "@/utils/dateUtils";
import { nunitoSans } from "@/app/ui/fonts";
import Link from "next/link";

interface RoutineProp {
  routine: SelectRoutine;
  daysLeft: number;
  onClick: () => void;
}

export default function RoutineCard({ routine, daysLeft, onClick, isSelected }: RoutineProp) {
  const [days, setDays] = useState(daysLeft);

  async function updateRoutine(routine: SelectRoutine): Promise<SelectRoutine | null> {
    try {
      const res = await fetch(`http://localhost:3000/api/routines/${routine.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: routine })
      });

      if (res.ok) {
        const responseData = await res.json();
        return responseData.routine[0]
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error updating routine:", error);
      throw error;
    }
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Compelted button clicked");
    event.stopPropagation();
    const newResetDate = calculateFutureResetDate(routine.intervalUnit, routine.intervalValue);
    const updatedRoutine = { ...routine, resetAt: newResetDate };
    const result = await updateRoutine(updatedRoutine);
    if (result) {
      console.log("update result: ", result);
      setDays(calculateDayDifference(new Date(result.resetAt), new Date()));
    }

  };

  return (
    <div 
      className={`relative h-[250px] sm:h-[275px] md:h-[300px] p-3 flex flex-col cursor-pointer border ${
        isSelected
          ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
          : 'border-black'
      }`}
      onClick={onClick}
    >
      <p className="absolute text-xs top-0 left-0 text-gray-500 mx-2 my-1">id: {routine.id}</p>
      <div className="flex flex-col mt-3 h-[75px] sm:h-[100px] md:h-[125px] overflow-hidden">
        <h3 className="text-xl">{routine.name}</h3>
        <p className={`${nunitoSans.className} line-clamp-3`}>{routine.description}</p>
      </div>
      <p>Days left: {days}</p>
      <div className={`${nunitoSans.className} flex flex-row gap-1 text-xs flex-wrap`}>
        <p className="">Assigned to: {routine.assignedTo},</p>
        <p>Last to do it: {routine.lastToDoIt},</p>
        <p>Do it every {routine.intervalValue} {routine.intervalUnit}</p>
      </div>
      <div className="flex justify-between gap-1 w-full mt-auto">
        <Link href={`/routine/${routine.id}`}>
          <button className="border text-sm border-black p-2">View Details</button>
        </Link>
        <button className="border text-sm border-black p-2" onClick={handleClick}>Completed!</button>
      </div>
      <div className="absolute top-0 right-0 mx-2 my-1 flex">
      {days <= 0 ? (
        <p>❗</p>
      ) : days <= 3 ? (
        <p>👀</p>
      ) : (
        <p>😌</p>
      )}
      </div>
    </div>
  );
}
