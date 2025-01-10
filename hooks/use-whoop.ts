import { useState, useEffect } from "react";
import { generateWhoopAuthUrl, getWhoopTokens } from "@/lib/whoop/auth";
import {
  getRecentSleeps,
  getRecentWorkouts,
  getUserProfile,
} from "@/lib/whoop/api";
import { Sleep, Workout } from "@/lib/types";

export interface WhoopState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  profile: any | null;
  recentWorkouts: Workout[] | null;
  recentSleeps: Sleep[] | null;
}

export function useWhoop() {
  const [state, setState] = useState<WhoopState>({
    isConnected: false,
    isLoading: true,
    error: null,
    profile: null,
    recentWorkouts: null,
    recentSleeps: null,
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const tokens = getWhoopTokens();
        if (!tokens) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        const [profile, workouts, sleeps] = await Promise.all([
          getUserProfile(),
          getRecentWorkouts(15),
          getRecentSleeps(15),
        ]);

        setState({
          isConnected: true,
          isLoading: false,
          error: null,
          profile,
          recentWorkouts: workouts.records as Workout[],
          recentSleeps: sleeps.records as Sleep[],
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    checkConnection();
  }, []);

  const connect = () => {
    window.location.href = generateWhoopAuthUrl();
  };

  const disconnect = () => {
    localStorage.removeItem("whoop_tokens");
    setState({
      isConnected: false,
      isLoading: false,
      error: null,
      profile: null,
      recentWorkouts: null,
      recentSleeps: null,
    });
  };

  return {
    ...state,
    connect,
    disconnect,
  };
}
