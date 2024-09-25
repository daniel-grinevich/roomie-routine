"use client";

import { useState } from "react";

export default function CreateRoutinePage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        intervalValue: "",
        intervalUnit: "days", // Default to 'days'
    });
    const [errorName, setErrorName] = useState("");

    const validateName = (name: string) => {
        if (!name) {
            setErrorName("Name is required.");
            return false;
        }else if(name.length > 50) {
            setErrorName("Name must be between 1 and 50 characters.");
            return false;
        }else if (!name.match(/^[a-zA-Z0-9]+$/)) {
            setErrorName("Name can only contain letters and numbers.");
            return false;
        }
        setErrorName("");
        return true;
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (e.target.name === "name") {
            console.log("validate name");
            validateName(e.target.value);
        }

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/routines", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Routine created successfully!");
                setFormData({
                    name: "",
                    description: "",
                    intervalValue: "",
                    intervalUnit: "days",
                });
                setErrorName("");
            } else {
                alert("Failed to create routine.");
            }
        } catch (error) {
            console.error("Error creating routine:", error);
        }
    };

    return (
        <div className="mx-auto relative flex flex-col justify-center items-center border border-black">
            <div className="p-4">
                <h1 className="text-3xl">Create Routine</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4 items-center">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-black p-2"
                            required
                        />
                    </div>
                    <div className="h-[20px]">
                        {errorName && <p className="text-red-500">{errorName}</p>}
                    </div>
                </div>

                
                
                <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        className="border border-black p-2"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="intervalValue">Frequency (e.g., 3):</label>
                    <input
                        type="number"
                        id="intervalValue"
                        name="intervalValue"
                        value={formData.intervalValue}
                        onChange={handleChange}
                        className="border border-black p-2"
                        required
                    />
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="intervalUnit">Interval Unit:</label>
                    <select
                        id="intervalUnit"
                        name="intervalUnit"
                        value={formData.intervalUnit}
                        className="border border-black p-2"
                        onChange={handleChange}
                    >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                    </select>
                </div>
                <button className="text-white bg-black p-2 w-full"type="submit">Create</button>
            </form>
        </div>
    );
}