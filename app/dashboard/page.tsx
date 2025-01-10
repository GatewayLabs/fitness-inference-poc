"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Activity,
  Heart,
  Dumbbell,
  Timer,
  Flame,
  ChevronRight,
  Shield,
  Database,
  Play,
  Pause,
  WatchIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import { useWhoop } from "@/hooks/use-whoop";
import { useRouter } from "next/navigation";
import { saveWhoopTokens, validateState } from "@/lib/whoop/auth";
import { Workout } from "@/lib/types";
import { whoopActivities } from "@/lib/utils";
import { Chat } from "@/components/Chat";

export default function Dashboard() {
  const router = useRouter();
  const { isConnected, isLoading, error, profile, recentWorkouts } = useWhoop();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Fitness Coach. How can I help you with your workout today?",
    },
  ]);

  // Get current workout if available
  const currentWorkout: Workout = recentWorkouts?.[selectedWorkout];

  // Format heart rate data from the current workout
  const formattedHeartRateData = currentWorkout?.score?.zone_duration
    ? [
        {
          zone: "Zone 0",
          duration: currentWorkout.score.zone_duration.zone_zero_milli / 60000,
        },
        {
          zone: "Zone 1",
          duration: currentWorkout.score.zone_duration.zone_one_milli / 60000,
        },
        {
          zone: "Zone 2",
          duration: currentWorkout.score.zone_duration.zone_two_milli / 60000,
        },
        {
          zone: "Zone 3",
          duration: currentWorkout.score.zone_duration.zone_three_milli / 60000,
        },
        {
          zone: "Zone 4",
          duration: currentWorkout.score.zone_duration.zone_four_milli / 60000,
        },
        {
          zone: "Zone 5",
          duration: currentWorkout.score.zone_duration.zone_five_milli / 60000,
        },
      ].filter((zone) => zone.duration > 0)
    : [];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Based on your latest Whoop data, your workout intensity was ${
            currentWorkout?.score?.strain || "not recorded"
          }. Let's focus on recovery and proper form for your next session.`,
        },
      ]);
    }, 1000);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      try {
        const { state, ...tokens } = JSON.parse(
          decodeURIComponent(window.location.hash.slice(1))
        );

        if (!validateState(state)) {
          throw new Error("Invalid state parameter");
        }

        saveWhoopTokens(tokens);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        window.location.reload();
      } catch (e) {
        console.error("Failed to process OAuth callback:", e);
        router.push("/?error=" + encodeURIComponent("Authentication failed"));
      }
    }
  }, [router]);

  const getWorkoutMetrics = (workout: Workout) => ({
    type:
      whoopActivities.find((a) => a.id === workout.sport_id)?.name ||
      "Activity",
    difficulty: workout.score?.strain
      ? workout.score.strain > 15
        ? "High"
        : workout.score.strain > 8
        ? "Medium"
        : "Low"
      : "N/A",
    totalTime: workout
      ? Math.round(
          (new Date(workout.end).getTime() -
            new Date(workout.start).getTime()) /
            (1000 * 60)
        )
      : 0,
    calories: workout.score?.kilojoule
      ? Math.round(workout.score.kilojoule / 4.184) // Convert kJ to kcal
      : 0,
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">Workout Summary</h1>
            {profile && (
              <div className="text-sm text-gray-500">
                Welcome, {profile.first_name} {profile.last_name}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              onClick={() => {
                console.log("Exporting to data vaults...");
              }}
            >
              <Database className="h-4 w-4" />
              Export to Encrypted Data Vaults
            </Button>
            <ConnectButton />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Exercise Area */}
          <div className="col-span-8">
            <Card className="bg-gray-50 border-none p-8">
              {currentWorkout ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Latest Workout
                      </h2>
                      <p className="text-gray-600">
                        {format(parseISO(currentWorkout.start), "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold">
                          {currentWorkout.score?.average_heart_rate || "--"} BPM
                        </div>
                        <div className="text-sm text-gray-500">
                          Average Heart Rate
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {currentWorkout.score?.strain?.toFixed(1) || "--"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Strain Score
                        </div>
                      </div>
                    </div>

                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formattedHeartRateData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
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
                          <Bar
                            dataKey="duration"
                            fill="#ef4444"
                            name="Minutes"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {[
                      {
                        icon: Dumbbell,
                        label: getWorkoutMetrics(currentWorkout).type,
                        value: "Type",
                      },
                      {
                        icon: Activity,
                        label: getWorkoutMetrics(currentWorkout).difficulty,
                        value: "Intensity",
                      },
                      {
                        icon: Timer,
                        label: `${
                          getWorkoutMetrics(currentWorkout).totalTime
                        }min`,
                        value: "Duration",
                      },
                      {
                        icon: Flame,
                        label: `${
                          getWorkoutMetrics(currentWorkout).calories
                        }kcal`,
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
                        <div className="text-xs text-gray-500">
                          {item.value}
                        </div>
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
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            <Card className="p-6 border-none bg-gray-50">
              <h3 className="font-medium mb-4">RECENT WORKOUTS</h3>
              <div className="space-y-4">
                {recentWorkouts?.slice(0, 4).map((workout, i) => {
                  const metrics = getWorkoutMetrics(workout);
                  return (
                    <div
                      key={workout.id}
                      className={`flex items-center p-4 rounded-xl bg-white ${
                        i === selectedWorkout && "border-2 border-gray-200"
                      }`}
                      onClick={() => setSelectedWorkout(i)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {format(parseISO(workout.start), "MMM d, yyyy")}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {metrics.type} • {metrics.totalTime}min •{" "}
                          {metrics.calories}kcal
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
        </div>

        {/* AI Coach Section */}
        <Chat />
      </div>
    </div>
  );
}
