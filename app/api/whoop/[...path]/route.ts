import { NextRequest, NextResponse } from "next/server";

const WHOOP_BASE_URL = "https://api.prod.whoop.com/developer";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json(
        { error: "No authorization header" },
        { status: 401 }
      );
    }

    const path = params.path.join("/");

    const response = await fetch(`${WHOOP_BASE_URL}/${path}`, {
      headers: {
        Authorization: authorization,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Whoop proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json(
        { error: "No authorization header" },
        { status: 401 }
      );
    }

    const path = params.path.join("/");
    const body = await req.json();

    const response = await fetch(`${WHOOP_BASE_URL}/${path}`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Whoop proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
