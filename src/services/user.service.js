import "server-only";
import bcrypt from "bcryptjs";
import prisma from "@/lib/server/prisma";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} from "@/lib/errors";
import { hashToken } from "@/lib/server/auth";

// ── Shared Constants ───────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  statusMessage: true,
  isOnline: true,
  lastSeen: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
};

// ── User Service ───────────────────────────────────────────────────────────
export const userService = {
  // ── Get My Profile ────────────────────────────────────────────────────────
  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: USER_SAFE_SELECT,
    });

    if (!user) throw new NotFoundError("User not found");

    return { user };
  },

  // ── Update My Profile ─────────────────────────────────────────────────────
  async updateMe(
    userId,
    { name, avatar, statusMessage, password, currentPassword },
  ) {
    const updateData = {};

    if (name !== undefined && name !== null) {
      if (name.trim() === "") throw new ValidationError("Name cannot be empty");
      updateData.name = name.trim();
    }

    if (avatar !== undefined && avatar !== null) {
      updateData.avatar = avatar;
    }

    if (statusMessage !== undefined && statusMessage !== null) {
      if (statusMessage.length > 100) {
        throw new ValidationError(
          "Status message must be less than 100 characters",
        );
      }
      updateData.statusMessage = statusMessage.trim();
    }

    // Handle password change
    if (password) {
      if (!currentPassword) {
        throw new ValidationError(
          "Current password is required to change password",
        );
      }
      if (password.length < 6) {
        throw new ValidationError("New password must be at least 6 characters");
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      const isValid =
        user?.password &&
        (await bcrypt.compare(currentPassword, user.password));
      if (!isValid) throw new UnauthorizedError("Invalid current password");

      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      throw new ValidationError("No update data provided");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: USER_SAFE_SELECT,
    });

    return { user: updatedUser };
  },

  // ── Delete My Account ─────────────────────────────────────────────────────
  async deleteMe(userId) {
    await prisma.user.delete({ where: { id: userId } });
    return null;
  },

  // ── Search User by Email ──────────────────────────────────────────────────
  async searchByEmail(email, currentUserId) {
    if (!email) throw new ValidationError("Email query parameter is required");

    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("Invalid email address format");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
        NOT: { id: currentUserId },
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        statusMessage: true,
        isOnline: true,
        lastSeen: true,
      },
    });

    if (!user) throw new NotFoundError("No user found with that email");

    return { user };
  },

  // ── Get User by ID ────────────────────────────────────────────────────────
  async getById(id) {
    if (!id) throw new ValidationError("User ID is required");

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        statusMessage: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundError("User not found");

    return { user };
  },

  // ── Update Online Status ──────────────────────────────────────────────────
  async updateStatus(userId, isOnline) {
    if (typeof isOnline !== "boolean") {
      throw new ValidationError(
        "isOnline must be a boolean value (true or false)",
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        // When going offline, record last seen time
        ...(isOnline === false && { lastSeen: new Date() }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isOnline: true,
        lastSeen: true,
      },
    });

    return { user: updatedUser };
  },
  
  async getByVerificationToken(token) {
    const hashed = hashToken(token);
    
    const verification = await prisma.verificationToken.findUnique({
      where: {
        token: hashed,
      },
      include: {
        user: true
      }
    });
    
    const user = verification?.user;

    if (!user) throw new NotFoundError("User not found");

    return { user };
  },
};
