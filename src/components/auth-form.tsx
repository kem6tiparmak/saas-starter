"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AuthFormState } from "@/app/(auth)/actions";

type AuthAction = (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;

interface AuthFormProps {
  mode: "login" | "register";
  action: AuthAction;
}

/**
 * Shared credentials form for login and register. Uses useActionState (React 19)
 * to surface server-action errors without a client-side fetch.
 */
export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    action,
    {},
  );
  const isRegister = mode === "register";

  return (
    <form
      action={formAction}
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
    >
      <h1 className="text-2xl font-bold">
        {isRegister ? "Create account" : "Sign in"}
      </h1>

      {isRegister && (
        <>
          <Field name="orgName" label="Company name" type="text" required />
          <Field name="name" label="Your name (optional)" type="text" />
        </>
      )}

      <Field name="email" label="Email" type="email" required />
      <Field name="password" label="Password" type="password" required />

      {/* Honeypot: hidden from humans, bots fill it -> request is dropped. */}
      {isRegister && (
        <input
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
      )}

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black px-4 py-2.5 text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {pending ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-neutral-600">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            No account yet?{" "}
            <Link href="/register" className="underline">
              Create one
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type,
  required,
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-neutral-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-black"
      />
    </label>
  );
}
