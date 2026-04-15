import { authService } from "@/services/auth.service";
import { successResponse, errorResponse } from "@/lib/server/response";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("YES");
    const body = await request.json();
    const result = await authService.login(body);
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        data: result,
      },
      { status: 200 },
    );
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
