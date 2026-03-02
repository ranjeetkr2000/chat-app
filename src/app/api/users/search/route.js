import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/users/search?email=<email_address> - Find a user by email
export async function GET(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return Response.json({ success: false, error: "Email query parameter is required" }, { status: 400 });
        }

        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json({ success: false, error: "Invalid email address format" }, { status: 400 });
        }

        // Find the user, but exclude their own profile
        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(), // Ensure case-insensitive search if desired, or rely on unique constraint
                NOT: { id: authUser.id } // Exclude the requesting user
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

        if (!user) {
            return Response.json({ success: false, message: "No user found with that email" }, { status: 404 });
        }

        return Response.json({ success: true, data: { user } }, { status: 200 });
    } catch (error) {
        console.error("[GET_USER_SEARCH_ERROR]", error);
        return Response.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}
