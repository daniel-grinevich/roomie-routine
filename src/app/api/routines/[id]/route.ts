import { NextResponse } from 'next/server';
import { routines, SelectRoutine, users } from '@/db/schema';
import { updateRoutine } from '@/server/db/queries/update';
import { db } from '@/server/db';
import { start } from 'repl';

export async function PUT(request: Request) {
  // Parse the JSON body from the request
  const requestBody = await request.json();
  console.log('PUT: routine/[id] request: ', requestBody);

  // Destructure to extract 'data', then further destructure to get 'id' and 'routine'
  const { data } = requestBody;
  const { id, ...routine } = data;

  console.log('ID:', id);       // Logs the id
  console.log('Routine:', routine);  // Logs the rest of the data excluding the id
  
  try {
    // Assuming `updateRoutine` is a function that takes an `id` and the data to update
    const updatedRoutine = await updateRoutine(id, routine);
    return NextResponse.json({message: `routine with id:${id} updated succesfully`, routine: updatedRoutine})
  } catch (error:any) {
    // Return a server error response
    return new Response(JSON.stringify({ error: 'Failed to update routine', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}