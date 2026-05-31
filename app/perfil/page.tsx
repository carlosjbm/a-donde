"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import type { Presupuesto } from "@/types";

export default function PerfilPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loadingPresupuestos, setLoadingPresupuestos] = useState(true);

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
    setLoadingPresupuestos(true);
    fetch("/api/presupuestos/mine")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPresupuestos(json.data);
      })
      .catch(() => {})
      .finally(() => setLoadingPresupuestos(false));
  }, [user]);

  const totalValor = presupuestos.reduce((sum, p) => sum + Number(p.valor), 0);

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
    <div className="flex flex-1 items-start justify-center gap-6 p-4 pt-12">
      <Card title="Mi perfil" className="w-full max-w-md">
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

      <Card title="Mis presupuestos" className="w-full max-w-md">
        {loadingPresupuestos ? (
          <p className="text-zinc-500">Cargando...</p>
        ) : (
          <>
            <div className="mb-4 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <p className="text-xs text-zinc-500">Total presupuestado</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                ${totalValor.toLocaleString("es-CL")}
              </p>
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
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              <Button type="submit" loading={creating}>
                Agregar presupuesto
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
