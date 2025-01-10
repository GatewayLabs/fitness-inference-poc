"use client";

import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Dumbbell, Timer, Flame } from "lucide-react";
import { Workout as WorkoutType } from "@/lib/types";
import { getWorkoutMetrics } from "@/lib/utils";

export function Workout({ workout }: { workout?: WorkoutType }) {
  const formattedHeartRateData = workout?.score?.zone_duration
    ? [
        {
          zone: "Zone 0",
          duration: workout.score.zone_duration.zone_zero_milli / 60000,
        },
        {
          zone: "Zone 1",
          duration: workout.score.zone_duration.zone_one_milli / 60000,
        },
        {
          zone: "Zone 2",
          duration: workout.score.zone_duration.zone_two_milli / 60000,
        },
        {
          zone: "Zone 3",
          duration: workout.score.zone_duration.zone_three_milli / 60000,
        },
        {
          zone: "Zone 4",
          duration: workout.score.zone_duration.zone_four_milli / 60000,
        },
        {
          zone: "Zone 5",
          duration: workout.score.zone_duration.zone_five_milli / 60000,
        },
      ].filter((zone) => zone.duration > 0)
    : [];

  return (
    <Card className="bg-gray-50 border-none p-8">
      {workout ? (
        <>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Latest Workout</h2>
              <p className="text-gray-600">
                {format(parseISO(workout.start), "PPP")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">
                  {workout.score?.average_heart_rate || "--"} BPM
                </div>
                <div className="text-sm text-gray-500">Average Heart Rate</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {workout.score?.strain?.toFixed(1) || "--"}
                </div>
                <div className="text-sm text-gray-500">Strain Score</div>
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedHeartRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="zone"
                    stroke="#888"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    stroke="#888"
                    fontSize={12}
                    label={{
                      value: "Minutes",
                      angle: -90,
                      position: "insideLeft",
                      offset: 0,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #f0f0f0",
                    }}
                    labelStyle={{ color: "#888" }}
                  />
                  <Bar dataKey="duration" fill="#ef4444" name="Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              {
                icon: Dumbbell,
                label: getWorkoutMetrics(workout).type,
                value: "Type",
              },
              {
                icon: Activity,
                label: getWorkoutMetrics(workout).difficulty,
                value: "Intensity",
              },
              {
                icon: Timer,
                label: `${getWorkoutMetrics(workout).totalTime}min`,
                value: "Duration",
              },
              {
                icon: Flame,
                label: `${getWorkoutMetrics(workout).calories}kcal`,
                value: "Calories",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4"
              >
                <item.icon className="h-5 w-5 mb-2" />
                <div className="text-sm font-medium">
                  {item.label.toString()}
                </div>
                <div className="text-xs text-gray-500">{item.value}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No workout data available
        </div>
      )}
    </Card>
  );
}
