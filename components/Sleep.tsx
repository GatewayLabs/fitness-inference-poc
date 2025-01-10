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
import { Clock, Bed, Brain, Activity } from "lucide-react";
import { Sleep as SleepType } from "@/lib/types";
import { getSleepMetrics } from "@/lib/utils";

export function Sleep({ sleep }: { sleep?: SleepType }) {
  const sleepStageData = sleep?.score?.stage_summary
    ? [
        {
          name: "Light Sleep",
          minutes: Math.round(
            sleep.score.stage_summary.total_light_sleep_time_milli / 60000
          ),
          color: "#00A3FF",
        },
        {
          name: "REM Sleep",
          minutes: Math.round(
            sleep.score.stage_summary.total_rem_sleep_time_milli / 60000
          ),
          color: "#7B61FF",
        },
        {
          name: "Deep Sleep",
          minutes: Math.round(
            sleep.score.stage_summary.total_slow_wave_sleep_time_milli / 60000
          ),
          color: "#0047FF",
        },
      ]
    : [];

  return (
    <Card className="bg-gray-50 border-none p-8">
      {sleep ? (
        <>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Latest Sleep</h2>
              <p className="text-gray-600">
                {format(parseISO(sleep.start), "PPP")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">
                  {sleep.score?.sleep_efficiency_percentage?.toFixed(1) || "--"}
                  %
                </div>
                <div className="text-sm text-gray-500">Sleep Efficiency</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {sleep.score?.stage_summary?.sleep_cycle_count || "--"}
                </div>
                <div className="text-sm text-gray-500">Sleep Cycles</div>
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepStageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis
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
                  />
                  <Bar dataKey="minutes" fill="#0047FF" name="Duration" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              {
                icon: Clock,
                label: getSleepMetrics(sleep).totalTime,
                value: "Total Time",
              },
              {
                icon: Brain,
                label: getSleepMetrics(sleep).cycles.toString(),
                value: "Sleep Cycles",
              },
              {
                icon: Bed,
                label: getSleepMetrics(sleep).efficiency,
                value: "Efficiency",
              },
              {
                icon: Activity,
                label: getSleepMetrics(sleep).respiratoryRate,
                value: "Resp. Rate",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4"
              >
                <item.icon className="h-5 w-5 mb-2" />
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.value}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No sleep data available
        </div>
      )}
    </Card>
  );
}
