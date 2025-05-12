import { SignupForm } from "@/components/signup-form";
import pkg from "../../package.json";

export default function SignUp() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-center gap-2 mb-5 md:top-12 ">
        <span className="text-4xl font-bold uppercase">{pkg.name}</span>
      </div>

      <div className="grid w-full max-w-[500px] gap-6 bg-white p-8 rounded-2xl shadow-sm dark:bg-slate-800">
        <div className="grid gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your information to sign up for a new account
          </p>
        </div>

        <SignupForm />

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-sm text-muted-foreground md:bottom-12">
        <div className="mx-auto flex flex-col items-center gap-1 md:flex-row">
          <span>
            &copy; {new Date().getFullYear()} {pkg.name}
          </span>
          <span className="hidden md:inline">·</span>
          <a href="/terms" className="hover:underline">
            Terms
          </a>
          <span className="hidden md:inline">·</span>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
        </div>
      </div>
    </div>
  );
}
