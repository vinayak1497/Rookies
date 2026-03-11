import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "./firebase";

// ─── Google Sign-In ───

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// ─── Phone OTP Sign-In ───

export function setupRecaptcha(elementId: string): RecaptchaVerifier {
  const verifier = new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
  });
  return verifier;
}

export async function sendPhoneOtp(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export async function verifyPhoneOtp(
  confirmationResult: ConfirmationResult,
  otp: string
) {
  const result = await confirmationResult.confirm(otp);
  return result.user;
}

// ─── Email Link (Passwordless) Sign-In ───

export async function sendEmailSignInLink(email: string) {
  const actionCodeSettings = {
    url: `${window.location.origin}/sign-in?mode=email-callback`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  // Store email for when user returns from email link
  window.localStorage.setItem("rookies_email_for_sign_in", email);
}

export function isEmailSignInLink(link: string): boolean {
  return isSignInWithEmailLink(auth, link);
}

export async function completeEmailSignIn(email: string, link: string) {
  const result = await signInWithEmailLink(auth, email, link);
  window.localStorage.removeItem("rookies_email_for_sign_in");
  return result.user;
}

// ─── Sign Out ───

export async function logout() {
  await firebaseSignOut(auth);
}

// ─── Auth State Observer ───

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ─── Get Current User ───

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// ─── Get ID Token ───

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
