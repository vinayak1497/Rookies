import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <SignIn
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "rounded-2xl shadow-xl border border-border",
                },
            }}
        />
    );
}
