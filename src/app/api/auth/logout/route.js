import { errorResponse } from "@/lib/server/response";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    );
    response.cookies.delete("token");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
