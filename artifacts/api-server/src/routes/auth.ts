import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET || "clash-jwt-secret-2026";
const TOKEN_TTL = "30d";

function makeToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string };
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req: Request): Promise<typeof usersTable.$inferSelect | null> {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.sub)).limit(1);
  return user ?? null;
}

router.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
  const { email, display_name, password } = req.body as {
    email?: string;
    display_name?: string;
    password?: string;
  };

  if (!email || !display_name || !password) {
    res.status(400).json({ error: "email, display_name, and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
  if (existing.length) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const password_hash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(usersTable)
    .values({ email: email.toLowerCase(), display_name, password_hash })
    .returning({ id: usersTable.id, email: usersTable.email, display_name: usersTable.display_name, created_at: usersTable.created_at });

  const token = makeToken(user.id);
  res.status(201).json({ token, user: { id: user.id, email: user.email, display_name: user.display_name } });
});

router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = makeToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email, display_name: user.display_name } });
});

router.get("/auth/me", async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ id: user.id, email: user.email, display_name: user.display_name, created_at: user.created_at });
});

export default router;
