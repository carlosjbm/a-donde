"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("Completa todos los campos");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await register(nombre, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-900/20" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-zinc-200/40 blur-3xl dark:bg-zinc-800/30" />
        <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/20 blur-3xl dark:bg-amber-800/10" />
      </div>

      <Card className="animate-slide-up w-full max-w-sm !p-0 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50">
        <div className="relative rounded-t-xl border-b border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100/80 px-6 py-7 dark:border-zinc-700 dark:from-zinc-800/80 dark:to-zinc-900/60">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 dark:from-amber-500 dark:via-amber-400 dark:to-amber-500" />
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-sm dark:from-zinc-50 dark:to-zinc-200">
              <UserPlus className="h-5 w-5 text-white dark:text-zinc-900" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Crear cuenta
              </h2>
              <p className="text-xs text-zinc-500">
                Regístrate para empezar a ahorrar
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 pt-5">
          <Input
            label="Nombre"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            icon={User}
            autoComplete="name"
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            autoComplete="email"
            required
          />
          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="•••••• (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute bottom-2.5 right-3 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <div className="animate-fade-in flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="mt-1 transition-transform active:scale-[0.98]"
          >
            <UserPlus className="mr-1.5 h-4 w-4" />
            Crear cuenta
          </Button>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
                o
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-zinc-900 underline underline-offset-4 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
