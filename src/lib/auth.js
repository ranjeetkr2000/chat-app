import jwt from "jsonwebtoken";
import crypto from "crypto";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

/**
 * Signs a JWT token with the given payload
 * @param {object} payload - Data to encode in the token (e.g. { id, email })
 * @returns {string} signed JWT token
 */
export function signToken(payload) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {object} decoded payload
 * @throws if token is invalid or expired
 */
export function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Extracts the Bearer token from the Authorization header
 * @param {Request} request - Next.js request object
 * @returns {string|null} token string or null if not found
 */
export function extractToken(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

/**
 * Gets the currently logged-in user from the request's Authorization header
 * @param {Request} request - Next.js request object
 * @returns {{ id: string, email: string } | null} decoded user or null
 */
export function getAuthUser(request) {
  try {
    const token = extractToken(request);
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function hashToken (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return {
    hashedToken: hashToken(token),
    verifyToken: token,
    verifyTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
  };
};
