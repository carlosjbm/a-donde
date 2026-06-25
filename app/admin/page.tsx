"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
const MapPicker = dynamic(() => import("@/components/map-picker"), {
  ssr: false,
});
import dynamic from "next/dynamic";
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
  Store,
  MapPin,
  CreditCard,
  ToggleLeft,
  Package,
  DollarSign,
  Award,
} from "lucide-react";
import type { Usuario, Lugar, Producto, Categoria } from "@/types";

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
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<Usuario | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");

  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loadingLugares, setLoadingLugares] = useState(true);
  const [lugarSearch, setLugarSearch] = useState("");
  const [editLugar, setEditLugar] = useState<Lugar | null>(null);
  const [editLugarForm, setEditLugarForm] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    latitud: "",
    longitud: "",
    transferencia: false,
  });
  const [editingLugar, setEditingLugar] = useState(false);
  const [editLugarError, setEditLugarError] = useState("");
  const [createLugar, setCreateLugar] = useState(false);
  const [createLugarForm, setCreateLugarForm] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    latitud: "",
    longitud: "",
    transferencia: false,
  });
  const [creatingLugar, setCreatingLugar] = useState(false);
  const [createLugarError, setCreateLugarError] = useState("");
  const [deleteLugarTarget, setDeleteLugarTarget] = useState<Lugar | null>(
    null,
  );
  const [deletingLugar, setDeletingLugar] = useState(false);

  const [tab, setTab] = useState<"usuarios" | "lugares" | "productos">(
    "usuarios",
  );
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [productoSearch, setProductoSearch] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [createProducto, setCreateProducto] = useState(false);
  const [createProductoForm, setCreateProductoForm] = useState({
    nombre: "",
    precio: "",
    id_lugar: "",
    id_categ: "",
    escencial: false,
    notas: "",
  });
  const [creatingProducto, setCreatingProducto] = useState(false);
  const [createProductoError, setCreateProductoError] = useState("");
  const [editProducto, setEditProducto] = useState<Producto | null>(null);
  const [editProductoForm, setEditProductoForm] = useState({
    nombre: "",
    precio: "",
    id_lugar: "",
    id_categ: "",
    escencial: false,
    notas: "",
    activo: true,
  });
  const [editingProducto, setEditingProducto] = useState(false);
  const [editProductoError, setEditProductoError] = useState("");
  const [deleteProductoTarget, setDeleteProductoTarget] =
    useState<Producto | null>(null);
  const [deletingProducto, setDeletingProducto] = useState(false);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2400);
  }, []);

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

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
    return () => {
      cancelled = true;
    };
  }, [user, showToast]);

  useEffect(() => {
    if (user?.rol_id !== 1) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/lugares");
        if (!res.ok) throw new Error("Error al cargar lugares");
        const json = await res.json();
        if (!cancelled && json.success) setLugares(json.data);
      } catch {
        if (!cancelled) showToast("error", "Error al cargar lugares");
      } finally {
        if (!cancelled) setLoadingLugares(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, showToast]);

  useEffect(() => {
    if (user?.rol_id !== 1) return;
    let cancelled = false;
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/productos"),
          fetch("/api/categorias"),
        ]);
        if (!prodRes.ok) throw new Error("Error al cargar productos");
        const prodJson = await prodRes.json();
        if (!cancelled && prodJson.success) setProductos(prodJson.data);
        if (catRes.ok) {
          const catJson = await catRes.json();
          if (!cancelled && catJson.success) setCategorias(catJson.data);
        }
      } catch {
        if (!cancelled) showToast("error", "Error al cargar productos");
      } finally {
        if (!cancelled) setLoadingProductos(false);
      }
    })();
    return () => {
      cancelled = true;
    };
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
          prev.map((p) =>
            p.id === u.id ? { ...p, rol_id: u.rol_id === 1 ? 0 : 1 } : p,
          ),
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
          prev.map((p) => (p.id === editTarget.id ? json.data : p)),
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

  const filteredLugares = lugarSearch.trim()
    ? lugares.filter(
        (l) =>
          normalize(l.nombre).includes(normalize(lugarSearch.trim())) ||
          normalize(l.direccion || "").includes(normalize(lugarSearch.trim())),
      )
    : lugares;

  function abrirEditarLugar(l: Lugar) {
    setEditLugar(l);
    setEditLugarForm({
      nombre: l.nombre,
      descripcion: l.descripcion || "",
      direccion: l.direccion,
      latitud: l.latitud?.toString() || "",
      longitud: l.longitud?.toString() || "",
      transferencia: l.transferencia,
    });
    setEditLugarError("");
  }

  async function handleEditLugar(e: React.FormEvent) {
    e.preventDefault();
    if (!editLugar) return;
    setEditLugarError("");
    if (!editLugarForm.nombre.trim() || !editLugarForm.direccion.trim()) {
      setEditLugarError("Nombre y dirección son obligatorios");
      return;
    }
    setEditingLugar(true);
    try {
      const body: Record<string, unknown> = {
        nombre: editLugarForm.nombre.trim(),
        descripcion: editLugarForm.descripcion.trim(),
        direccion: editLugarForm.direccion.trim(),
        transferencia: editLugarForm.transferencia,
      };
      const lat = editLugarForm.latitud.trim();
      const lng = editLugarForm.longitud.trim();
      if (lat) body.latitud = Number(lat);
      if (lng) body.longitud = Number(lng);
      const res = await fetch(`/api/lugares/${editLugar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setLugares((prev) =>
          prev.map((p) => (p.id === editLugar.id ? json.data : p)),
        );
        showToast("success", `Lugar actualizado: ${json.data.nombre}`);
        setEditLugar(null);
      } else {
        setEditLugarError(json.error);
      }
    } catch {
      setEditLugarError("Error al actualizar lugar");
    } finally {
      setEditingLugar(false);
    }
  }

  function abrirCrearLugar() {
    setCreateLugarForm({
      nombre: "",
      descripcion: "",
      direccion: "",
      latitud: "",
      longitud: "",
      transferencia: false,
    });
    setCreateLugarError("");
    setCreateLugar(true);
  }

  async function handleCreateLugar(e: React.FormEvent) {
    e.preventDefault();
    setCreateLugarError("");
    if (!createLugarForm.nombre.trim() || !createLugarForm.direccion.trim()) {
      setCreateLugarError("Nombre y dirección son obligatorios");
      return;
    }
    setCreatingLugar(true);
    try {
      const body: Record<string, unknown> = {
        nombre: createLugarForm.nombre.trim(),
        descripcion: createLugarForm.descripcion.trim(),
        direccion: createLugarForm.direccion.trim(),
        transferencia: createLugarForm.transferencia,
      };
      const lat = createLugarForm.latitud.trim();
      const lng = createLugarForm.longitud.trim();
      if (lat) body.latitud = Number(lat);
      if (lng) body.longitud = Number(lng);
      const res = await fetch("/api/lugares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setLugares((prev) => [...prev, json.data]);
        showToast("success", `Lugar creado: ${json.data.nombre}`);
        setCreateLugar(false);
      } else {
        setCreateLugarError(json.error);
      }
    } catch {
      setCreateLugarError("Error al crear lugar");
    } finally {
      setCreatingLugar(false);
    }
  }

  async function confirmDeleteLugar() {
    if (!deleteLugarTarget) return;
    setDeletingLugar(true);
    try {
      const res = await fetch(`/api/lugares/${deleteLugarTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setLugares((prev) => prev.filter((p) => p.id !== deleteLugarTarget.id));
        showToast("success", `Lugar eliminado: ${deleteLugarTarget.nombre}`);
        setDeleteLugarTarget(null);
      } else {
        showToast("error", json.error);
      }
    } catch {
      showToast("error", "Error al eliminar lugar");
    } finally {
      setDeletingLugar(false);
    }
  }

  function abrirCrearProducto() {
    setCreateProductoForm({
      nombre: "",
      precio: "",
      id_lugar: "",
      id_categ: "",
      escencial: false,
      notas: "",
    });
    setCreateProductoError("");
    setCreateProducto(true);
  }

  async function handleCreateProducto(e: React.FormEvent) {
    e.preventDefault();
    setCreateProductoError("");
    if (
      !createProductoForm.nombre.trim() ||
      !createProductoForm.precio.trim() ||
      !createProductoForm.id_lugar
    ) {
      setCreateProductoError("Nombre, precio y lugar son obligatorios");
      return;
    }
    setCreatingProducto(true);
    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: createProductoForm.nombre.trim(),
          precio: Number(createProductoForm.precio),
          id_lugar: Number(createProductoForm.id_lugar),
          id_categ: createProductoForm.id_categ
            ? Number(createProductoForm.id_categ)
            : null,
          escencial: createProductoForm.escencial,
          notas: createProductoForm.notas.trim() || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setProductos((prev) => [...prev, json.data]);
        showToast("success", `Producto creado: ${json.data.nombre}`);
        setCreateProducto(false);
      } else {
        setCreateProductoError(json.error);
      }
    } catch {
      setCreateProductoError("Error al crear producto");
    } finally {
      setCreatingProducto(false);
    }
  }

  function abrirEditarProducto(p: Producto) {
    setEditProducto(p);
    setEditProductoForm({
      nombre: p.nombre,
      precio: String(p.precio),
      id_lugar: String(p.id_lugar),
      id_categ: p.id_categ ? String(p.id_categ) : "",
      escencial: p.escencial,
      notas: p.notas || "",
      activo: p.activo,
    });
    setEditProductoError("");
  }

  async function handleEditProducto(e: React.FormEvent) {
    e.preventDefault();
    if (!editProducto) return;
    setEditProductoError("");
    if (
      !editProductoForm.nombre.trim() ||
      !editProductoForm.precio.trim() ||
      !editProductoForm.id_lugar
    ) {
      setEditProductoError("Nombre, precio y lugar son obligatorios");
      return;
    }
    setEditingProducto(true);
    try {
      const res = await fetch(`/api/productos/${editProducto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editProductoForm.nombre.trim(),
          precio: Number(editProductoForm.precio),
          id_lugar: Number(editProductoForm.id_lugar),
          id_categ: editProductoForm.id_categ
            ? Number(editProductoForm.id_categ)
            : null,
          escencial: editProductoForm.escencial,
          notas: editProductoForm.notas.trim() || null,
          activo: editProductoForm.activo,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setProductos((prev) =>
          prev.map((p) => (p.id === editProducto.id ? json.data : p)),
        );
        showToast("success", `Producto actualizado: ${json.data.nombre}`);
        setEditProducto(null);
      } else {
        setEditProductoError(json.error);
      }
    } catch {
      setEditProductoError("Error al actualizar producto");
    } finally {
      setEditingProducto(false);
    }
  }

  async function confirmDeleteProducto() {
    if (!deleteProductoTarget) return;
    setDeletingProducto(true);
    try {
      const res = await fetch(`/api/productos/${deleteProductoTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setProductos((prev) =>
          prev.filter((p) => p.id !== deleteProductoTarget.id),
        );
        showToast(
          "success",
          `Producto eliminado: ${deleteProductoTarget.nombre}`,
        );
        setDeleteProductoTarget(null);
      } else {
        showToast("error", json.error);
      }
    } catch {
      showToast("error", "Error al eliminar producto");
    } finally {
      setDeletingProducto(false);
    }
  }

  const filtered = search.trim()
    ? usuarios.filter(
        (u) =>
          normalize(u.nombre).includes(normalize(search.trim())) ||
          normalize(u.email).includes(normalize(search.trim())),
      )
    : usuarios;

  const filteredProductos = productoSearch.trim()
    ? productos.filter(
        (p) =>
          normalize(p.nombre).includes(normalize(productoSearch.trim())) ||
          (p.categoria || "")
            .toLowerCase()
            .includes(productoSearch.trim().toLowerCase()),
      )
    : productos;

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
          <p className="text-sm text-zinc-500">Bienvenido, {user.nombre}</p>
        </div>
      </div>

      <div className="flex gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800/50">
        <button
          type="button"
          onClick={() => setTab("usuarios")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            tab === "usuarios"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Users className="h-4 w-4" />
          Usuarios
        </button>
        <button
          type="button"
          onClick={() => setTab("lugares")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            tab === "lugares"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Store className="h-4 w-4" />
          Lugares
        </button>
        <button
          type="button"
          onClick={() => setTab("productos")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            tab === "productos"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Package className="h-4 w-4" />
          Productos
        </button>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={
                tab === "usuarios"
                  ? search
                  : tab === "lugares"
                    ? lugarSearch
                    : productoSearch
              }
              onChange={(e) =>
                tab === "usuarios"
                  ? setSearch(e.target.value)
                  : tab === "lugares"
                    ? setLugarSearch(e.target.value)
                    : setProductoSearch(e.target.value)
              }
              placeholder={
                tab === "usuarios"
                  ? "Buscar usuarios..."
                  : tab === "lugares"
                    ? "Buscar lugares..."
                    : "Buscar productos..."
              }
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-9 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
            {(tab === "usuarios"
              ? search
              : tab === "lugares"
                ? lugarSearch
                : productoSearch) && (
              <button
                type="button"
                onClick={() =>
                  tab === "usuarios"
                    ? setSearch("")
                    : tab === "lugares"
                      ? setLugarSearch("")
                      : setProductoSearch("")
                }
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            onClick={
              tab === "usuarios"
                ? () => setShowCreate(true)
                : tab === "lugares"
                  ? abrirCrearLugar
                  : abrirCrearProducto
            }
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {tab === "usuarios"
              ? "Nuevo usuario"
              : tab === "lugares"
                ? "Nuevo lugar"
                : "Nuevo producto"}
          </Button>
        </div>

        {tab === "usuarios" ? (
          loadingData ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              Cargando usuarios...
            </p>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Users className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="text-sm text-zinc-500">
                {search
                  ? "No se encontraron usuarios"
                  : "No hay usuarios registrados"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.slice(0,3).map((u) => (
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
                      title={
                        u.id === user.id
                          ? "No puedes cambiarte tu propio rol"
                          : `Cambiar a ${u.rol_id === 1 ? "usuario" : "admin"}`
                      }
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
                      title={
                        u.id === user.id
                          ? "No puedes eliminarte a ti mismo"
                          : "Eliminar usuario"
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : tab === "lugares" ? (
          loadingLugares ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              Cargando lugares...
            </p>
          ) : filteredLugares.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Store className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="text-sm text-zinc-500">
                {lugarSearch
                  ? "No se encontraron lugares"
                  : "No hay lugares registrados"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLugares.slice(0,4).map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200/70 px-4 py-3 transition-all hover:border-zinc-300 sm:flex-row sm:items-center sm:gap-3 dark:border-zinc-800/60 dark:hover:border-zinc-700"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                      <Store className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {l.nombre}
                        </p>
                        {l.transferencia ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                            <CreditCard className="h-3 w-3" />
                            Pago elec.
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <DollarSign className="h-3 w-3" />
                            Solo efectivo
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {l.direccion}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-end gap-1.5 sm:self-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => abrirEditarLugar(l)}
                      title="Editar lugar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteLugarTarget(l)}
                      title="Eliminar lugar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : loadingProductos ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            Cargando productos...
          </p>
        ) : filteredProductos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Package className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm text-zinc-500">
              {productoSearch
                ? "No se encontraron productos"
                : "No hay productos registrados"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProductos.slice(0,9).map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200/70 px-4 py-3 transition-all hover:border-zinc-300 sm:flex-row sm:items-center sm:gap-3 dark:border-zinc-800/60 dark:hover:border-zinc-700"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {p.nombre}
                      </p>
                      {!p.activo && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                          Inactivo
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {Number(p.precio).toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}
                      </span>
                      {p.categoria && (
                        <span className="inline-flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {p.categoria}
                        </span>
                      )}
                      {p.escencial && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                          Esencial
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-end gap-1.5 sm:self-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => abrirEditarProducto(p)}
                    title="Editar producto"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteProductoTarget(p)}
                    title="Eliminar producto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
      >
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

      <Modal
        open={showCreate}
        onClose={() => !creating && setShowCreate(false)}
      >
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
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre: e.target.value }))
              }
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
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
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
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
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

      <Modal
        open={!!editTarget}
        onClose={() => !editing && setEditTarget(null)}
      >
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
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, nombre: e.target.value }))
                }
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
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Nueva contraseña{" "}
                <span className="text-zinc-400 font-normal">(opcional)</span>
              </label>
              <input
                type="password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, password: e.target.value }))
                }
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

      <Modal
        open={!!deleteLugarTarget}
        onClose={() => !deletingLugar && setDeleteLugarTarget(null)}
      >
        {deleteLugarTarget && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Eliminar lugar
                </h3>
                <p className="text-sm text-zinc-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {deleteLugarTarget.nombre}
              </p>
              <p className="text-xs text-zinc-500">
                {deleteLugarTarget.direccion}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDeleteLugarTarget(null)}
                disabled={deletingLugar}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={deletingLugar}
                onClick={confirmDeleteLugar}
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={createLugar}
        onClose={() => !creatingLugar && setCreateLugar(false)}
      >
        <form
          onSubmit={handleCreateLugar}
          className="flex flex-col gap-3 sm:gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Nuevo lugar
              </h3>
              <p className="text-sm text-zinc-500">
                Registra un nuevo lugar de compras.
              </p>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Nombre
            </label>
            <input
              type="text"
              value={createLugarForm.nombre}
              onChange={(e) =>
                setCreateLugarForm((f) => ({ ...f, nombre: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Nombre del lugar"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Dirección
            </label>
            <input
              type="text"
              value={createLugarForm.direccion}
              onChange={(e) =>
                setCreateLugarForm((f) => ({ ...f, direccion: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Dirección del lugar"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Descripción{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={createLugarForm.descripcion}
              onChange={(e) =>
                setCreateLugarForm((f) => ({
                  ...f,
                  descripcion: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Breve descripción"
            />
          </div>
          <MapPicker
            lat={
              createLugarForm.latitud ? Number(createLugarForm.latitud) : null
            }
            lng={
              createLugarForm.longitud ? Number(createLugarForm.longitud) : null
            }
            onChange={(lat, lng, address) =>
              setCreateLugarForm((f) => ({
                ...f,
                latitud: String(lat),
                longitud: String(lng),
                ...(address ? { direccion: address } : {}),
              }))
            }
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Latitud{" "}
                <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={createLugarForm.latitud}
                onChange={(e) =>
                  setCreateLugarForm((f) => ({ ...f, latitud: e.target.value }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="-33.456"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Longitud{" "}
                <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={createLugarForm.longitud}
                onChange={(e) =>
                  setCreateLugarForm((f) => ({
                    ...f,
                    longitud: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="-70.650"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={createLugarForm.transferencia}
              onChange={(e) =>
                setCreateLugarForm((f) => ({
                  ...f,
                  transferencia: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Acepta pago electrónico
            </span>
          </label>
          {createLugarError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {createLugarError}
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              type="button"
              className="flex-1"
              onClick={() => setCreateLugar(false)}
              disabled={creatingLugar}
            >
              Cancelar
            </Button>
            <Button className="flex-1" type="submit" loading={creatingLugar}>
              <Plus className="mr-1.5 h-4 w-4" />
              Crear
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editLugar}
        onClose={() => !editingLugar && setEditLugar(null)}
      >
        {editLugar && (
          <form
            onSubmit={handleEditLugar}
            className="flex flex-col gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Editar lugar
                </h3>
                <p className="text-sm text-zinc-500">
                  Actualiza los datos del lugar.
                </p>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Nombre
              </label>
              <input
                type="text"
                value={editLugarForm.nombre}
                onChange={(e) =>
                  setEditLugarForm((f) => ({ ...f, nombre: e.target.value }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Nombre del lugar"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Dirección
              </label>
              <input
                type="text"
                value={editLugarForm.direccion}
                onChange={(e) =>
                  setEditLugarForm((f) => ({ ...f, direccion: e.target.value }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Dirección del lugar"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Descripción{" "}
                <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={editLugarForm.descripcion}
                onChange={(e) =>
                  setEditLugarForm((f) => ({
                    ...f,
                    descripcion: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Breve descripción"
              />
            </div>
            <MapPicker
              lat={editLugarForm.latitud ? Number(editLugarForm.latitud) : null}
              lng={
                editLugarForm.longitud ? Number(editLugarForm.longitud) : null
              }
              onChange={(lat, lng, address) =>
                setEditLugarForm((f) => ({
                  ...f,
                  latitud: String(lat),
                  longitud: String(lng),
                  ...(address ? { direccion: address } : {}),
                }))
              }
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Latitud{" "}
                  <span className="font-normal text-zinc-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={editLugarForm.latitud}
                  onChange={(e) =>
                    setEditLugarForm((f) => ({ ...f, latitud: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="-33.456"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Longitud{" "}
                  <span className="font-normal text-zinc-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={editLugarForm.longitud}
                  onChange={(e) =>
                    setEditLugarForm((f) => ({
                      ...f,
                      longitud: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="-70.650"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editLugarForm.transferencia}
                onChange={(e) =>
                  setEditLugarForm((f) => ({
                    ...f,
                    transferencia: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Acepta pago electrónico
              </span>
            </label>
            {editLugarError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {editLugarError}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                type="button"
                className="flex-1"
                onClick={() => setEditLugar(null)}
                disabled={editingLugar}
              >
                Cancelar
              </Button>
              <Button className="flex-1" type="submit" loading={editingLugar}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!deleteProductoTarget}
        onClose={() => !deletingProducto && setDeleteProductoTarget(null)}
      >
        {deleteProductoTarget && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Eliminar producto
                </h3>
                <p className="text-sm text-zinc-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {deleteProductoTarget.nombre}
              </p>
              <p className="text-xs text-zinc-500">
                {Number(deleteProductoTarget.precio).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDeleteProductoTarget(null)}
                disabled={deletingProducto}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={deletingProducto}
                onClick={confirmDeleteProducto}
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={createProducto}
        onClose={() => !creatingProducto && setCreateProducto(false)}
      >
        <form onSubmit={handleCreateProducto} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Nuevo producto
              </h3>
              <p className="text-sm text-zinc-500">
                El producto se creará como activo.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Nombre
            </label>
            <input
              type="text"
              value={createProductoForm.nombre}
              onChange={(e) =>
                setCreateProductoForm((f) => ({
                  ...f,
                  nombre: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Precio
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={createProductoForm.precio}
              onChange={(e) =>
                setCreateProductoForm((f) => ({
                  ...f,
                  precio: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Lugar
            </label>
            <select
              value={createProductoForm.id_lugar}
              onChange={(e) =>
                setCreateProductoForm((f) => ({
                  ...f,
                  id_lugar: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">Seleccionar lugar</option>
              {lugares.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Categoría{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <select
              value={createProductoForm.id_categ}
              onChange={(e) =>
                setCreateProductoForm((f) => ({
                  ...f,
                  id_categ: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Notas{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <textarea
              value={createProductoForm.notas}
              onChange={(e) =>
                setCreateProductoForm((f) => ({
                  ...f,
                  notas: e.target.value,
                }))
              }
              rows={2}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Notas adicionales"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={createProductoForm.escencial}
              onChange={(e) =>
                setCreateProductoForm((f) => ({
                  ...f,
                  escencial: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Producto esencial
            </span>
          </label>

          {createProductoError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {createProductoError}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              type="button"
              className="flex-1"
              onClick={() => setCreateProducto(false)}
              disabled={creatingProducto}
            >
              Cancelar
            </Button>
            <Button className="flex-1" type="submit" loading={creatingProducto}>
              <Plus className="mr-1.5 h-4 w-4" />
              Crear
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editProducto}
        onClose={() => !editingProducto && setEditProducto(null)}
      >
        {editProducto && (
          <form onSubmit={handleEditProducto} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Editar producto
                </h3>
                <p className="text-sm text-zinc-500">
                  Actualiza los datos del producto.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Nombre
              </label>
              <input
                type="text"
                value={editProductoForm.nombre}
                onChange={(e) =>
                  setEditProductoForm((f) => ({
                    ...f,
                    nombre: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Precio
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={editProductoForm.precio}
                onChange={(e) =>
                  setEditProductoForm((f) => ({
                    ...f,
                    precio: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Lugar
              </label>
              <select
                value={editProductoForm.id_lugar}
                onChange={(e) =>
                  setEditProductoForm((f) => ({
                    ...f,
                    id_lugar: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">Seleccionar lugar</option>
                {lugares.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Categoría{" "}
                <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <select
                value={editProductoForm.id_categ}
                onChange={(e) =>
                  setEditProductoForm((f) => ({
                    ...f,
                    id_categ: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Notas{" "}
                <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <textarea
                value={editProductoForm.notas}
                onChange={(e) =>
                  setEditProductoForm((f) => ({
                    ...f,
                    notas: e.target.value,
                  }))
                }
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Notas adicionales"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editProductoForm.escencial}
                onChange={(e) =>
                  setEditProductoForm((f) => ({
                    ...f,
                    escencial: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Producto esencial
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editProductoForm.activo}
                onChange={(e) =>
                  setEditProductoForm((f) => ({
                    ...f,
                    activo: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Producto activo
              </span>
            </label>

            {editProductoError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {editProductoError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                type="button"
                className="flex-1"
                onClick={() => setEditProducto(null)}
                disabled={editingProducto}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                type="submit"
                loading={editingProducto}
              >
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
