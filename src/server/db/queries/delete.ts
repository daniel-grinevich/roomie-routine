import { eq } from "drizzle-orm";
import {db} from "../index";
import { routines } from "@/server/db/schema";

export async function deleteRoutine(id: number): Promise<void> {
    const routineId = id;
    try { 
        await db.delete(routines).where(eq(routines.id, routineId));
    }
    catch (error) {
        console.error("Error deleting routine:", error);
        throw error;
    }
};