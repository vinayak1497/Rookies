import { NextRequest, NextResponse } from "next/server";
import {
  createSessionCookie,
  verifyIdToken,
} from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000; // 5 days
const SESSION_COOKIE_NAME = "__session";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the ID token with Firebase Admin
    const decodedToken = await verifyIdToken(idToken);

    // Create a Firebase session cookie
    const sessionCookie = await createSessionCookie(idToken, SESSION_EXPIRY_MS);

    // Upsert user record in the database (best-effort — don't block login on DB issues)
    try {
      await prisma.user.upsert({
        where: { firebaseUid: decodedToken.uid },
        update: {
          email: decodedToken.email || null,
          name: decodedToken.name || null,
          phone: decodedToken.phone_number || null,
        },
        create: {
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || null,
          name:
            decodedToken.name ||
            decodedToken.email?.split("@")[0] ||
            null,
          phone: decodedToken.phone_number || null,
        },
      });
    } catch (dbError) {
      console.warn("[session] DB sync failed (non-fatal):", dbError);
    }

    // Set session cookie
    const response = NextResponse.json({ status: "success" });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_MS / 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[session] Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: "success" });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
