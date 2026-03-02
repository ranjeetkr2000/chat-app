import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateVerificationToken, signToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // ── Validation ────────────────────────────────────────────
    if (!name || !email || !password) {
      return Response.json(
        { success: false, error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: "Invalid email address" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // ── Duplicate check ────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // ── Hash password ──────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    // ── Create user ────────────────────────────────────────────
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        statusMessage: true,
        isOnline: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // ── Generate + store verification token ───────────────────
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

    // ── Send verification email ────────────────────────────────
    await sendVerificationEmail(user.email, verifyToken);

    return Response.json(
      {
        success: true,
        message: "Account created successfully",
        data: { user },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return Response.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
