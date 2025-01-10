"use client";

import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { WatchIcon, Shield } from "lucide-react";
import { Workout } from "@/lib/types";
import { getWorkoutMetrics } from "@/lib/utils";

interface WorkoutSidebarProps {
  recentWorkouts: Workout[] | null;
  selectedWorkout: number;
  currentWorkout?: Workout;
  onWorkoutSelect: (index: number) => void;
}

export function WorkoutSidebar({
  recentWorkouts,
  selectedWorkout,
  currentWorkout,
  onWorkoutSelect,
}: WorkoutSidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-none bg-gray-50">
        <h3 className="font-medium mb-4">RECENT WORKOUTS</h3>
        <div className="space-y-4">
          {recentWorkouts?.slice(0, 4).map((workout, i) => {
            const metrics = getWorkoutMetrics(workout);
            return (
              <div
                key={workout.id}
                className={`flex items-center p-4 rounded-xl bg-white cursor-pointer hover:bg-gray-50 transition-colors ${
                  i === selectedWorkout && "border-2 border-gray-200"
                }`}
                onClick={() => onWorkoutSelect(i)}
              >
                <div className="flex-1">
                  <h4 className="font-medium">
                    {format(parseISO(workout.start), "MMM d, yyyy")}
                  </h4>
                  <div className="text-sm text-gray-500">
                    {metrics.type} • {metrics.totalTime}min • {metrics.calories}
                    kcal
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {workout.score?.strain?.toFixed(1) || "--"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Connected Device Status */}
      <Card className="p-6 border-none bg-gray-50">
        <div className="flex items-center gap-2 mb-4">
          <WatchIcon className="h-5 w-5" />
          <h3 className="font-medium">Connected Device</h3>
        </div>
        <div className="space-y-2 bg-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Whoop 4.0</span>
            <span className="text-xs text-green-500">Connected</span>
          </div>
          <div className="text-xs text-gray-500">
            Last synced:{" "}
            {currentWorkout
              ? format(parseISO(currentWorkout.updated_at), "PP p")
              : "Never"}
          </div>
        </div>
      </Card>

      <div className="text-xs text-gray-500 text-right flex items-center justify-end gap-1">
        <Shield className="h-3 w-3" />
        Powered by Gateway Network
      </div>
    </div>
  );
}
