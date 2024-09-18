"use client";

import { useState } from "react";

export default function CreateRoutinePage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        intervalValue: "",
        intervalUnit: "days", // Default to 'days'
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
            } else {
                alert("Failed to create routine.");
            }
        } catch (error) {
            console.error("Error creating routine:", error);
        }
    };

    return (
        <div>
            <h1>Create Routine</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="intervalValue">Frequency (e.g., 3):</label>
                    <input
                        type="number"
                        id="intervalValue"
                        name="intervalValue"
                        value={formData.intervalValue}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="intervalUnit">Interval Unit:</label>
                    <select
                        id="intervalUnit"
                        name="intervalUnit"
                        value={formData.intervalUnit}
                        onChange={handleChange}
                    >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                    </select>
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}