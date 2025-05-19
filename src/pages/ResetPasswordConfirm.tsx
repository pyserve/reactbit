import ResetPasswordConfirmForm from "@/components/reset-password-form";
import pkg from "../../package.json";

export default function ResetPasswordConfirm() {
  return (
    <div className="">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:top-12 ">
        <span className="text-4xl font-bold uppercase">{pkg.name}</span>
      </div>
      <ResetPasswordConfirmForm />
    </div>
  );
}
