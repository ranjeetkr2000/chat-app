import "server-only";
import { AppError } from "@/lib/errors";

/**
 * Send a successful JSON response
 * @param {object|null} data - The data to send
 * @param {string} message - Success message
 * @param {number} status - HTTP status code
 */
export function successResponse(
  data = null,
  message = "Success",
  status = 200,
) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

/**
 * Send an error JSON response
 * Automatically maps AppError subclasses to the correct HTTP status code
 * @param {Error} error - The error to handle
 */
export function errorResponse(error) {
  if (error instanceof AppError) {
    return Response.json(
      { success: false, error: error.message },
      { status: error.statusCode },
    );
  }

  // Unhandled / unexpected error
  console.error("[UNHANDLED ERROR]", error);
  return Response.json(
    { success: false, error: "Something went wrong. Please try again." },
    { status: 500 },
  );
}
