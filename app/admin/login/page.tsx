"use client";

import React, { useState } from "react";
// import { useRouter } from "next/navigation"; // Not needed if action handles redirect, but useful for client-side nav if needed, though action uses redirect()
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { login } from "./actions";
import { toast } from "sonner";

export default function AdminLogin() {
  // const router = useRouter(); 
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    const result = await login(formData); // result will be undefined if redirect happens, otherwise it returns an error object

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
    // If successful, redirect happens on server side
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      {/* Halftone background accent */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden opacity-[0.04]">
        <div
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, #e28892 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, #6f8c9b 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Security seal */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose/10">
            <Lock className="h-7 w-7 text-rose" />
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border bg-background/60 p-8 shadow-lg backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-ink">
              Painel Admin
            </h1>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Acesse sua área de gerenciamento
            </p>
          </div>

          <form action={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-sans text-sm font-bold text-ink"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="rounded-lg border border-border bg-background px-4 py-3 font-sans text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-rose focus:ring-2 focus:ring-rose/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-sans text-sm font-bold text-ink"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-11 font-sans text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-rose focus:ring-2 focus:ring-rose/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex items-center justify-center rounded-lg bg-rose py-3 font-sans text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-xs text-muted-foreground">
            Acesso restrito. Somente administradores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}
