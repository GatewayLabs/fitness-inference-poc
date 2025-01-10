"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useWhoop } from "@/hooks/use-whoop";
import { useRouter } from "next/navigation";
import { saveWhoopTokens, validateState } from "@/lib/whoop/auth";
import { Chat } from "@/components/Chat";
import { Workout } from "@/components/Workout";
import { getSleepMetrics, getWorkoutMetrics } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Sleep } from "@/components/Sleep";
import { WorkoutSidebar } from "@/components/WorkoutSidebar";
import { SleepSidebar } from "@/components/SleepSidebar";

export default function Dashboard() {
  const router = useRouter();
  const { profile, recentSleeps, recentWorkouts } = useWhoop();
  const [selectedTab, setSelectedTab] = useState<string>("workout");
  const [selectedWorkout, setSelectedWorkout] = useState<number>(0);
  const [selectedSleep, setSelectedSleep] = useState<number>(0);

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

  return (
    <div className="max-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto h-[calc(100vh-48px)] flex flex-col gap-6">
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

        <div className=" grid grid-cols-12 gap-6 mb-6">
          {/* Main Content Area */}
          <div className="col-span-8">
            <Tabs
              defaultValue="workout"
              className="h-full"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="workout">Workout</TabsTrigger>
                <TabsTrigger value="sleep">Sleep</TabsTrigger>
              </TabsList>

              <TabsContent value="workout" className="h-[calc(100%-40px)]">
                {recentWorkouts?.[selectedWorkout] ? (
                  <Workout workout={recentWorkouts?.[selectedWorkout]} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No workout data available
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sleep" className="h-[calc(100%-40px)]">
                {recentSleeps?.[selectedSleep] ? (
                  <Sleep sleep={recentSleeps?.[selectedSleep]} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No sleep data available
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="col-span-4">
            {selectedTab === "workout" ? (
              <WorkoutSidebar
                recentWorkouts={recentWorkouts}
                selectedWorkout={selectedWorkout}
                currentWorkout={recentWorkouts?.[selectedWorkout]}
                onWorkoutSelect={setSelectedWorkout}
              />
            ) : (
              <SleepSidebar
                recentSleeps={recentSleeps}
                selectedSleep={selectedSleep}
                currentSleep={recentSleeps?.[selectedSleep]}
                onSleepSelect={setSelectedSleep}
              />
            )}
          </div>
        </div>

        {/* AI Coach Section */}
        <Chat />
      </div>
    </div>
  );
}
