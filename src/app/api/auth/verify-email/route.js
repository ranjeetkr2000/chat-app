import prisma from "@/lib/prisma";
import { hashToken, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const verToken = new URL(req.url).searchParams.get("token");
    const hashedToken = hashToken(verToken);

    // 1️⃣ Validate token from DB using VerificationToken model
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        type: "EMAIL_VERIFICATION",
        expiresAt: {
          gt: new Date(), // not expired
        },
      },
      include: {
        user: true,
      },
    });

    if (!verificationToken) {
      return Response.json(
        { success: false, error: "Invalid or expired verification token" },
        { status: 401 },
      );
    }

    if (verificationToken.user.emailVerified) {
      return Response.json(
        { success: false, error: "Email is already verified. Please log in." },
        { status: 400 },
      );
    }

    // 2️⃣ Mark user as verified + delete token in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
      }),
      prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ]);

    // 3️⃣ Create JWT using existing signToken
    const token = signToken({
      id: verificationToken.user.id,
      email: verificationToken.user.email,
    });

    // 4️⃣ Set HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Email verified successfully! Welcome to ChatApp.",
        data: {
          token,
          user: {
            id: verificationToken.user.id,
            name: verificationToken.user.name,
            email: verificationToken.user.email,
            emailVerified: true,
          },
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
