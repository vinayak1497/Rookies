import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/setup"
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "rounded-2xl shadow-xl border border-border",
                },
            }}
        />
    );
}