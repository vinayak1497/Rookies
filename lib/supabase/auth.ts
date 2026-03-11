import { getAuthUser, requireAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user's database record.
 * Returns `null` if no user is signed in.
 */
export async function getUser() {
  const authUser = await getAuthUser();
  if (!authUser) return null;

  const user = await prisma.user.findUnique({
    where: { firebaseUid: authUser.uid },
  });

  return user;
}

/**
 * Require authentication — redirects to /sign-in if not logged in.
 * Use in Server Components / Server Actions that require a user.
 */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

/**
 * Get the Firebase auth user (decoded token) for the current session.
 * Returns null if not authenticated.
 */
export { getAuthUser } from "@/lib/firebase-admin";
