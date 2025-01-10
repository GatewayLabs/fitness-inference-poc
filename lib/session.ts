import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

export interface ChatSession {
  clientPrivateKey?: string;
  clientPublicKey?: string;
  nodePublicKey?: string;
}

const sessionConfig = {
  password: process.env.SESSION_SECRET!,
  cookieName: "atoma_chat_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
    path: "/",
  },
};

// Get or create a session
export async function getSession() {
  const session = await getIronSession<ChatSession>(cookies(), sessionConfig);
  return session;
}
