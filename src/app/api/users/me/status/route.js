import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// PATCH /api/users/me/status - Update current user's online/offline status
export async function PATCH(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { isOnline } = body;

        if (typeof isOnline !== "boolean") {
            return Response.json(
                { success: false, error: "isOnline must be a boolean value (true or false)" },
                { status: 400 }
            );
        }

        const updateData = {
            isOnline,
            // If going offline, update lastSeen to now
            ...(isOnline === false && { lastSeen: new Date() }),
        };

        const updatedUser = await prisma.user.update({
            where: { id: authUser.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                isOnline: true,
                lastSeen: true,
            },
        });

        return Response.json(
            {
                success: true,
                message: `Status updated to ${isOnline ? "online" : "offline"}`,
                data: { user: updatedUser },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("[PATCH_USER_STATUS_ERROR]", error);
        return Response.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}
