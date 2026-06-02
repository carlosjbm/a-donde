"use client";

import { useEffect, useState, type ElementType } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBasket,
  Store,
  ArrowUpRight,
  CheckCircle2,
  Sprout,
  Crown,
  Package,
  Lightbulb,
} from "lucide-react";
import type { SugerenciaPack, SugerenciaProducto } from "@/types";

type PackTheme = {
  key: string;
  badge: string;
  badgeText: string;
  icon: ElementType;
  surface: string;
  surfaceDark: string;
  ring: string;
  border: string;
  borderDark: string;
  accentText: string;
  accentTextDark: string;
  priceText: string;
  priceTextDark: string;
  glow: string;
};

const PACK_THEMES: Record<string, PackTheme> = {
  basico: {
    key: "basico",
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-800/60",
    badgeText: "Esenciales del mes",
    icon: Sprout,
    surface:
      "bg-[radial-gradient(120%_120%_at_0%_0%,rgba(16,185,129,0.18)_0%,rgba(16,185,129,0.05)_40%,rgba(255,255,255,0.9)_100%)]",
    surfaceDark:
      "dark:bg-[radial-gradient(120%_120%_at_0%_0%,rgba(16,185,129,0.28)_0%,rgba(16,185,129,0.08)_45%,rgba(24,24,27,0.95)_100%)]",
    ring: "ring-emerald-200/70 dark:ring-emerald-900/50",
    border: "border-emerald-200/80",
    borderDark: "dark:border-emerald-900/50",
    accentText: "text-emerald-700",
    accentTextDark: "dark:text-emerald-300",
    priceText: "text-emerald-700",
    priceTextDark: "dark:text-emerald-300",
    glow: "from-emerald-500/20 via-emerald-400/10 to-transparent",
  },
  lujoso: {
    key: "lujoso",
    badge: "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-800/60",
    badgeText: "Selección premium",
    icon: Crown,
    surface:
      "bg-[radial-gradient(120%_120%_at_100%_0%,rgba(245,158,11,0.22)_0%,rgba(244,114,182,0.08)_45%,rgba(255,255,255,0.92)_100%)]",
    surfaceDark:
      "dark:bg-[radial-gradient(120%_120%_at_100%_0%,rgba(245,158,11,0.30)_0%,rgba(244,114,182,0.10)_45%,rgba(24,24,27,0.95)_100%)]",
    ring: "ring-amber-200/70 dark:ring-amber-900/50",
    border: "border-amber-200/80",
    borderDark: "dark:border-amber-900/50",
    accentText: "text-amber-700",
    accentTextDark: "dark:text-amber-300",
    priceText: "text-amber-700",
    priceTextDark: "dark:text-amber-300",
    glow: "from-amber-500/25 via-rose-400/10 to-transparent",
  },
  default: {
    key: "default",
    badge: "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700",
    badgeText: "Pack recomendado",
    icon: Package,
    surface:
      "bg-[radial-gradient(120%_120%_at_0%_0%,rgba(99,102,241,0.15)_0%,rgba(99,102,241,0.04)_45%,rgba(255,255,255,0.92)_100%)]",
    surfaceDark:
      "dark:bg-[radial-gradient(120%_120%_at_0%_0%,rgba(99,102,241,0.28)_0%,rgba(99,102,241,0.08)_45%,rgba(24,24,27,0.95)_100%)]",
    ring: "ring-indigo-200/70 dark:ring-indigo-900/50",
    border: "border-indigo-200/80",
    borderDark: "dark:border-indigo-900/50",
    accentText: "text-indigo-700",
    accentTextDark: "dark:text-indigo-300",
    priceText: "text-indigo-700",
    priceTextDark: "dark:text-indigo-300",
    glow: "from-indigo-500/20 via-violet-400/10 to-transparent",
  },
};

function getPackTheme(nombre: string): PackTheme {
  const key = nombre.toLowerCase().trim();
  if (key.includes("basico") || key.includes("básico") || key.includes("esencial"))
    return PACK_THEMES.basico;
  if (key.includes("lujo") || key.includes("premium") || key.includes("lujoso"))
    return PACK_THEMES.lujoso;
  return PACK_THEMES.default;
}

function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-CL")}`;
}

function ProductThumb({ producto, theme }: { producto: SugerenciaProducto; theme: PackTheme }) {
  const hasImage = !!producto.imagen && producto.imagen.trim().length > 0;
  const isJpg = hasImage && /\.(jpe?g|png|webp|gif|avif)$/i.test(producto.imagen!);
  const src = hasImage && isJpg ? `/uploads/${producto.imagen}` : null;

  if (src) {
    return (
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-zinc-200/80 dark:ring-zinc-700/60">
        <Image
          src={src}
          alt={producto.nombre}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
    );
  }

  const Icon =
    theme.key === "basico"
      ? Sprout
      : theme.key === "lujoso"
        ? Crown
        : ShoppingBasket;

  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.glow} ring-1 ring-zinc-200/80 dark:ring-zinc-700/60`}
    >
      <Icon className={`h-6 w-6 ${theme.accentText} ${theme.accentTextDark}`} />
    </div>
  );
}

function PackCard({ pack, index }: { pack: SugerenciaPack; index: number }) {
  const theme = getPackTheme(pack.nombre);
  const Icon = theme.icon;
  const featured = pack.productos[0];
  const rest = pack.productos.slice(1);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border ${theme.border} ${theme.borderDark} ${theme.surface} ${theme.surfaceDark} p-6 shadow-sm ring-1 ${theme.ring} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-7`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm ring-1 ring-zinc-200/80 backdrop-blur dark:bg-zinc-900/70 dark:ring-zinc-700/60`}
          >
            <Icon className={`h-5 w-5 ${theme.accentText} ${theme.accentTextDark}`} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Pack {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {pack.nombre}
            </h3>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${theme.badge}`}
        >
          <Sparkles className="h-3 w-3" />
          {pack.total} {pack.total === 1 ? "sugerencia" : "sugerencias"}
        </span>
      </header>

      {featured && (
        <Link
          href={`/lugares/${featured.lugar_id}`}
          className="relative mt-5 flex items-center gap-4 rounded-xl border border-white/60 bg-white/70 p-3.5 backdrop-blur transition-colors hover:border-white hover:bg-white/90 dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
        >
          <ProductThumb producto={featured} theme={theme} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {featured.nombre}
              </p>
              {featured.escencial && (
                <span className="shrink-0 rounded-md bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  Esencial
                </span>
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Store className="h-3 w-3" />
              {featured.lugar_nombre}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-bold ${theme.priceText} ${theme.priceTextDark}`}>
              {formatPrice(featured.precio)}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
              Mejor opción
            </p>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <ul className="relative mt-3 space-y-1.5">
          {rest.slice(0, 3).map((producto) => (
            <li key={producto.id}>
              <Link
                href={`/lugares/${producto.lugar_id}`}
                className="group/row flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/70 dark:hover:bg-zinc-900/60"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/70 ring-1 ring-zinc-200/80 dark:bg-zinc-900/60 dark:ring-zinc-800">
                  <ShoppingBasket className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-700 dark:text-zinc-200">
                    {producto.nombre}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-500">
                    {producto.lugar_nombre}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${theme.priceText} ${theme.priceTextDark}`}
                >
                  {formatPrice(producto.precio)}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pack.total > 4 && (
        <p className="relative mt-3 pl-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          + {pack.total - 4} más
        </p>
      )}

      {pack.total === 0 && (
        <p className="relative mt-5 text-sm text-zinc-500 dark:text-zinc-400">
          Aún no hay productos en este pack.
        </p>
      )}
    </article>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-white p-8 ring-1 ring-emerald-200/40 dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-zinc-900 dark:ring-emerald-900/40 sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div className="relative flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          ¡Estás al día con tus packs!
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          Ya compraste todos los productos sugeridos. Vuelve pronto, agregamos
          nuevas recomendaciones cada semana.
        </p>
      </div>
    </div>
  );
}

export function SuggestionsSection() {
  const [packs, setPacks] = useState<SugerenciaPack[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sugerencias/mine")
      .then((res) => {
        if (res.status === 401) return null;
        if (!res.ok) throw new Error("Error");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        if (!json) {
          setPacks([]);
          return;
        }
        if (json.success) {
          setPacks(json.data as SugerenciaPack[]);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (packs === null && !loading) {
    return null;
  }

  const totalSuggestions =
    packs?.reduce((acc, p) => acc + p.total, 0) ?? 0;
  const hasContent = (packs?.length ?? 0) > 0 && totalSuggestions > 0;

  return (
    <section
      aria-labelledby="sugerencias-title"
      className="relative overflow-hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.10)_0%,rgba(16,185,129,0)_60%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.15)_0%,rgba(16,185,129,0)_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(24,24,27,0.08)_1px,transparent_0)] [background-size:18px_18px] dark:opacity-[0.18] dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(228,228,231,0.08)_1px,transparent_0)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Lightbulb className="h-3 w-3" />
              Para ti
            </span>
            <h2
              id="sugerencias-title"
              className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50"
            >
              Tu próxima compra,{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                sin esfuerzo.
              </span>
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              Cruzamos tus packs con lo que aún no has comprado y te mostramos
              las mejores opciones para completar tu despensa.
            </p>
          </div>

          {!loading && hasContent && (
            <div className="flex items-center gap-3 self-start rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-zinc-900 dark:text-zinc-50">
                  {totalSuggestions}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  sugerencias listas
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10">
          {loading ? (
            <Skeleton />
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              No pudimos cargar las sugerencias. Intenta recargar la página.
            </div>
          ) : hasContent ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {packs!
                .filter((p) => p.total > 0)
                .map((pack, i) => (
                  <PackCard key={pack.id} pack={pack} index={i} />
                ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
}
