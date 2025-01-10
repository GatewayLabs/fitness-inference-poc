// app/api/auth/whoop/callback/route.ts
import { WHOOP_AUTH_CONFIG } from "@/lib/whoop/auth";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    const errorMessage = error
      ? `${error}: ${searchParams.get("error_description")}`
      : "No code received";
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${
          process.env.NEXT_PUBLIC_BASE_URL
        }?error=${encodeURIComponent(errorMessage)}`,
      },
    });
  }

  try {
    const tokenResponse = await fetch(WHOOP_AUTH_CONFIG.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: WHOOP_AUTH_CONFIG.clientId,
        client_secret: process.env.WHOOP_CLIENT_SECRET!,
        code,
        redirect_uri: WHOOP_AUTH_CONFIG.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to get access token");
    }

    const tokens = await tokenResponse.json();

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/dashboard#${encodeURIComponent(
          JSON.stringify({ ...tokens, state })
        )}`,
      },
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${
          process.env.NEXT_PUBLIC_BASE_URL
        }?error=${encodeURIComponent("Token exchange failed")}`,
      },
    });
  }
}
