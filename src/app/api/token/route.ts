import { NextResponse } from "next/server";

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export const GET = withApiAuthRequired(async function GET(req) {
  try {
    const { accessToken } = await getAccessToken(req, new NextResponse());
    return NextResponse.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
});
