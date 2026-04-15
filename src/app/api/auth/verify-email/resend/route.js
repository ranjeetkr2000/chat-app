import { successResponse, errorResponse } from "@/lib/server/response";
import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";
import { generateVerificationToken } from "@/lib/server/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    const { user } = await userService.getByVerificationToken(token);

    // Generate + store verification token
    const { hashedToken, verifyToken, verifyTokenExpiresAt } =
      generateVerificationToken();

    await prisma.verificationToken.create({
      data: {
        token: hashedToken,
        type: "EMAIL_VERIFICATION",
        userId: user.id,
        expiresAt: verifyTokenExpiresAt,
      },
    });

    // Send verification email
    await sendVerificationEmail(user.email, verifyToken);

    return NextResponse.json(
      {
        success: true,
        message: "Email verification link sent successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
