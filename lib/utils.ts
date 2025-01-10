import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Workout } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDuration = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const getWorkoutMetrics = (workout: Workout) => ({
  type:
    whoopActivities.find((a) => a.id === workout.sport_id)?.name || "Activity",
  difficulty: workout.score?.strain
    ? workout.score.strain > 15
      ? "High"
      : workout.score.strain > 8
      ? "Medium"
      : "Low"
    : "N/A",
  totalTime: workout
    ? Math.round(
        (new Date(workout.end).getTime() - new Date(workout.start).getTime()) /
          (1000 * 60)
      )
    : 0,
  calories: workout.score?.kilojoule
    ? Math.round(workout.score.kilojoule / 4.184)
    : 0,
});

export const getSleepMetrics = (sleep: any) => ({
  totalTime: formatDuration(
    sleep.score?.stage_summary?.total_in_bed_time_milli || 0
  ),
  cycles: sleep.score?.stage_summary?.sleep_cycle_count || 0,
  efficiency: `${Math.round(sleep.score?.sleep_efficiency_percentage || 0)}%`,
  respiratoryRate: sleep.score?.respiratory_rate?.toFixed(1) || "--",
});

export const whoopActivities = [
  { id: -1, name: "Activity" },
  { id: 0, name: "Running" },
  { id: 1, name: "Cycling" },
  { id: 16, name: "Baseball" },
  { id: 17, name: "Basketball" },
  { id: 18, name: "Rowing" },
  { id: 19, name: "Fencing" },
  { id: 20, name: "Field Hockey" },
  { id: 21, name: "Football" },
  { id: 22, name: "Golf" },
  { id: 24, name: "Ice Hockey" },
  { id: 25, name: "Lacrosse" },
  { id: 27, name: "Rugby" },
  { id: 28, name: "Sailing" },
  { id: 29, name: "Skiing" },
  { id: 30, name: "Soccer" },
  { id: 31, name: "Softball" },
  { id: 32, name: "Squash" },
  { id: 33, name: "Swimming" },
  { id: 34, name: "Tennis" },
  { id: 35, name: "Track & Field" },
  { id: 36, name: "Volleyball" },
  { id: 37, name: "Water Polo" },
  { id: 38, name: "Wrestling" },
  { id: 39, name: "Boxing" },
  { id: 42, name: "Dance" },
  { id: 43, name: "Pilates" },
  { id: 44, name: "Yoga" },
  { id: 45, name: "Weightlifting" },
  { id: 47, name: "Cross Country Skiing" },
  { id: 48, name: "Functional Fitness" },
  { id: 49, name: "Duathlon" },
  { id: 51, name: "Gymnastics" },
  { id: 52, name: "Hiking/Rucking" },
  { id: 53, name: "Horseback Riding" },
  { id: 55, name: "Kayaking" },
  { id: 56, name: "Martial Arts" },
  { id: 57, name: "Mountain Biking" },
  { id: 59, name: "Powerlifting" },
  { id: 60, name: "Rock Climbing" },
  { id: 61, name: "Paddleboarding" },
  { id: 62, name: "Triathlon" },
  { id: 63, name: "Walking" },
  { id: 64, name: "Surfing" },
  { id: 65, name: "Elliptical" },
  { id: 66, name: "Stairmaster" },
  { id: 70, name: "Meditation" },
  { id: 71, name: "Other" },
  { id: 73, name: "Diving" },
  { id: 74, name: "Operations - Tactical" },
  { id: 75, name: "Operations - Medical" },
  { id: 76, name: "Operations - Flying" },
  { id: 77, name: "Operations - Water" },
  { id: 82, name: "Ultimate" },
  { id: 83, name: "Climber" },
  { id: 84, name: "Jumping Rope" },
  { id: 85, name: "Australian Football" },
  { id: 86, name: "Skateboarding" },
  { id: 87, name: "Coaching" },
  { id: 88, name: "Ice Bath" },
  { id: 89, name: "Commuting" },
  { id: 90, name: "Gaming" },
  { id: 91, name: "Snowboarding" },
  { id: 92, name: "Motocross" },
  { id: 93, name: "Caddying" },
  { id: 94, name: "Obstacle Course Racing" },
  { id: 95, name: "Motor Racing" },
  { id: 96, name: "HIIT" },
  { id: 97, name: "Spin" },
  { id: 98, name: "Jiu Jitsu" },
  { id: 99, name: "Manual Labor" },
  { id: 100, name: "Cricket" },
  { id: 101, name: "Pickleball" },
  { id: 102, name: "Inline Skating" },
  { id: 103, name: "Box Fitness" },
  { id: 104, name: "Spikeball" },
  { id: 105, name: "Wheelchair Pushing" },
  { id: 106, name: "Paddle Tennis" },
  { id: 107, name: "Barre" },
  { id: 108, name: "Stage Performance" },
  { id: 109, name: "High Stress Work" },
  { id: 110, name: "Parkour" },
  { id: 111, name: "Gaelic Football" },
  { id: 112, name: "Hurling/Camogie" },
  { id: 113, name: "Circus Arts" },
  { id: 121, name: "Massage Therapy" },
  { id: 123, name: "Strength Trainer" },
  { id: 125, name: "Watching Sports" },
  { id: 126, name: "Assault Bike" },
  { id: 127, name: "Kickboxing" },
  { id: 128, name: "Stretching" },
  { id: 230, name: "Table Tennis" },
  { id: 231, name: "Badminton" },
  { id: 232, name: "Netball" },
  { id: 233, name: "Sauna" },
  { id: 234, name: "Disc Golf" },
  { id: 235, name: "Yard Work" },
  { id: 236, name: "Air Compression" },
  { id: 237, name: "Percussive Massage" },
  { id: 238, name: "Paintball" },
  { id: 239, name: "Ice Skating" },
  { id: 240, name: "Handball" },
];
