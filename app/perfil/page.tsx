"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PerfilPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/perfil");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-start justify-center p-4 pt-12">
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
    </div>
  );
}
