"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import type { Presupuesto, CompraConProducto } from "@/types";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Wallet,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Plus,
  Package,
  CircleDollarSign,
  FileText,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [compras, setCompras] = useState<CompraConProducto[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [descripcion, setDescripcion] = useState("");
  const [valor, setValor] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/perfil");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    Promise.all([
      fetch("/api/presupuestos/mine").then((r) => r.json()),
      fetch("/api/compras/mine").then((r) => r.json()),
    ])
      .then(([presJson, compJson]) => {
        if (presJson.success) setPresupuestos(presJson.data);
        if (compJson.success) setCompras(compJson.data);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [user]);

  const totalPresupuesto = presupuestos.reduce(
    (sum, p) => sum + Number(p.valor),
    0
  );
  const totalGastado = compras.reduce(
    (sum, c) => sum + Number(c.producto_precio),
    0
  );
  const disponible = totalPresupuesto - totalGastado;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!descripcion.trim() || !valor.trim()) {
      setError("Completa todos los campos");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/presupuestos/mine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion: descripcion.trim(), valor: Number(valor) }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error);
        return;
      }
      setPresupuestos((prev) => [...prev, json.data]);
      setDescripcion("");
      setValor("");
    } catch {
      setError("Error al crear presupuesto");
    } finally {
      setCreating(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-3 pt-12 sm:gap-6 sm:p-4">
      <Card className="!p-4 sm:!p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex items-center gap-4 sm:flex-col">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 sm:h-14 sm:w-14">
              <User className="h-5 w-5 text-zinc-500 sm:h-6 sm:w-6" />
            </div>
            <Button
              variant="danger"
              className="sm:hidden"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between">
              <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {user.nombre}
              </h2>
              <Button
                variant="danger"
                className="hidden shrink-0 sm:inline-flex"
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Salir
              </Button>
            </div>
            <div className="flex flex-col gap-1 text-sm text-zinc-500 sm:flex-row sm:flex-wrap sm:gap-3">
              <span className="flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                {user.rol_id === 1 ? "Administrador" : "Usuario"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card title="Mis presupuestos" className="!p-4 sm:!p-6">
          {loadingData ? (
            <p className="text-zinc-500">Cargando...</p>
          ) : (
            <>
              <div className="mb-4 space-y-2">
                <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 shrink-0 text-zinc-500" />
                    <p className="text-xs text-zinc-500">Total presupuestado</p>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    ${totalPresupuesto.toLocaleString("es-CL")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex flex-1 items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 dark:bg-red-950">
                    <TrendingDown className="h-4 w-4 shrink-0 text-red-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">Gastado</p>
                      <p className="text-sm font-semibold text-red-600">
                        ${totalGastado.toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 dark:bg-green-950">
                    <TrendingUp className="h-4 w-4 shrink-0 text-green-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">Disponible</p>
                      <p
                        className={`text-sm font-semibold ${disponible >= 0 ? "text-green-600" : "text-red-500"}`}
                      >
                        ${disponible.toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {presupuestos.length === 0 ? (
                <p className="mb-4 text-sm text-zinc-500">
                  Aún no tienes presupuestos. Crea uno nuevo.
                </p>
              ) : (
                <ul className="mb-4 space-y-2">
                  {presupuestos.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Wallet className="h-4 w-4 shrink-0 text-zinc-400" />
                        <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                          {p.descripcion}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        ${Number(p.valor).toLocaleString("es-CL")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="flex w-full items-center justify-between rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:text-zinc-300"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo presupuesto
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showForm ? "rotate-180" : ""}`}
                />
              </button>

              {showForm && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-700">
                    <CircleDollarSign className="h-5 w-5 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Agregar presupuesto
                    </span>
                  </div>

                  <Input
                    label="Descripción"
                    placeholder="Ej: Presupuesto mensual"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    icon={FileText}
                  />
                  <Input
                    label="Valor"
                    type="number"
                    placeholder="Ej: 500000"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    icon={CircleDollarSign}
                  />
                  {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        setShowForm(false);
                        setError("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" loading={creating} className="flex-1">
                      <Plus className="mr-1.5 h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </Card>

        <Card title="Mis compras" className="!p-4 sm:!p-6">
          {loadingData ? (
            <p className="text-zinc-500">Cargando...</p>
          ) : (
            <>
              <Button
                className="mb-4 w-full"
                onClick={() => router.push("/lugares")}
              >
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                Ir a comprar ahora
              </Button>

              {compras.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Package className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                  <p className="text-sm text-zinc-500">
                    Aún no has realizado compras.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {compras.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <ShoppingCart className="h-4 w-4 shrink-0 text-zinc-400" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {c.producto_nombre}
                          </p>
                          <p className="whitespace-nowrap text-xs text-zinc-400">
                            {new Date(c.create_at).toLocaleDateString("es-CL", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-red-500">
                        -${Number(c.producto_precio).toLocaleString("es-CL")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
