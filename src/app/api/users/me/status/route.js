import { userService } from "@/services/user.service";
import { successResponse, errorResponse } from "@/lib/server/response";
import { getAuthUser } from "@/lib/server/auth";
import { UnauthorizedError } from "@/lib/errors";

// PATCH /api/users/me/status
export async function PATCH(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) throw new UnauthorizedError();

    const body = await request.json();
    const result = await userService.updateStatus(authUser.id, body.isOnline);
    return successResponse(
      result,
      `Status updated to ${body.isOnline ? "online" : "offline"}`,
    );
  } catch (error) {
    return errorResponse(error);
  }
}
