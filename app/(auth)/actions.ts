"use server";

import { getAuthUser } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Get the current authenticated user's database record.
 * Returns null if not authenticated.
 */
export async function getCurrentDbUser() {
  const authUser = await getAuthUser();
  if (!authUser) return null;

  const user = await prisma.user.findUnique({
    where: { firebaseUid: authUser.uid },
  });

  return user;
}

/**
 * Sign out — clears session cookie.
 */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.set("__session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  redirect("/");
}
