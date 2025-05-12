import { ForgotPasswordForm } from "@/components/forgot-password";
import pkg from "../../package.json";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[450px] space-y-8">
        {/* Google Logo */}
        <div className="flex justify-center text-4xl font-bold uppercase">
          {pkg.name}
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-normal text-gray-900">
            Forgot password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <ForgotPasswordForm />
        </div>

        <div className="text-center text-sm">
          <div className="flex justify-center space-x-4 text-gray-600">
            <a href="#" className="hover:text-gray-800">
              Need help?
            </a>
            <span className="text-gray-300">|</span>
            <a href="/signup" className="hover:text-gray-800">
              Create account
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-8">
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-700">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
