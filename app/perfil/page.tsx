"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent, useCallback, useMemo } from "react";
import type { Presupuesto, CompraConProducto, UserPack } from "@/types";
import {
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
  AlertCircle,
  Check,
  Clock,
  PiggyBank,
  X,
  ArrowRight,
  ShoppingBag,
  Store,
  Search,
  Bookmark,
  List,
  Trash2,
  Bell,
} from "lucide-react";

type FilterTab = "todas" | "despensa" | "agotadas";

function formatCLP(value: number): string {
  return `$${value.toLocaleString("es-CL")}`;
}

function formatFullDateTime(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "hace un momento";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `hace ${diffHr} h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "ayer";
  if (diffDay < 7) return `hace ${diffDay} días`;
  if (diffDay < 30) return `hace ${Math.floor(diffDay / 7)} sem`;
  if (diffDay < 365) return `hace ${Math.floor(diffDay / 30)} mes`;
  return `hace ${Math.floor(diffDay / 365)} año`;
}

function getInitials(name: string): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function avatarGradient(name: string): string {
  const gradients = [
    "from-emerald-400 via-teal-500 to-cyan-500",
    "from-violet-400 via-fuchsia-500 to-pink-500",
    "from-amber-400 via-orange-500 to-rose-500",
    "from-sky-400 via-indigo-500 to-violet-500",
    "from-lime-400 via-emerald-500 to-teal-500",
    "from-rose-400 via-pink-500 to-fuchsia-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return gradients[hash % gradients.length];
}

type KpiTheme = "emerald" | "rose" | "amber" | "indigo" | "zinc";

const KPI_THEMES: Record<
  KpiTheme,
  { surface: string; ring: string; iconBg: string; text: string }
> = {
  emerald: {
    surface:
      "bg-[radial-gradient(120%_120%_at_0%_0%,rgba(16,185,129,0.18)_0%,rgba(16,185,129,0.02)_55%,rgba(255,255,255,0.85)_100%)] dark:bg-[radial-gradient(120%_120%_at_0%_0%,rgba(16,185,129,0.22)_0%,rgba(16,185,129,0.04)_55%,rgba(24,24,27,0.85)_100%)]",
    ring: "ring-emerald-200/60 dark:ring-emerald-900/40",
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  rose: {
    surface:
      "bg-[radial-gradient(120%_120%_at_100%_0%,rgba(244,63,94,0.16)_0%,rgba(244,63,94,0.02)_55%,rgba(255,255,255,0.85)_100%)] dark:bg-[radial-gradient(120%_120%_at_100%_0%,rgba(244,63,94,0.22)_0%,rgba(244,63,94,0.04)_55%,rgba(24,24,27,0.85)_100%)]",
    ring: "ring-rose-200/60 dark:ring-rose-900/40",
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
  },
  amber: {
    surface:
      "bg-[radial-gradient(120%_120%_at_100%_100%,rgba(245,158,11,0.18)_0%,rgba(245,158,11,0.02)_55%,rgba(255,255,255,0.85)_100%)] dark:bg-[radial-gradient(120%_120%_at_100%_100%,rgba(245,158,11,0.22)_0%,rgba(245,158,11,0.04)_55%,rgba(24,24,27,0.85)_100%)]",
    ring: "ring-amber-200/60 dark:ring-amber-900/40",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
  },
  indigo: {
    surface:
      "bg-[radial-gradient(120%_120%_at_0%_100%,rgba(99,102,241,0.18)_0%,rgba(99,102,241,0.02)_55%,rgba(255,255,255,0.85)_100%)] dark:bg-[radial-gradient(120%_120%_at_0%_100%,rgba(99,102,241,0.22)_0%,rgba(99,102,241,0.04)_55%,rgba(24,24,27,0.85)_100%)]",
    ring: "ring-indigo-200/60 dark:ring-indigo-900/40",
    iconBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  zinc: {
    surface:
      "bg-[radial-gradient(120%_120%_at_50%_0%,rgba(113,113,122,0.12)_0%,rgba(113,113,122,0.02)_55%,rgba(255,255,255,0.85)_100%)] dark:bg-[radial-gradient(120%_120%_at_50%_0%,rgba(113,113,122,0.18)_0%,rgba(113,113,122,0.03)_55%,rgba(24,24,27,0.85)_100%)]",
    ring: "ring-zinc-200/60 dark:ring-zinc-800/40",
    iconBg: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    text: "text-zinc-700 dark:text-zinc-200",
  },
};

function KpiCard({
  icon: Icon,
  label,
  value,
  theme = "zinc",
  sub,
  delay = 0,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  theme?: KpiTheme;
  sub?: string;
  delay?: number;
}) {
  const t = KPI_THEMES[theme];
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-zinc-200/70 p-4 shadow-sm ring-1 ${t.ring} backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5 dark:border-zinc-800/60`}
      style={{
        animation: "fadeInUp 0.5s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 ${t.surface}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p
            className={`mt-2 truncate text-2xl font-bold tracking-tight sm:text-3xl ${t.text}`}
          >
            {value}
          </p>
          {sub && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {sub}
            </p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-white/60 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 dark:ring-zinc-800/60 ${t.iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function BudgetItem({
  presupuesto,
  isPrimary,
}: {
  presupuesto: Presupuesto;
  isPrimary: boolean;
}) {
  const valor = Number(presupuesto.valor);
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-3.5 transition-all duration-200 hover:-translate-y-px hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
      style={{ animation: "fadeInUp 0.4s ease both" }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 ${
            isPrimary
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          <Wallet className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {presupuesto.descripcion}
            </p>
            {isPrimary && (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Activo
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Creado {formatRelativeTime(presupuesto.created_date)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatCLP(valor)}
          </p>
        </div>
      </div>
    </div>
  );
}

function PurchaseCard({
  compra,
  isPending,
  onToggle,
}: {
  compra: CompraConProducto;
  isPending: boolean;
  onToggle: (next: boolean) => void;
}) {
  const agotado = compra.agotado;

  return (
    <li
      className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 sm:p-5 ${
        agotado
          ? "border-zinc-200/70 bg-zinc-50/60 dark:border-zinc-800/60 dark:bg-zinc-900/30"
          : "border-zinc-200/70 bg-white hover:-translate-y-px hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
      }`}
      style={{ animation: "fadeInUp 0.4s ease both" }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold sm:h-14 sm:w-14 sm:text-base ${
            agotado
              ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800/80 dark:text-zinc-500"
              : "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-950/60 dark:to-teal-950/60 dark:text-emerald-300"
          }`}
        >
          {agotado ? (
            <Check className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
          ) : (
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <p
              className={`truncate text-sm font-semibold sm:text-base ${
                agotado
                  ? "text-zinc-500 line-through decoration-zinc-400 dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {compra.producto_nombre}
            </p>
            <span
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                agotado
                  ? "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  agotado ? "bg-zinc-500" : "bg-emerald-500"
                }`}
              />
              {agotado ? "Agotado" : "En despensa"}
            </span>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(compra.create_at)}
            </span>
            <span className="hidden text-zinc-300 sm:inline dark:text-zinc-600">
              •
            </span>
            <span className="hidden sm:inline">
              {formatFullDateTime(compra.create_at)}
            </span>
            {agotado && compra.fecha_agotado && (
              <>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span className="inline-flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                  Agotado {formatRelativeTime(compra.fecha_agotado)}
                </span>
              </>
            )}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
            <p
              className={`text-base font-bold tabular-nums ${
                agotado
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {formatCLP(Number(compra.producto_precio))}
            </p>
            <Switch
              id={`switch-m-${compra.id}`}
              checked={agotado}
              disabled={isPending}
              onChange={onToggle}
              label={`Marcar ${compra.producto_nombre} como agotado`}
            />
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
          <p
            className={`text-base font-bold tabular-nums ${
              agotado
                ? "text-zinc-400 line-through dark:text-zinc-500"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {formatCLP(Number(compra.producto_precio))}
          </p>
          <Switch
            id={`switch-${compra.id}`}
            checked={agotado}
            disabled={isPending}
            onChange={onToggle}
            label={`Marcar ${compra.producto_nombre} como agotado`}
          />
          <span className="text-[10px] font-medium text-zinc-400">
            {isPending ? "Guardando…" : agotado ? "Sin stock" : "En stock"}
          </span>
        </div>
      </div>
    </li>
  );
}

function SkeletonKpi() {
  return (
    <div className="h-[104px] animate-pulse rounded-2xl border border-zinc-200/70 bg-white p-4 dark:border-zinc-800/60 dark:bg-zinc-900/40 sm:h-[120px] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-7 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-[88px] animate-pulse rounded-2xl border border-zinc-200/70 bg-white dark:border-zinc-800/60 dark:bg-zinc-900/40"
        />
      ))}
    </div>
  );
}

function NewBudgetModal({
  open,
  onClose,
  onSubmit,
  creating,
  error,
  descripcion,
  valor,
  onDescripcionChange,
  onValorChange,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  creating: boolean;
  error: string;
  descripcion: string;
  valor: string;
  onDescripcionChange: (v: string) => void;
  onValorChange: (v: string) => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="flex items-start justify-between"
        style={{ animation: "fadeInUp 0.3s ease both" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Nuevo presupuesto
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Define cuánto planeas gastar este mes.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-5 flex flex-col gap-4"
        style={{ animation: "fadeInUp 0.3s ease 0.05s both" }}
      >
        <Input
          label="Descripción"
          placeholder="Ej: Presupuesto mensual"
          icon={FileText}
          name="descripcion"
          value={descripcion}
          onChange={(e) => onDescripcionChange(e.target.value)}
          autoFocus
        />
        <Input
          label="Valor"
          type="number"
          placeholder="Ej: 500000"
          icon={CircleDollarSign}
          name="valor"
          value={valor}
          onChange={(e) => onValorChange(e.target.value)}
        />
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={creating} className="flex-1">
            <Plus className="mr-1.5 h-4 w-4" />
            Crear
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function PerfilPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [compras, setCompras] = useState<CompraConProducto[]>([]);
  const [packs, setPacks] = useState<UserPack[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [pendingAgotado, setPendingAgotado] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<FilterTab>("todas");
  const [search, setSearch] = useState("");

  const [descripcion, setDescripcion] = useState("");
  const [valor, setValor] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showNewPackForm, setShowNewPackForm] = useState(false);
  const [newPackName, setNewPackName] = useState("");
  const [creatingPack, setCreatingPack] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/perfil");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/presupuestos/mine").then((r) => r.json()),
      fetch("/api/compras/mine").then((r) => r.json()),
      fetch("/api/packs/mine").then((r) => r.json()),
    ])
      .then(([presJson, compJson, packJson]) => {
        if (presJson.success) setPresupuestos(presJson.data);
        if (compJson.success) setCompras(compJson.data);
        if (packJson.success) setPacks(packJson.data);
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
  const enDespensa = compras.filter((c) => !c.agotado).length;
  const agotados = compras.filter((c) => c.agotado).length;
  const totalCompras = compras.length;

  const usoPct =
    totalPresupuesto > 0
      ? Math.min(100, Math.round((totalGastado / totalPresupuesto) * 100))
      : 0;
  const usoColor =
    usoPct < 50
      ? "from-emerald-400 via-emerald-500 to-teal-500"
      : usoPct < 80
        ? "from-amber-400 via-amber-500 to-orange-500"
        : "from-rose-400 via-rose-500 to-pink-500";
  const usoLabel =
    usoPct < 50
      ? "Vas excelente"
      : usoPct < 80
        ? "Vas bien, con calma"
        : "Cuidado, casi al límite";

  const filteredCompras = useMemo(() => {
    let list = compras;
    if (filter === "despensa") list = list.filter((c) => !c.agotado);
    if (filter === "agotadas") list = list.filter((c) => c.agotado);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.producto_nombre.toLowerCase().includes(q) ||
          c.observacion?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [compras, filter, search]);

  const showToast = useCallback(
    (type: "success" | "error", msg: string) => {
      setToast({ type, msg });
      window.setTimeout(() => setToast(null), 2400);
    },
    [],
  );

  const toggleAgotado = useCallback(
    async (compra: CompraConProducto, next: boolean) => {
      if (pendingAgotado.has(compra.id)) return;
      setPendingAgotado((prev) => new Set(prev).add(compra.id));
      const previous = compras;
      setCompras((curr) =>
        curr.map((c) =>
          c.id === compra.id
            ? {
                ...c,
                agotado: next,
                fecha_agotado: next ? new Date().toISOString() : null,
              }
            : c,
        ),
      );
      try {
        const res = await fetch(`/api/compras/${compra.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agotado: next }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setCompras((curr) =>
          curr.map((c) => (c.id === compra.id ? { ...c, ...json.data } : c)),
        );
        showToast(
          "success",
          next
            ? `Marcaste "${compra.producto_nombre}" como agotado`
            : `"${compra.producto_nombre}" volvió a tu despensa`,
        );
      } catch (err) {
        setCompras(previous);
        showToast("error", "No pudimos guardar el cambio");
        console.error(err);
      } finally {
        setPendingAgotado((prev) => {
          const next = new Set(prev);
          next.delete(compra.id);
          return next;
        });
      }
    },
    [compras, pendingAgotado, showToast],
  );

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
        body: JSON.stringify({
          descripcion: descripcion.trim(),
          valor: Number(valor),
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error);
        return;
      }
      setPresupuestos((prev) => [...prev, json.data]);
      setDescripcion("");
      setValor("");
      setShowForm(false);
      showToast("success", "Presupuesto creado");
    } catch {
      setError("Error al crear presupuesto");
    } finally {
      setCreating(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-500 dark:border-zinc-700 dark:border-t-emerald-400" />
          <p className="text-sm text-zinc-500">Cargando tu perfil…</p>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.nombre);
  const gradient = avatarGradient(user.nombre);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-3 pt-8 sm:gap-7 sm:p-5 sm:pt-12">
        {/* HERO */}
        <section
          className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm sm:p-8 dark:border-zinc-800/60 dark:bg-zinc-950"
          style={{ animation: "fadeInUp 0.5s ease both" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl dark:bg-teal-500/10" />
            <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(24,24,27,0.06)_1px,transparent_0)] [background-size:18px_18px] dark:opacity-[0.18] dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(228,228,231,0.06)_1px,transparent_0)]" />
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-xl font-bold text-white shadow-lg ring-4 ring-white/40 sm:h-20 sm:w-20 sm:text-2xl dark:ring-zinc-900/40`}
              >
                {initials}
                <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  Tu cuenta
                </p>
                <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                  {user.nombre}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      user.rol_id === 1
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    }`}
                  >
                    <Shield className="h-3 w-3" />
                    {user.rol_id === 1 ? "Administrador" : "Usuario"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="self-start"
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
            {loadingData ? (
              <>
                <SkeletonKpi />
                <SkeletonKpi />
                <SkeletonKpi />
                <SkeletonKpi />
              </>
            ) : (
              <>
                <KpiCard
                  icon={TrendingUp}
                  label="Disponible"
                  value={formatCLP(Math.max(0, disponible))}
                  theme={disponible < 0 ? "rose" : "emerald"}
                  sub={
                    totalPresupuesto > 0
                      ? `${100 - usoPct}% del presupuesto`
                      : "Sin presupuesto"
                  }
                  delay={50}
                />
                <KpiCard
                  icon={TrendingDown}
                  label="Gastado"
                  value={formatCLP(totalGastado)}
                  theme="rose"
                  sub={
                    totalCompras > 0
                      ? `${totalCompras} ${totalCompras === 1 ? "compra" : "compras"}`
                      : "Aún sin compras"
                  }
                  delay={100}
                />
                <KpiCard
                  icon={Bookmark}
                  label="En despensa"
                  value={String(enDespensa)}
                  theme="indigo"
                  sub={
                    totalCompras > 0
                      ? `${Math.round((enDespensa / totalCompras) * 100)}% del total`
                      : "0% del total"
                  }
                  delay={150}
                />
                <KpiCard
                  icon={Check}
                  label="Agotados"
                  value={String(agotados)}
                  theme="amber"
                  sub={
                    totalCompras > 0
                      ? `${Math.round((agotados / totalCompras) * 100)}% del total`
                      : "0% del total"
                  }
                  delay={200}
                />
              </>
            )}
          </div>
        </section>

        {/* BUDGET USAGE BAR */}
        {!loadingData && totalPresupuesto > 0 && (
          <section
            className="relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800/60 dark:bg-zinc-900/40"
            style={{ animation: "fadeInUp 0.5s ease 0.1s both" }}
          >
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                  Uso del presupuesto
                </p>
                <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {usoLabel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {usoPct}%
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatCLP(totalGastado)} de {formatCLP(totalPresupuesto)}
                </p>
              </div>
            </div>
            <div className="relative mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${usoColor} transition-all duration-1000 ease-out`}
                style={{ width: `${usoPct}%` }}
              />
              <div
                aria-hidden
                className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
          </section>
        )}

        {/* PRESUPUESTOS + DESPENSA SUMMARY */}
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <section
            className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm lg:col-span-2 dark:border-zinc-800/60 dark:bg-zinc-950"
            style={{ animation: "fadeInUp 0.5s ease 0.15s both" }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200/70 px-5 py-4 dark:border-zinc-800/60 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Wallet className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Mis presupuestos
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Controla tus gastos mensuales
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                size="sm"
                variant="primary"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Nuevo
              </Button>
            </div>

            <div className="p-5 sm:p-6">
              {loadingData ? (
                <SkeletonList rows={2} />
              ) : presupuestos.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <PiggyBank className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Aún no tienes presupuestos
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Crea uno para empezar a controlar tus gastos.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="mt-1"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Crear presupuesto
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {presupuestos.map((p, i) => (
                    <div
                      key={p.id}
                      style={{
                        animation: "fadeInUp 0.4s ease both",
                        animationDelay: `${i * 60}ms`,
                      }}
                    >
                      <BudgetItem
                        presupuesto={p}
                        isPrimary={
                          Number(p.valor) ===
                          Math.max(
                            ...presupuestos.map((pp) => Number(pp.valor)),
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section
            className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950"
            style={{ animation: "fadeInUp 0.5s ease 0.2s both" }}
          >
            <div className="flex items-center gap-2.5 border-b border-zinc-200/70 px-5 py-4 dark:border-zinc-800/60 sm:px-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Store className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Tu despensa
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Resumen de productos
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {loadingData ? (
                <div className="space-y-3">
                  <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                  <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/40">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        <Bookmark className="h-3 w-3" />
                        En despensa
                      </div>
                      <p className="mt-1.5 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {enDespensa}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/40">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                        <Check className="h-3 w-3" />
                        Agotados
                      </div>
                      <p className="mt-1.5 text-2xl font-bold text-amber-700 dark:text-amber-300">
                        {agotados}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900/40">
                    <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      Promedio por compra
                    </p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatCLP(
                        totalCompras > 0
                          ? Math.round(totalGastado / totalCompras)
                          : 0,
                      )}
                    </p>
                  </div>

                  {compras.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Más reciente
                      </p>
                      <div className="flex items-center gap-2.5 rounded-lg border border-zinc-200/70 bg-white p-2.5 dark:border-zinc-800/60 dark:bg-zinc-900/40">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            {compras[0].producto_nombre}
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                            {formatRelativeTime(compras[0].create_at)}
                          </p>
                        </div>
                        <p className="shrink-0 text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                          {formatCLP(Number(compras[0].producto_precio))}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        {/* MIS PACKS */}
        <section
          id="packs"
          className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950"
          style={{ animation: "fadeInUp 0.5s ease 0.2s both" }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200/70 px-5 py-4 dark:border-zinc-800/60 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                <List className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Mis packs
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {packs.length > 0
                    ? `${packs.reduce((s, p) => s + p.pendientes, 0)} productos pendientes`
                    : "Crea listas de compras"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewPackForm(true)}
              size="sm"
              variant="primary"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Nuevo pack
            </Button>
          </div>

          <div className="p-5 sm:p-6">
            {loadingData ? (
              <SkeletonList rows={2} />
            ) : packs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                  <List className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Aún no tienes packs
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Crea un pack con productos para planificar tus compras.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowNewPackForm(true)}
                  className="mt-1"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Crear pack
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {packs.map((pack, i) => {
                  const pct =
                    pack.total_productos > 0
                      ? Math.round((pack.comprados / pack.total_productos) * 100)
                      : 0;
                  return (
                    <div
                      key={pack.id}
                      className="group overflow-hidden rounded-xl border border-zinc-200/70 bg-white transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
                      style={{
                        animation: "fadeInUp 0.4s ease both",
                        animationDelay: `${i * 60}ms`,
                      }}
                    >
                      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 transition-transform group-hover:scale-110 group-hover:rotate-3 dark:bg-violet-950/60 dark:text-violet-300">
                          <List className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {pack.nombre}
                            </p>
                            {pack.pendientes > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                <Bell className="h-2.5 w-2.5" />
                                {pack.pendientes} pendientes
                              </span>
                            )}
                            {pack.pendientes === 0 && pack.total_productos > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <Check className="h-2.5 w-2.5" />
                                Completado
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  pct === 100
                                    ? "bg-emerald-500"
                                    : pct > 50
                                      ? "bg-violet-500"
                                      : "bg-amber-500"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="shrink-0 text-[10px] font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
                              {pack.comprados}/{pack.total_productos}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm(`¿Eliminar pack "${pack.nombre}"?`)) return;
                            try {
                              const res = await fetch(`/api/packs/${pack.id}`, {
                                method: "DELETE",
                              });
                              const json = await res.json();
                              if (json.success) {
                                setPacks((prev) => prev.filter((p) => p.id !== pack.id));
                                showToast("success", `Pack "${pack.nombre}" eliminado`);
                              }
                            } catch {
                              showToast("error", "Error al eliminar pack");
                            }
                          }}
                          className="shrink-0 rounded-lg p-1.5 text-zinc-400 opacity-0 transition-all hover:bg-zinc-100 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-rose-400"
                          aria-label={`Eliminar pack ${pack.nombre}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {pack.productos.length > 0 && (
                        <div className="border-t border-zinc-200/70 px-4 pb-3 pt-2 dark:border-zinc-800/60 sm:px-5">
                          <div className="space-y-1">
                            {pack.productos.map((prod) => (
                              <div
                                key={prod.id}
                                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 ${
                                  prod.comprado
                                    ? "bg-zinc-50 dark:bg-zinc-800/40"
                                    : "bg-white dark:bg-zinc-900/60"
                                }`}
                              >
                                <div
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs ${
                                    prod.comprado
                                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                                      : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                                  }`}
                                >
                                  {prod.comprado ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <ShoppingBag className="h-3 w-3" />
                                  )}
                                </div>
                                <span
                                  className={`min-w-0 flex-1 truncate text-xs ${
                                    prod.comprado
                                      ? "text-zinc-500 line-through dark:text-zinc-500"
                                      : "text-zinc-800 dark:text-zinc-200"
                                  }`}
                                >
                                  {prod.nombre}
                                </span>
                                <span className="shrink-0 text-[11px] font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
                                  ${Number(prod.precio).toLocaleString("es-CL")}
                                </span>
                                <span className="hidden truncate text-[10px] text-zinc-400 sm:inline dark:text-zinc-500">
                                  {prod.lugar_nombre}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* COMPRAS */}
        <section
          className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950"
          style={{ animation: "fadeInUp 0.5s ease 0.25s both" }}
        >
          <div className="flex flex-col gap-3 border-b border-zinc-200/70 px-5 py-4 dark:border-zinc-800/60 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  <ShoppingCart className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Tus compras
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {totalCompras > 0
                      ? `${totalCompras} ${totalCompras === 1 ? "compra registrada" : "compras registradas"}`
                      : "Tu historial aparecerá aquí"}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/lugares")}
                size="sm"
                variant="primary"
                className="self-start sm:self-auto"
              >
                <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                Comprar ahora
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            {totalCompras > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 rounded-lg border border-zinc-200/70 bg-zinc-50 p-1 dark:border-zinc-800/60 dark:bg-zinc-900/40">
                  {(
                    [
                      { id: "todas", label: "Todas", count: totalCompras },
                      {
                        id: "despensa",
                        label: "En despensa",
                        count: enDespensa,
                      },
                      { id: "agotadas", label: "Agotadas", count: agotados },
                    ] as { id: FilterTab; label: string; count: number }[]
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilter(tab.id)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                        filter === tab.id
                          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                          : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums ${
                          filter === tab.id
                            ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                            : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar compra…"
                    className="w-full rounded-lg border border-zinc-200/70 bg-zinc-50 py-1.5 pl-8 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:w-56 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6">
            {loadingData ? (
              <SkeletonList rows={3} />
            ) : compras.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                  <Package className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Aún no has realizado compras
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
                    Explora los lugares disponibles y encuentra los mejores
                    precios cerca de ti.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/lugares")}
                  size="sm"
                  className="mt-1"
                >
                  <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                  Explorar lugares
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            ) : filteredCompras.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Search className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Sin resultados para tu búsqueda o filtro.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilter("todas");
                    setSearch("");
                  }}
                  className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {filteredCompras.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      animation: "fadeInUp 0.4s ease both",
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    <PurchaseCard
                      compra={c}
                      isPending={pendingAgotado.has(c.id)}
                      onToggle={(next) => toggleAgotado(c, next)}
                    />
                  </div>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <NewBudgetModal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setError("");
          setDescripcion("");
          setValor("");
        }}
        onSubmit={handleSubmit}
        creating={creating}
        error={error}
        descripcion={descripcion}
        valor={valor}
        onDescripcionChange={setDescripcion}
        onValorChange={setValor}
      />

      <Modal open={showNewPackForm} onClose={() => { setShowNewPackForm(false); setNewPackName(""); }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                <List className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Nuevo pack
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Crea una lista de productos para comprar.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setShowNewPackForm(false); setNewPackName(""); }}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newPackName.trim()) return;
              setCreatingPack(true);
              try {
                const res = await fetch("/api/packs", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ nombre: newPackName.trim() }),
                });
                const json = await res.json();
                if (!json.success) {
                  showToast("error", json.error);
                  return;
                }
                setPacks((prev) => [...prev, json.data]);
                setNewPackName("");
                setShowNewPackForm(false);
                showToast("success", "Pack creado");
              } catch {
                showToast("error", "Error al crear pack");
              } finally {
                setCreatingPack(false);
              }
            }}
            className="flex flex-col gap-4"
          >
            <Input
              label="Nombre del pack"
              placeholder="Ej: Compra mensual"
              icon={FileText}
              name="nombre"
              value={newPackName}
              onChange={(e) => setNewPackName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => { setShowNewPackForm(false); setNewPackName(""); }}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={creatingPack} className="flex-1">
                <Plus className="mr-1.5 h-4 w-4" />
                Crear
              </Button>
            </div>
          </form>
        </div>
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

      <style jsx>{`
        :global(.h-4\.5) {
          height: 1.125rem;
          width: 1.125rem;
        }
      `}</style>
    </>
  );
}
