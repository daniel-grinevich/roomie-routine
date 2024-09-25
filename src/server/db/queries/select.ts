
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectRoutine, routines} from '../schema';


export async function getAllRoutines(): Promise<SelectRoutine[]> {
    try {
      // Query the 'routines' table using Drizzle ORM's query builder
      const result = await db.select().from(routines).orderBy(routines.id);
      return result;
    } catch (error) {
      console.error('Error fetching routines:', error);
      throw error; // Rethrow the error for handling elsewhere
    }
  }