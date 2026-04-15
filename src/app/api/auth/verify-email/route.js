import { authService } from "@/services/auth.service";
import { successResponse, errorResponse } from "@/lib/server/response";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const result = await authService.verifyEmail(url.searchParams.get("token"));

    const response = NextResponse.json(
      {
        success: true,
        message: "Email verified successfully! Welcome to ChatApp.",
        data: result,
      },
      { status: 200 },
    );

    // Set HTTP-only cookie so user is auto logged in after verification
    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
