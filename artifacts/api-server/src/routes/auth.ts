import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET || "clash-jwt-secret-2026";
const TOKEN_TTL = "30d";

function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

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

function publicUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    is_admin: isAdminEmail(user.email),
    created_at: user.created_at,
  };
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

  const existing = await db.select({ id: usersTable.id }).from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase())).limit(1);
  if (existing.length) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const password_hash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(usersTable)
    .values({ email: email.toLowerCase(), display_name, password_hash })
    .returning();

  const token = makeToken(user.id);
  res.status(201).json({ token, user: publicUser(user) });
});

router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase())).limit(1);
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
  res.json({ token, user: publicUser(user) });
});

router.get("/auth/me", async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json(publicUser(user));
});

/* ─── Google OAuth ─── */
function getGoogleRedirectUri(req: Request): string {
  const envUri = process.env.GOOGLE_REDIRECT_URI;
  if (envUri) return envUri;
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}/api/auth/google/callback`;
}

function getFrontendBase(req: Request): string {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const host = (req.headers["x-forwarded-host"] || req.headers.host) as string;
  // Strip the /api prefix — the frontend is at the root
  return `${proto}://${host}`;
}

router.get("/auth/google", (req: Request, res: Response): void => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const frontendBase = getFrontendBase(req);
    res.redirect(`${frontendBase}/login?oauth_error=not_configured`);
    return;
  }
  const redirectUri = getGoogleRedirectUri(req);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get("/auth/google/callback", async (req: Request, res: Response): Promise<void> => {
  const frontendBase = getFrontendBase(req);
  const { code, error } = req.query as { code?: string; error?: string };

  if (error || !code) {
    res.redirect(`${frontendBase}/login?oauth_error=cancelled`);
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.redirect(`${frontendBase}/login?oauth_error=not_configured`);
    return;
  }

  try {
    const redirectUri = getGoogleRedirectUri(req);

    // 1. Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
    if (!tokenData.access_token) throw new Error("No access token");

    // 2. Fetch Google user profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json() as {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
    if (!profile.email) throw new Error("No email from Google");

    // 3. Find or create user in our DB
    let [user] = await db.select().from(usersTable)
      .where(eq(usersTable.email, profile.email.toLowerCase())).limit(1);

    if (!user) {
      const displayName = profile.name || profile.email.split("@")[0];
      const fakeHash = await bcrypt.hash(randomUUID(), 4); // placeholder — Google users can't password login
      [user] = await db.insert(usersTable).values({
        email: profile.email.toLowerCase(),
        display_name: displayName,
        password_hash: fakeHash,
      }).returning();
    }

    // 4. Issue our JWT and redirect to frontend
    const token = makeToken(user.id);
    const userJson = encodeURIComponent(JSON.stringify(publicUser(user)));
    res.redirect(`${frontendBase}/auth/callback?token=${token}&user=${userJson}`);
  } catch (err) {
    console.error("[google oauth]", err);
    res.redirect(`${frontendBase}/login?oauth_error=failed`);
  }
});

// ── Admin Login ────────────────────────────────────────────────────────────────
router.post("/admin/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    res.status(503).json({ error: "Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables." });
    return;
  }

  const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatch = password === adminPassword;

  if (!emailMatch || !passwordMatch) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ sub: "admin", admin: true }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

// ── Admin Token Verify ─────────────────────────────────────────────────────────
router.get("/admin/verify", (req: Request, res: Response): void => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) { res.status(401).json({ valid: false }); return; }
  const payload = verifyToken(token) as { admin?: boolean } | null;
  if (!payload || !payload.admin) { res.status(401).json({ valid: false }); return; }
  res.json({ valid: true });
});

export default router;
