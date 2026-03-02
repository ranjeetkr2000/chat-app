import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import bcrypt from "bcryptjs"; // For potential password changes

// GET /api/users/me - Get current user's profile
export async function GET(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                statusMessage: true,
                isOnline: true,
                lastSeen: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return Response.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, data: { user } }, { status: 200 });
    } catch (error) {
        console.error("[GET_USER_ME_ERROR]", error);
        return Response.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}

// PATCH /api/users/me - Update current user's profile
export async function PATCH(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, avatar, statusMessage, password, currentPassword } = body;

        const updateData = {};

        if (name !== undefined && name !== null) {
            if (name.trim() === "") {
                return Response.json({ success: false, error: "Name cannot be empty" }, { status: 400 });
            }
            updateData.name = name.trim();
        }
        if (avatar !== undefined && avatar !== null) {
            updateData.avatar = avatar;
        }
        if (statusMessage !== undefined && statusMessage !== null) {
            if (statusMessage.length > 100) {
                return Response.json({ success: false, error: "Status message too long" }, { status: 400 });
            }
            updateData.statusMessage = statusMessage.trim();
        }

        // Handle password change
        if (password) {
            if (!currentPassword) {
                return Response.json({ success: false, error: "Current password is required to change password" }, { status: 400 });
            }
            if (password.length < 6) {
                return Response.json({ success: false, error: "New password must be at least 6 characters" }, { status: 400 });
            }

            const user = await prisma.user.findUnique({
                where: { id: authUser.id },
                select: { password: true },
            });

            if (!user || !user.password || !(await bcrypt.compare(currentPassword, user.password))) {
                return Response.json({ success: false, error: "Invalid current password" }, { status: 401 });
            }

            updateData.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return Response.json({ success: false, error: "No update data provided" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: authUser.id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                statusMessage: true,
                isOnline: true,
                lastSeen: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return Response.json({ success: true, message: "Profile updated successfully", data: { user: updatedUser } }, { status: 200 });
    } catch (error) {
        console.error("[PATCH_USER_ME_ERROR]", error);
        return Response.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}

// DELETE /api/users/me - Delete current user's account
export async function DELETE(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Before deleting the user, consider cleanup:
        // - Disassociate from conversations (if using implicit many-to-many)
        // - Delete sent messages (cascading delete is set up on Message model via senderId)
        // - Delete participants (cascading delete is set up on Participant model via userId)

        await prisma.user.delete({
            where: { id: authUser.id },
        });

        return Response.json({ success: true, message: "Account deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("[DELETE_USER_ME_ERROR]", error);
        return Response.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}
