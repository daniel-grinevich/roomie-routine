import { SelectRoutine } from "@/db/schema";


export interface IntervalMap {
    [unit: string]: number;  // Mapping of units to their equivalent in days
}

const intervalMap: IntervalMap =  {
  "days": 1,
  "weeks": 7,
  "month": 31,
};

export const calculateDayDifference = (dateX: Date, dateY: Date): number => {
  let delta = dateX.getTime() - dateY.getTime();
  delta = Math.round(delta / (1000 * 3600 * 24));
  return delta
};

export const calculateFutureResetDate = (intervalUnit: string, intervalValue: number): Date => {
  const multiplier = intervalMap[intervalUnit] * intervalValue;
  const today = new Date();

  const nextDate = new Date(today.getTime() + (multiplier * 1000 * 60 * 60 * 24));

  return nextDate;
}



  // return routines.map((routine) => {
  //   const resetAt = new Date(routine.resetAt);
    
 
  //   // Calculate days left
  //   const diffInMs = resetAt.getTime() - today.getTime();
  //   const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert ms to days

  //   // Add daysLeft to the routine object
  //   return {
  //     ...routine,
  //     daysLeft,
  //   };
  // });