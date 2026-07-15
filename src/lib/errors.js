// ── Base App Error ─────────────────────────────────────────────────────────
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

// ── 400 Bad Request ────────────────────────────────────────────────────────
export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

// ── 401 Unauthorized ───────────────────────────────────────────────────────
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

// ── 403 Forbidden ──────────────────────────────────────────────────────────
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

// ── 404 Not Found ──────────────────────────────────────────────────────────
export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

// ── 409 Conflict ───────────────────────────────────────────────────────────
export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
    this.name = "ConflictError";
  }
}
