"use client";

import { useState, useEffect} from "react";
import { useRouter } from 'next/navigation';
import { SelectRoutine } from "@/server/db/schema";



// interface RoutineProp {
//     routine: SelectRoutine;
//     daysLeft: number;
//     onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
//     isSelected: boolean;
// }
  
export default function EditRoutinePage({params}: { params: { id: string } }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [intervalValue, setIntervalValue] = useState('');
    const [intervalUnit, setIntervalUnit] = useState('days');
    const [assignedTo, setAssignedTo] = useState<string>('Myself');
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    const { id } = params;

    // First fetch the routine data when component mounts
    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/routines/${id}`);
                const data = await response.json();
                
                // Set all the form fields with existing data
                setName(data.name);
                setDescription(data.description);
                setIntervalValue(data.intervalValue);
                setIntervalUnit(data.intervalUnit);
                setAssignedTo(data.assignedTo);
            } catch (error) {
                console.error('Error fetching routine:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const updatedRoutine = {
                id,  // include id if needed
                name,
                description,
                intervalValue,
                intervalUnit,
                assignedTo
            };
            const response = await fetch(`/api/routines/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: updatedRoutine // Wrap inside 'data'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update routine');
            }

            // Redirect back to routine details or list page
            router.push('/');
            // Or to details page: router.push(`/routines/${id}`);
            
        } catch (error) {
            console.error('Error updating routine:', error);
            // Handle error (show error message to user)
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <label className="block mb-2">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-2">Interval</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={intervalValue}
                        onChange={(e) => setIntervalValue(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <select
                        value={intervalUnit}
                        onChange={(e) => setIntervalUnit(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block mb-2">Assigned To</label>
                <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}