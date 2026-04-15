import { userService } from "@/services/user.service";
import { successResponse, errorResponse } from "@/lib/server/response";
import { getAuthUser } from "@/lib/server/auth";
import { UnauthorizedError } from "@/lib/errors";

// GET /api/users/:id
export async function GET(request, { params }) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) throw new UnauthorizedError();

    const { id } = await params;
    const result = await userService.getById(id);
    return successResponse(result, "User fetched successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
