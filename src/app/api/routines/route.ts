import { NextResponse } from 'next/server';
import { getAllRoutines } from '@/server/db/queries/select';
import { routines, users } from '@/server/db/schema';
import { db } from '@/server/db';

export async function POST(request: Request) {
  try {
      const data = await request.json();

      let startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);


      if (typeof data.name !== 'string') {
        // cast data.name to string
        data.name = data.name.toString();
      }

      await db.insert(routines).values({
          name: data.name,
          description: data.description,
          intervalValue: data.intervalValue,
          intervalUnit: data.intervalUnit,
          createdAt: new Date(),
          resetAt: startOfDay,
          lastToDoIt: data.createdBy, // Using the ID of the newly created fake user
          assignedTo: data.createdBy, // Using the ID of the newly created fake user
          createdBy: data.createdBy,
      });

      return NextResponse.json({ message: 'Routine created successfully!' });
  } catch (error) {
      console.error('Error creating routine:', error);
      return NextResponse.json({ error: 'Failed to create routine' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const routines = await getAllRoutines(); // Fetch all routines using the function
    return NextResponse.json(routines, { status: 200 }); // Return the routines as a JSON response
  } catch (error) {
    console.error('Error fetching routines:', error);
    return NextResponse.json({ error: 'Failed to fetch routines' }, { status: 500 });
  }
}