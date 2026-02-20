// src/utils/jwt.ts
import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";


const SECRET: Secret = process.env.JWT_SECRET ?? "Job_Portal";

// Sign JWT
export function signJwt(
  payload: JwtPayload | object,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  return jwt.sign(payload, SECRET, { expiresIn });
}

// Verify JWT
export function verifyJwt<T = JwtPayload>(token: string): T {
  return jwt.verify(token, SECRET) as T;
}
