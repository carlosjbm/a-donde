"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { useEffect, useState } from "react";
import {
  User,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
  Wallet,
  ShoppingCart,
  Home,
  Bell,
} from "lucide-react";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [presupuestoTotal, setPresupuestoTotal] = useState<number | null>(null);
  const [gastado, setGastado] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    Promise.all([
      fetch("/api/presupuestos/mine").then((r) => r.json()),
      fetch("/api/compras/mine").then((r) => r.json()),
      fetch("/api/packs/pending-count").then((r) => r.json()),
    ]).then(([presJson, compJson, packJson]) => {
      if (presJson.success) {
        const total = presJson.data.reduce(
          (s: number, p: { valor: number }) => s + Number(p.valor),
          0,
        );
        setPresupuestoTotal(total);
      }
      if (compJson.success) {
        const totalGastado = compJson.data.reduce(
          (s: number, c: { producto_precio: number }) =>
            s + Number(c.producto_precio),
          0,
        );
        setGastado(totalGastado);
      }
      if (packJson.success) {
        setPendingCount(packJson.data.count);
      }
    });
  }, [user]);

  const disponible =
    presupuestoTotal !== null ? presupuestoTotal - gastado : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 pb-3 pt-3 md:h-14 md:flex-nowrap md:pb-0 md:pt-0">
        <Link
          href="/"
          className="order-1 shrink-0 rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus:ring-zinc-500"
        >
          <Home className="h-5 w-5" />
        </Link>

        <SearchBar className="order-3 w-full md:order-2 md:flex-1" />

        <div className="order-2 ml-auto flex shrink-0 items-center gap-3 md:order-3">
          {loading ? null : user ? (
            <>
              {disponible !== null && (
                <>
                  <Link
                    href="/perfil"
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      disponible >= 0
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
                    }`}
                  >
                    <Wallet className="h-3.5 w-3.5" />$
                    {disponible.toLocaleString("es-CL")}
                  </Link>
                  <Link
                    href={"/perfil#packs"}
                    className="relative rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus:ring-zinc-500"
                  >
                    <Bell className="h-5 w-5" />
                    {pendingCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white">
                        {pendingCount > 99 ? "99+" : pendingCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href={"/lugares"}
                    className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus:ring-zinc-500"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </>
              )}
              <Link
                href="/perfil"
                className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <User className="h-4 w-4" />
                {user.nombre}
              </Link>
              {user.rol_id === 1 && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Button variant="secondary" onClick={logout}>
                <LogOut className="mr-1.5 h-4 w-4" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button>
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
