export const WHOOP_AUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_WHOOP_CLIENT_ID!,
  redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/whoop/callback`,
  authorizeUrl: "https://api.prod.whoop.com/oauth/oauth2/auth",
  tokenUrl: "https://api.prod.whoop.com/oauth/oauth2/token",
  scopes: [
    "read:recovery",
    "read:cycles",
    "read:workout",
    "read:sleep",
    "read:profile",
    "read:body_measurement",
  ],
};

const generateRandomState = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

export const generateWhoopAuthUrl = () => {
  const state = generateRandomState();
  localStorage.setItem("whoop_auth_state", state);

  const params = new URLSearchParams({
    client_id: WHOOP_AUTH_CONFIG.clientId,
    redirect_uri: WHOOP_AUTH_CONFIG.redirectUri,
    response_type: "code",
    scope: WHOOP_AUTH_CONFIG.scopes.join(" "),
    state: state,
  });

  return `${WHOOP_AUTH_CONFIG.authorizeUrl}?${params.toString()}`;
};

export const validateState = (receivedState: string | null) => {
  const storedState = localStorage.getItem("whoop_auth_state");
  localStorage.removeItem("whoop_auth_state");
  return storedState && receivedState && storedState === receivedState;
};

export const saveWhoopTokens = (tokens: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) => {
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  localStorage.setItem(
    "whoop_tokens",
    JSON.stringify({
      ...tokens,
      expires_at: expiresAt,
    })
  );
};

export const getWhoopTokens = () => {
  const tokens = localStorage.getItem("whoop_tokens");
  if (!tokens) return null;

  const parsedTokens = JSON.parse(tokens);
  if (Date.now() > parsedTokens.expires_at) {
    localStorage.removeItem("whoop_tokens");
    return null;
  }

  return parsedTokens;
};
