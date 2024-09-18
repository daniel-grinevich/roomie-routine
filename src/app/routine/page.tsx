// app/routines/page.tsx (Next.js 13+)
export default async function RoutinePage() {
    // Fetch data from the API route
    const res = await fetch('http://localhost:3000/api/routines', {
      cache: 'no-store', // Ensure fresh data is fetched on every request
    });
  
    if (!res.ok) {
      // Handle error
      return <p>Failed to load routines</p>;
    }
  
    const routinesData = await res.json();
  
    return (
      <div>
        <h1>Routines</h1>
        {routinesData.length > 0 ? (
          <ul>
            {routinesData.map((routine: any) => (
              <li key={routine.id}>
                <p>Name: {routine.name}</p>
                <p>Description: {routine.description}</p>
                <p>Frequency: {routine.frequency}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No routines found.</p>
        )}
      </div>
    );
  }