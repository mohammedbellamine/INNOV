import { SignIn } from "@clerk/react-router";
import { Link } from "react-router";

export function meta() {
  return [{ title: "Sign in — AI Readiness" }];
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <Link
        to="/"
        className="font-heading text-xl font-semibold tracking-tight"
      >
        AI Readiness<span className="text-stamp">*</span>
      </Link>
      <SignIn fallbackRedirectUrl="/app" signUpFallbackRedirectUrl="/app" />
    </div>
  );
}
