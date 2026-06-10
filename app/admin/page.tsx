"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Search,
  X,
  Trash2,
  Pencil,
  UserCog,
  Mail,
  Calendar,
  AlertCircle,
  Check,
  Plus,
} from "lucide-react";
import type { Usuario } from "@/types";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<Usuario | null>(null);
  const [editForm, setEditForm] = useState({ nombre: "", email: "", password: "" });
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2400);
  }, []);

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/admin");
      } else if (user.rol_id !== 1) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.rol_id !== 1) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/usuarios");
        if (!res.ok) throw new Error("Error al cargar usuarios");
        const json = await res.json();
        if (!cancelled && json.success) setUsuarios(json.data);
      } catch {
        if (!cancelled) showToast("error", "Error al cargar usuarios");
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, showToast]);

  async function toggleRol(u: Usuario) {
    if (u.id === user?.id) {
      showToast("error", "No puedes cambiarte el rol a ti mismo");
      return;
    }
    setToggling(u.id);
    try {
      const res = await fetch(`/api/usuarios/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol_id: u.rol_id === 1 ? 0 : 1 }),
      });
      const json = await res.json();
      if (json.success) {
        setUsuarios((prev) =>
          prev.map((p) => (p.id === u.id ? { ...p, rol_id: u.rol_id === 1 ? 0 : 1 } : p))
        );
        showToast("success", `Rol actualizado: ${u.nombre}`);
      } else {
        showToast("error", json.error);
      }
    } catch {
      showToast("error", "Error al actualizar rol");
    } finally {
      setToggling(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/usuarios/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setUsuarios((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showToast("success", `Usuario eliminado: ${deleteTarget.nombre}`);
        setDeleteTarget(null);
      } else {
        showToast("error", json.error);
      }
    } catch {
      showToast("error", "Error al eliminar usuario");
    } finally {
      setDeleting(false);
    }
  }

  const [form, setForm] = useState({ nombre: "", email: "", password: "" });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      setCreateError("Todos los campos son obligatorios");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setUsuarios((prev) => [...prev, json.data]);
        showToast("success", `Usuario creado: ${json.data.nombre}`);
        setShowCreate(false);
        setForm({ nombre: "", email: "", password: "" });
      } else {
        setCreateError(json.error);
      }
    } catch {
      setCreateError("Error al crear usuario");
    } finally {
      setCreating(false);
    }
  }

  function abrirEditar(u: Usuario) {
    setEditTarget(u);
    setEditForm({ nombre: u.nombre, email: u.email, password: "" });
    setEditError("");
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setEditError("");
    if (!editForm.nombre.trim() || !editForm.email.trim()) {
      setEditError("Nombre y email son obligatorios");
      return;
    }
    setEditing(true);
    try {
      const res = await fetch(`/api/usuarios/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (json.success) {
        setUsuarios((prev) =>
          prev.map((p) => (p.id === editTarget.id ? json.data : p))
        );
        showToast("success", `Usuario actualizado: ${json.data.nombre}`);
        setEditTarget(null);
      } else {
        setEditError(json.error);
      }
    } catch {
      setEditError("Error al actualizar usuario");
    } finally {
      setEditing(false);
    }
  }

  const filtered = search.trim()
    ? usuarios.filter((u) =>
        normalize(u.nombre).includes(normalize(search.trim())) ||
        normalize(u.email).includes(normalize(search.trim()))
      )
    : usuarios;

  if (loading || !user || user.rol_id !== 1) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 pt-12 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50">
          <Shield className="h-6 w-6 text-amber-700 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Panel de administración
          </h1>
          <p className="text-sm text-zinc-500">
            Bienvenido, {user.nombre} &middot; {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} registrado{usuarios.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-9 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo usuario
          </Button>
        </div>

        {loadingData ? (
          <p className="py-8 text-center text-sm text-zinc-500">Cargando usuarios...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Users className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm text-zinc-500">
              {search ? "No se encontraron usuarios" : "No hay usuarios registrados"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((u) => (
              <div
                key={u.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200/70 px-4 py-3 transition-all hover:border-zinc-300 sm:flex-row sm:items-center sm:gap-3 dark:border-zinc-800/60 dark:hover:border-zinc-700"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      u.rol_id === 1
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                    }`}
                  >
                    <UserCog className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {u.nombre}
                      </p>
                      <span
                        className={`hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex ${
                          u.rol_id === 1
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {u.rol_id === 1 ? "Admin" : "Usuario"}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-400">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:hidden ${
                          u.rol_id === 1
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {u.rol_id === 1 ? "Admin" : "Usuario"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {u.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(u.created_at).toLocaleDateString("es-CL")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-end gap-1.5 sm:self-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={toggling === u.id}
                    onClick={() => toggleRol(u)}
                    disabled={u.id === user.id}
                    title={u.id === user.id ? "No puedes cambiarte tu propio rol" : `Cambiar a ${u.rol_id === 1 ? "usuario" : "admin"}`}
                  >
                    <UserCog className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => abrirEditar(u)}
                    title="Editar usuario"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteTarget(u)}
                    disabled={u.id === user.id}
                    title={u.id === user.id ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)}>
        {deleteTarget && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Eliminar usuario
                </h3>
                <p className="text-sm text-zinc-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {deleteTarget.nombre}
              </p>
              <p className="text-xs text-zinc-500">{deleteTarget.email}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={deleting}
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showCreate} onClose={() => !creating && setShowCreate(false)}>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Nuevo usuario
              </h3>
              <p className="text-sm text-zinc-500">
                Se creará con rol de usuario.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Nombre
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Nombre del usuario"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Contraseña"
            />
          </div>

          {createError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {createError}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              type="button"
              className="flex-1"
              onClick={() => setShowCreate(false)}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button className="flex-1" type="submit" loading={creating}>
              <Plus className="mr-1.5 h-4 w-4" />
              Crear
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editTarget} onClose={() => !editing && setEditTarget(null)}>
        {editTarget && (
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Editar usuario
                </h3>
                <p className="text-sm text-zinc-500">
                  Actualiza los datos del usuario.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Nombre
              </label>
              <input
                type="text"
                value={editForm.nombre}
                onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Nombre del usuario"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Nueva contraseña <span className="text-zinc-400 font-normal">(opcional)</span>
              </label>
              <input
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Dejar en blanco para mantener"
              />
            </div>

            {editError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {editError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                type="button"
                className="flex-1"
                onClick={() => setEditTarget(null)}
                disabled={editing}
              >
                Cancelar
              </Button>
              <Button className="flex-1" type="submit" loading={editing}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6"
        >
          <div
            className={`pointer-events-auto flex max-w-md items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-200 bg-white/95 text-emerald-800 dark:border-emerald-800/60 dark:bg-zinc-900/95 dark:text-emerald-200"
                : "border-rose-200 bg-white/95 text-rose-800 dark:border-rose-800/60 dark:bg-zinc-900/95 dark:text-rose-200"
            }`}
            style={{ animation: "fadeInUp 0.25s ease both" }}
          >
            {toast.type === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
