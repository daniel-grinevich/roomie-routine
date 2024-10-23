import { NextResponse } from 'next/server';
import { updateRoutine } from '@/server/db/queries/update';
import { deleteRoutine } from '@/server/db/queries/delete';
import { getRoutine } from '@/server/db/queries/select';

export async function GET(request: Request, { params }: { params: { id: number } }) {
  const id = params.id;
  try {
    const routine = await getRoutine(id);
    return NextResponse.json(routine);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get routine', details: error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

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

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
  const id = params.id;

  try {
    await deleteRoutine(id);
  }
  catch (error) {
    console.error('Error deleting routine: ', error);
  }

}