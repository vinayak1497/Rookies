import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth, type DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";

// ─── Lazy Singleton Admin App (avoids build-time initialization) ───

let _adminAuth: Auth | null = null;

function getAdminAuth(): Auth {
  if (_adminAuth) return _adminAuth;

  let app: App;
  if (getApps().length) {
    app = getApps()[0];
  } else {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  _adminAuth = getAuth(app);
  return _adminAuth;
}

// ─── Token Verification ───

export async function verifyIdToken(idToken: string): Promise<DecodedIdToken> {
  return getAdminAuth().verifyIdToken(idToken);
}

// ─── Session Cookie ───

export async function createSessionCookie(
  idToken: string,
  expiresIn: number
): Promise<string> {
  return getAdminAuth().createSessionCookie(idToken, { expiresIn });
}

export async function verifySessionCookie(
  cookie: string
): Promise<DecodedIdToken> {
  return getAdminAuth().verifySessionCookie(cookie, true);
}

// ─── Server-Side Auth Helpers ───

const SESSION_COOKIE_NAME = "__session";

/**
 * Get the authenticated Firebase user from the session cookie.
 * Use in Server Components, Server Actions, and Route Handlers.
 * Returns `null` if no valid session exists.
 */
export async function getAuthUser(): Promise<DecodedIdToken | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;
    return await verifySessionCookie(sessionCookie);
  } catch {
    return null;
  }
}

/**
 * Require authentication — returns the decoded token or throws.
 * Use in server actions that require a user.
 */
export async function requireAuth(): Promise<DecodedIdToken> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
