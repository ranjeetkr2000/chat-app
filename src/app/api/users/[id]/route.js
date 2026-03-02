import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/users/:id - Get a specific user's public profile
export async function GET(request, { params }) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        if (!id) {
            return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true, // Typically, email might be considered public for chat apps
                name: true,
                avatar: true,
                statusMessage: true,
                isOnline: true,
                lastSeen: true,
                createdAt: true,
            },
        });

        if (!user) {
            return Response.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, data: { user } }, { status: 200 });
    } catch (error) {
        console.error("[GET_USER_BY_ID_ERROR]", error);
        return Response.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}
