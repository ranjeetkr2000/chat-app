import "server-only";
import bcrypt from "bcryptjs";
import prisma from "@/lib/server/prisma";
import {
  generateVerificationToken,
  signToken,
  hashToken,
} from "@/lib/server/auth";
import {
  ValidationError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "@/lib/errors";

import { verificationService } from "@/services/verification.service";

// ── Shared Constants ───────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  statusMessage: true,
  isOnline: true,
  emailVerified: true,
  createdAt: true,
};

// ── Auth Service ───────────────────────────────────────────────────────────
export const authService = {
  // ── Register ─────────────────────────────────────────────────────────────
  async register({ name, email, password }) {
    // Validation
    if (!name || !email || !password) {
      throw new ValidationError("Name, email and password are required");
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("Invalid email address");
    }
    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters");
    }

    // Duplicate check
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError("An account with this email already exists");
    }

    // Hash password + create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: USER_SAFE_SELECT,
    });

    // Initiate verification
    await verificationService.initiateVerification({ user });

    return { user };
  },

  // ── Login ─────────────────────────────────────────────────────────────────
  async login({ email, password }) {
    // Validation
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("Invalid email address");
    }

    // Find user with password
    const user = await prisma.user.findUnique({
      where: { email },
      select: { ...USER_SAFE_SELECT, password: true },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.emailVerified) {
      await verificationService.initiateVerification({ user });
      throw new UnauthorizedError(
        "Email not verified. Verification email sent.",
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Update online status
    await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true, lastSeen: new Date() },
    });

    // Strip password before returning
    const { password: _, ...safeUser } = user;

    // Sign JWT
    const token = signToken({ id: safeUser.id, email: safeUser.email });

    return { user: safeUser, token };
  },

  // ── Verify Email ──────────────────────────────────────────────────────────
  async verifyEmail(rawToken) {
    if (!rawToken) {
      throw new ValidationError("Verification token is required");
    }

    const hashedToken = hashToken(rawToken);

    // Find token in DB
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        type: "EMAIL_VERIFICATION",
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new ValidationError("Invalid or expired verification token");
    }

    if (verificationToken.user.emailVerified) {
      throw new ConflictError("Email is already verified. Please log in.");
    }

    // Mark user as verified + delete token atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
      }),
      prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ]);

    // Sign JWT so user is auto logged in after verification
    const token = signToken({
      id: verificationToken.user.id,
      email: verificationToken.user.email,
    });

    return {
      token,
      user: {
        id: verificationToken.user.id,
        name: verificationToken.user.name,
        email: verificationToken.user.email,
        emailVerified: true,
      },
    };
  },
};
