import { authService } from "@/services/auth.service";
import { successResponse, errorResponse } from "@/lib/server/response";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await authService.register(body);
    return successResponse(result, "Account created successfully", 201);
  } catch (error) {
    return errorResponse(error);
  }
}
