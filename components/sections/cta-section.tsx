import Link from "next/link";
import { UserPlus, LogIn } from "lucide-react";

export function CTASection() {
  return (
    <section className="border-t border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Empieza a ahorrar hoy
        </h2>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          Regístrate gratis y descubre los mejores lugares para hacer tus
          compras mensuales al mejor precio.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <UserPlus className="h-4 w-4" />
            Crear cuenta gratis
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-8 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            <LogIn className="h-4 w-4" />
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}
