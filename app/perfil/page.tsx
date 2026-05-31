"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import type { Presupuesto, CompraConProducto } from "@/types";

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
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 pt-12">
      <Card title="Mi perfil">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-zinc-500">Nombre</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user.nombre}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Email</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Rol</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user.rol_id === 1 ? "Administrador" : "Usuario"}
            </p>
          </div>
          <div className="mt-2">
            <Button
              variant="danger"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Mis presupuestos">
          {loadingData ? (
            <p className="text-zinc-500">Cargando...</p>
          ) : (
            <>
              <div className="mb-4 space-y-1">
                <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                  <p className="text-xs text-zinc-500">Total presupuestado</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    ${totalPresupuesto.toLocaleString("es-CL")}
                  </p>
                </div>
                <div className="flex justify-between rounded-lg bg-red-50 px-4 py-2 dark:bg-red-950">
                  <span className="text-sm text-zinc-500">Gastado</span>
                  <span className="text-sm font-semibold text-red-600">
                    ${totalGastado.toLocaleString("es-CL")}
                  </span>
                </div>
                <div className="flex justify-between rounded-lg bg-green-50 px-4 py-2 dark:bg-green-950">
                  <span className="text-sm text-zinc-500">Disponible</span>
                  <span
                    className={`text-sm font-semibold ${disponible >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    ${disponible.toLocaleString("es-CL")}
                  </span>
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
                      className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700"
                    >
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {p.descripcion}
                      </span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        ${Number(p.valor).toLocaleString("es-CL")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  label="Descripción"
                  placeholder="Ej: Presupuesto mensual"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                <Input
                  label="Valor"
                  type="number"
                  placeholder="Ej: 500000"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <Button type="submit" loading={creating}>
                  Agregar presupuesto
                </Button>
              </form>
            </>
          )}
        </Card>

        <Card title="Mis compras">
          {loadingData ? (
            <p className="text-zinc-500">Cargando...</p>
          ) : (
            <>
              <Button
                className="mb-4 w-full"
                onClick={() => router.push("/")}
              >
                Ir a comprar ahora
              </Button>

              {compras.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Aún no has realizado compras.
                </p>
              ) : (
                <div className="space-y-2">
                  {compras.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {c.producto_nombre}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {new Date(c.create_at).toLocaleDateString("es-CL", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-red-500">
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
