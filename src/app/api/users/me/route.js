import { userService } from "@/services/user.service";
import { successResponse, errorResponse } from "@/lib/server/response";
import { getAuthUser } from "@/lib/server/auth";
import { UnauthorizedError } from "@/lib/errors";

// GET /api/users/me
export async function GET(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) throw new UnauthorizedError();

    const result = await userService.getMe(authUser.id);
    return successResponse(result, "Profile fetched successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

// PATCH /api/users/me
export async function PATCH(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) throw new UnauthorizedError();

    const body = await request.json();
    const result = await userService.updateMe(authUser.id, body);
    return successResponse(result, "Profile updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/users/me
export async function DELETE(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) throw new UnauthorizedError();

    await userService.deleteMe(authUser.id);
    return successResponse(null, "Account deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
