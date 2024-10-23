"use client"; // Ensure this is the first line

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
 

export default function DeleteRoutineButton({ routineId }: { routineId: number }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const router = useRouter(); // Use the router from Next.js

    const handleFirstDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsConfirmOpen(true);
    };

    const handleYesClick = async () => {
        try {
            const res = await fetch(`/api/routines/${routineId}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete routine');
            } 
        } catch (error) {
            console.error("Error deleting routine:", error);
        }
        setIsConfirmOpen(false);
        router.push('/'); // Redirect after successful deletion
    };

    const handleNoClick = () => {
        setIsConfirmOpen(false);
    };

    return (
        <div>
            <button className="border text-sm border-black p-2" onClick={handleFirstDeleteClick}>
                Delete
            </button>
            {isConfirmOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <div className="bg-white border-black border p-4 shadow-lg">
                            <h1 className="text-2xl">Are you sure?</h1>
                            <div className="flex flex-row gap-4 justify-center">
                                <button className="border text-sm border-black p-2 mt-4" onClick={handleNoClick}>No</button>
                                <button className="border text-sm border-black bg-red-500 p-2 mt-4" onClick={handleYesClick}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}