export default function Home() {


  const fakeRoutines = [
    { name: 'Clean under the stove', description: 'Clean the stove every day', frequency: 'Daily' },
    { name: 'Organize the fridge', description: 'Clean the fridge every week', frequency: 'Weekly' },
    { name: 'Vaccume the living room', description: 'Clean the kitchen every 2 weeks', frequency: 'Every 2 Weeks' },
    { name: 'Clean the toilet', description: 'Clean the bathroom once a month', frequency: 'Once a Month' },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      <div className="p-4 border-2 border-white">
        <div id="title" className="mb-4">
          <h1 className="text-5xl">Overdue</h1>
        </div>
        <div className="flex flex-row flex-wrap gap-4">
          {fakeRoutines.map((routine) => (
            <div className="w-[200px] p-4 border border-white">
              <p>{routine.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-2 border-white">
        <div id="title" className="mb-4">
          <h1 className="text-5xl">Upcoming</h1>
        </div>
        <div className="flex flex-row flex-wrap gap-4">
          
          <div className="w-[200px] p-4 border border-white">
            <p>Clean the stove</p>
          </div>
          <div className="w-[200px] p-4 border border-white">
            <p>Clean the stove</p>
          </div>
          <div className="w-[200px] p-4 border border-white">
            <p>Clean the stove</p>
          </div>
        </div>
      </div>
    </div>
  );
}