import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user from Supabase.
 * Returns `null` if no user is signed in.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
 * Sign out the current user and redirect to the homepage.
 */
export async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
