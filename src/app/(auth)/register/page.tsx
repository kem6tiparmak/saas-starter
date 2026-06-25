import { AuthForm } from "@/components/auth-form";
import { registerAction } from "../actions";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <AuthForm mode="register" action={registerAction} />
    </main>
  );
}
