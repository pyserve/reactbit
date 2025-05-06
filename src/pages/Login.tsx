import { LoginForm } from "@/components/login-form";
import { Link } from "react-router-dom";
import pkg from "../../package.json";

export default function Login() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
      <div className="absolute top-8 flex items-center gap-2 md:top-12">
        <span className="text-4xl font-bold uppercase">{pkg.name}</span>
      </div>

      <div className="grid w-full max-w-[400px] gap-6 bg-white p-6 rounded-2xl">
        <div className="grid gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>

        <LoginForm />

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-sm text-muted-foreground md:bottom-12">
        <div className="mx-auto flex flex-col items-center gap-1 md:flex-row">
          <span>
            &copy; {new Date().getFullYear()} {pkg.name}
          </span>
          <span className="hidden md:inline">·</span>
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
          <span className="hidden md:inline">·</span>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
