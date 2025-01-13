import { getWhoopTokens } from "./auth";

const whoopFetch = async (endpoint: string, options: RequestInit = {}) => {
  const tokens = getWhoopTokens();
  if (!tokens) {
    throw new Error("Not authenticated with Whoop");
  }

  const response = await fetch(`/api/whoop/${endpoint.replace(/^\//, "")}`, {
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
  return whoopFetch(`v1/activity/workout?limit=${limit}`);
};

export const getRecentSleeps = async (limit = 10) => {
  return whoopFetch(`v1/activity/sleep?limit=${limit}`);
};

export const getUserProfile = async () => {
  return whoopFetch("v1/user/profile/basic");
};

export const getBodyMeasurements = async () => {
  return whoopFetch("v1/user/measurement/body");
};
