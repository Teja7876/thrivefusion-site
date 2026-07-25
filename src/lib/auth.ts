import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { parseCookie, stringifySetCookie } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'thrivefusion_secure_jwt_secret_key_2026_hostinger';
const COOKIE_NAME = 'auth_token';

export interface TokenPayload {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  photoURL?: string | null;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  return await bcrypt.compare(password, hash);
}

// Token creation & verification
export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// Cookie Helpers
export function createAuthCookie(payload: TokenPayload): string {
  const token = createToken(payload);
  return stringifySetCookie({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export function removeAuthCookie(): string {
  return stringifySetCookie({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export function getUserFromRequest(req: Request): TokenPayload | null {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parseCookie(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}
