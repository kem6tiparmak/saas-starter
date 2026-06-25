import { AuthForm } from "@/components/auth-form";
import { loginAction } from "../actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <AuthForm mode="login" action={loginAction} />
    </main>
  );
}
