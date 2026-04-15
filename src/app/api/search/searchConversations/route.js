import { successResponse, errorResponse } from "@/lib/server/response";
import { getAuthUser } from "@/lib/server/auth";
import { UnauthorizedError } from "@/lib/errors";
import { searchService } from "@/services/search.service";
import { cookies } from "next/headers";

// GET /api/users/search?email=
export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) throw new UnauthorizedError();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    const result = await searchService.searchConversations(query, authUser.id);
    return successResponse(result, "User found");
  } catch (error) {
    return errorResponse(error);
  }
}