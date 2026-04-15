import { userService } from "@/services/user.service";
import { successResponse, errorResponse } from "@/lib/server/response";
import { getAuthUser } from "@/lib/server/auth";
import { UnauthorizedError } from "@/lib/errors";

// GET /api/users/search?email=
export async function GET(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) throw new UnauthorizedError();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const result = await userService.searchByEmail(email, authUser.id);
    return successResponse(result, "User found");
  } catch (error) {
    return errorResponse(error);
  }
}