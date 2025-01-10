import { getWhoopTokens } from "./auth";

const WHOOP_API_BASE = "https://api.prod.whoop.com/developer";

const whoopFetch = async (endpoint: string, options: RequestInit = {}) => {
  const tokens = getWhoopTokens();
  if (!tokens) {
    throw new Error("Not authenticated with Whoop");
  }

  const response = await fetch(`${WHOOP_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${tokens.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Whoop API error: ${response.statusText}`);
  }

  return response.json();
};

export const getRecentWorkouts = async (limit = 10) => {
  return whoopFetch(`/v1/activity/workout?limit=${limit}`);
};

export const getRecentCycles = async (limit = 10) => {
  return whoopFetch(`/v1/cycle?limit=${limit}`);
};

export const getRecentRecoveries = async (limit = 10) => {
  return whoopFetch(`/v1/recovery?limit=${limit}`);
};

export const getUserProfile = async () => {
  return whoopFetch("/v1/user/profile/basic");
};

export const getBodyMeasurements = async () => {
  return whoopFetch("/v1/user/measurement/body");
};
