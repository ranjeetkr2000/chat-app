import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // ── Validation ────────────────────────────────────────────
        if (!email || !password) {
            return Response.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        // ── Find user ──────────────────────────────────────────────
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                password: true,
                statusMessage: true,
                isOnline: true,
                emailVerified: true,
                createdAt: true,
            },
        });

        if (!user) {
            return Response.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // ── Check password ─────────────────────────────────────────
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return Response.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // ── Update online status ───────────────────────────────────
        await prisma.user.update({
            where: { id: user.id },
            data: { isOnline: true, lastSeen: new Date() },
        });

        // ── Strip password before sending response ─────────────────
        const { password: _, ...safeUser } = user;

        // ── Sign JWT ───────────────────────────────────────────────
        const token = signToken({ id: safeUser.id, email: safeUser.email });

        return Response.json(
            {
                success: true,
                message: "Logged in successfully",
                data: { user: safeUser, token },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("[LOGIN ERROR]", error);
        return Response.json(
            { success: false, error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
