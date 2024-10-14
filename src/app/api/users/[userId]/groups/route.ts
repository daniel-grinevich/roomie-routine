import { SelectGroup } from '@/server/db/schema';
import { NextResponse } from 'next/server';
import { getUserGroups } from '@/server/db/queries/select' 



export async function GET(request: Request, {params}: { params: { userId: string}}): Promise<NextResponse> {
    const userId  = params.userId;
    console.log('userid: ', userId);

    const groups: Array<SelectGroup> = await getUserGroups(userId);

    console.log("returned result of groups: ", groups)

    return NextResponse.json({status: 200, groups: groups});
}

// export async function GET(request: Request) 
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get('userId');

//   if (userId) {
//     try {
//       const routines = await getRoutinesByUser(userId);
//       return NextResponse.json(routines, { status: 200 });
//     } catch (error) {
//       console.error('Error fetching routines:', error);
//       return NextResponse.json({ error: 'Failed to fetch routines' }, { status: 500 });
//     }
//   } else {
//     // Handle the case where userId is not provided
//     return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 });
//   }
// }