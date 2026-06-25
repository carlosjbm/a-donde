'use client'

import Link from "next/link";
import { ArrowRight, Lightbulb, ShoppingBag, Beef, Croissant, Apple, Milk, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const categories = [
  { name: "Supermercados", icon: ShoppingBag },
  { name: "Carnicerías", icon: Beef },
  { name: "Panaderías", icon: Croissant },
  { name: "Frutas y Verduras", icon: Apple },
  { name: "Lácteos", icon: Milk },
  { name: "Limpieza", icon: Sparkles },
];


export function Hero() {
  const {user}=useAuth()
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 to-transparent dark:from-emerald-950/20" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-16 text-center sm:pb-28 sm:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Lightbulb className="h-4 w-4" />
          Encuentra los mejores precios gracias a tu comunidad
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
          ¿A dónde ir a comprar?
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-zinc-600 sm:text-xl dark:text-zinc-400">
          Registra y comparte los precios de tus lugares de confianza, descubre
          los de tu comunidad y ahorra todos juntos. Organiza tu presupuesto,
          crea packs y prepara tus compras.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/lugares"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Empezar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
          {!user && <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Iniciar sesión
          </Link>}
          
        </div>

        <div className="mt-12 grid w-full max-w-2xl grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2 py-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
            >
              <cat.icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
              <span className="text-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
