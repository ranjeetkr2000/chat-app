import "server-only";
import prisma from "@/lib/server/prisma";
import { generateVerificationToken } from "@/lib/server/auth";
import { sendVerificationEmail } from "@/lib/server/mail";

// ── Auth Service ───────────────────────────────────────────────────────────
export const verificationService = {
  async initiateVerification({ user }) {
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
  },
};
