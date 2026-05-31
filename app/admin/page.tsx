"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/admin");
      } else if (user.rol_id !== 1) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.rol_id !== 1) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-start justify-center p-4 pt-12">
      <Card title="Panel de administración" className="w-full max-w-md">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Bienvenido al panel de administración, {user.nombre}.
        </p>
      </Card>
    </div>
  );
}
