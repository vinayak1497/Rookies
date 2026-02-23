import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <SignUp
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "rounded-2xl shadow-xl border border-border",
                },
            }}
        />
    );
}
