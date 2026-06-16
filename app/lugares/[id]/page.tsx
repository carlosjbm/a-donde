"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PriceHistoryChart } from "@/components/productos/price-history-chart";
import { UpdatePriceModal } from "@/components/productos/update-price-modal";
import { StarRating } from "@/components/star-rating";
import {
  Store,
  MapPin,
  ShoppingCart,
  Wallet,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  X,
  Package,
  CreditCard,
  Search,
  LineChart,
  Pencil,
  ListPlus,
  List,
  Check,
  Plus,
} from "lucide-react";

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CoordField({
  label,
  value,
  isCopied,
  onCopy,
}: {
  label: string;
  value: number;
  isCopied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="group rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-800/60">
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <div className="flex items-center justify-between gap-1">
        <span className="truncate font-mono text-xs text-zinc-700 dark:text-zinc-200">
          {value}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copiar ${label.toLowerCase()}`}
          title={isCopied ? "Copiado" : "Copiar"}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors ${
            isCopied
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
          }`}
        >
          {isCopied ? (
            <CheckIcon className="h-3 w-3" />
          ) : (
            <CopyIcon className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
}
import type {
  Producto,
  Lugar,
  Presupuesto,
  CompraConProducto,
  UserPack,
} from "@/types";

export default function LugarDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [lugar, setLugar] = useState<Lugar | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [compras, setCompras] = useState<CompraConProducto[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null,
  );
  const [confirmando, setConfirmando] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [compraCantidad, setCompraCantidad] = useState(1);
  const [search, setSearch] = useState("");
  const [historyProducto, setHistoryProducto] = useState<Producto | null>(null);
  const [priceEditProducto, setPriceEditProducto] = useState<Producto | null>(
    null,
  );
  const [showLocation, setShowLocation] = useState(false);
  const [copiedField, setCopiedField] = useState<"lat" | "lng" | null>(null);
  const [packProducto, setPackProducto] = useState<Producto | null>(null);
  const [packCantidad, setPackCantidad] = useState(1);
  const [userPacks, setUserPacks] = useState<UserPack[]>([]);
  const [addingToPack, setAddingToPack] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const lugarRef = useRef(lugar);
  lugarRef.current = lugar;

  const handleRate = useCallback(async (estrellas: number) => {
    if (!user) return;
    setRatingLoading(true);
    setUserRating(estrellas);
    try {
      const res = await fetch(`/api/lugares/${lugarRef.current!.id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estrellas }),
      });
      const json = await res.json();
      if (json.success) {
        setLugar(json.data);
        showToast("success", "Valoración guardada");
      } else {
        setUserRating(null);
        showToast("error", json.error);
      }
    } catch {
      setUserRating(null);
      showToast("error", "Error al valorar");
    } finally {
      setRatingLoading(false);
    }
  }, [user, showToast]);

  const highlightedProductId = Number(searchParams.get("producto")) || null;
  const productRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const handledProductRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const lugarId = Number(params.id);
        if (!Number.isInteger(lugarId) || lugarId <= 0) {
          setLugar(null);
          setProductos([]);
          return;
        }

        const lugRes = await fetch(`/api/lugares/${lugarId}`);
        const lugJson = await lugRes.json();
        if (cancelled) return;

        if (!lugRes.ok || !lugJson.success) {
          setLugar(null);
          setProductos([]);
          return;
        }
        setLugar(lugJson.data);

        const prodRes = await fetch(`/api/lugares/${lugarId}/productos`);
        const prodJson = await prodRes.json();
        if (cancelled) return;

        if (prodRes.ok && prodJson.success) {
          setProductos(prodJson.data);
        } else {
          setProductos([]);
        }
      } catch {
        if (!cancelled) {
          setLugar(null);
          setProductos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/presupuestos/mine").then((r) => r.json()),
      fetch("/api/compras/mine").then((r) => r.json()),
    ]).then(([presJson, compJson]) => {
      if (presJson.success) setPresupuestos(presJson.data);
      if (compJson.success) setCompras(compJson.data);
    });
  }, [user]);

  useEffect(() => {
    if (!user || !lugar) return;
    fetch(`/api/lugares/${lugar.id}/rate`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUserRating(json.data.estrellas);
      })
      .catch(() => {});
  }, [user, lugar]);

  useEffect(() => {
    if (loading || productos.length === 0) return;

    const productoId = Number(searchParams.get("producto"));
    if (!productoId) return;

    const match = productos.find((p) => p.id === productoId);
    if (!match) return;

    const el = productRefs.current[productoId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (
      searchParams.get("autobuy") === "1" &&
      handledProductRef.current !== productoId
    ) {
      handledProductRef.current = productoId;
      if (user) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedProducto((current) =>
          current?.id === match.id ? current : match,
        );
      } else {
        router.push(
          `/login?redirect=/lugares/${params.id}?producto=${productoId}&autobuy=1`,
        );
      }
    }
  }, [loading, productos, searchParams, user, router, params.id]);

  const totalPresupuesto = presupuestos
    .filter((p) => p.activo !== false)
    .reduce((s, p) => s + Number(p.valor), 0);

  function abrirModal(producto: Producto) {
    if (!user) {
      router.push("/login");
      return;
    }
    setSelectedProducto(producto);
    setCompraExitosa(false);
    setErrorMsg("");
    setCompraCantidad(1);
    setShowLocation(false);
    setCopiedField(null);
  }

  async function abrirPackModal(producto: Producto) {
    if (!user) {
      router.push("/login");
      return;
    }
    setPackProducto(producto);
    setPackCantidad(1);
    try {
      const res = await fetch("/api/packs/mine");
      const json = await res.json();
      if (json.success) setUserPacks(json.data);
    } catch {
      setUserPacks([]);
    }
  }

  async function agregarAPack(packId: number) {
    if (!packProducto) return;
    setAddingToPack((prev) => new Set(prev).add(packId));
    try {
      const res = await fetch(`/api/packs/${packId}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: packProducto.id,
          cantidad: packCantidad,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", `"${packProducto.nombre}" agregado al pack`);
        setPackProducto(null);
        setPackCantidad(1);
      } else {
        showToast("error", json.error);
      }
    } catch {
      showToast("error", "Error al agregar al pack");
    } finally {
      setAddingToPack((prev) => {
        const next = new Set(prev);
        next.delete(packId);
        return next;
      });
    }
  }

  async function confirmarCompra() {
    if (!selectedProducto) return;
    setConfirmando(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/compras/mine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_producto: selectedProducto.id,
          observacion: "",
          cantidad: compraCantidad,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setErrorMsg(json.error);
        return;
      }

      const [compRes, presRes] = await Promise.all([
        fetch("/api/compras/mine"),
        fetch("/api/presupuestos/mine"),
      ]);
      const compJson = await compRes.json();
      const presJson = await presRes.json();
      if (compJson.success) setCompras(compJson.data);
      if (presJson.success) setPresupuestos(presJson.data);

      window.dispatchEvent(new CustomEvent("budget-update"));
      setCompraExitosa(true);
    } catch {
      setErrorMsg("Error al realizar la compra");
    } finally {
      setConfirmando(false);
    }
  }

  function cerrarModal() {
    setSelectedProducto(null);
    setCompraExitosa(false);
    setErrorMsg("");
    setShowLocation(false);
    setCopiedField(null);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = null;
    }
  }

  async function copyToClipboard(value: string, field: "lat" | "lng") {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedField(field);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  if (!lugar) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-zinc-500">Lugar no encontrado</p>
      </div>
    );
  }

  const gastado = compras.reduce((s, c) => s + Number(c.producto_precio), 0);
  const totalPresupuestoInicial = presupuestos
    .filter((p) => p.activo !== false)
    .reduce((s, p) => s + Number(p.valor_inicial), 0);
  const disponible = totalPresupuesto;

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filteredProductos = search.trim()
    ? productos.filter((p) =>
        normalize(p.nombre).includes(normalize(search.trim())),
      )
    : productos;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 pt-12 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
          <Store className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {lugar.nombre}
            </h1>
            {lugar.transferencia ? (
              <span
                title="Acepta pago electrónico"
                aria-label="Acepta pago electrónico"
                className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Pago electrónico
              </span>
            ) : null}
          </div>
          {lugar.descripcion && (
            <p className="mt-0.5 text-sm text-zinc-500">{lugar.descripcion}</p>
          )}
          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="h-3.5 w-3.5" />
            {lugar.direccion}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {lugar.estrellas != null && (
              <div className="flex items-center gap-1">
                <StarRating value={lugar.estrellas} size="sm" />
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  {lugar.estrellas}
                </span>
              </div>
            )}
            {user && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  |
                </span>
                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                  Tu voto:
                </span>
                <StarRating
                  value={userRating}
                  size="sm"
                  interactive
                  onChange={handleRate}
                />
                {ratingLoading && (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-500" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Productos">
            {productos.length > 0 && (
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar producto en este lugar..."
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
            )}
            {productos.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Package className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                <p className="text-sm text-zinc-500">
                  No hay productos registrados en este lugar.
                </p>
              </div>
            ) : filteredProductos.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Search className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                <p className="text-sm text-zinc-500">
                  No se encontraron productos que coincidan con &ldquo;{search}
                  &rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {filteredProductos.map((producto) => {
                  const isHighlighted = highlightedProductId === producto.id;
                  return (
                    <div
                      key={producto.id}
                      ref={(el) => {
                        productRefs.current[producto.id] = el;
                      }}
                      className={`flex flex-col gap-3 rounded-lg border p-4 transition-all hover:bg-zinc-50 lg:flex-row lg:items-center lg:gap-4 dark:hover:bg-zinc-800/50 ${
                        isHighlighted
                          ? "border-amber-400 bg-amber-50 ring-2 ring-amber-300 ring-offset-2 dark:border-amber-500 dark:bg-amber-950/30 dark:ring-amber-500/50"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          isHighlighted
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                        }`}
                      >
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                            {producto.nombre}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistoryProducto(producto);
                            }}
                            aria-label="Ver fluctuación de precio"
                            title="Ver fluctuación de precio"
                            className="shrink-0 rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            <LineChart className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPriceEditProducto(producto);
                            }}
                            aria-label="Actualizar precio"
                            title="Actualizar precio"
                            className="shrink-0 rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p
                          className={`text-sm font-semibold ${
                            isHighlighted
                              ? "text-amber-700 dark:text-amber-300"
                              : "text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          ${Number(producto.precio).toLocaleString("es-CL")}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1.5 lg:self-center">
                        <Button
                          onClick={() => abrirPackModal(producto)}
                          size="sm"
                          variant="secondary"
                          className="shrink-0"
                          aria-label={`Agregar ${producto.nombre} a un pack`}
                        >
                          <ListPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => abrirModal(producto)}
                          size="sm"
                          className="shrink-0"
                        >
                          <ShoppingCart className="mr-1.5 h-4 w-4" />
                          Comprar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Tu presupuesto">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-zinc-500" />
              <p className="text-xs text-zinc-500">Presupuesto original</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              ${totalPresupuestoInicial.toLocaleString("es-CL")}
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <div className="flex flex-1 justify-between text-sm">
                  <span className="text-zinc-500">Gastado</span>
                  <span className="font-medium text-red-500">
                    ${gastado.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 dark:bg-green-950">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div className="flex flex-1 justify-between text-sm">
                  <span className="text-zinc-500">Disponible</span>
                  <span
                    className={`font-medium ${disponible >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    ${disponible.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={!!selectedProducto} onClose={cerrarModal}>
        {selectedProducto && !compraExitosa && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Confirmar compra
              </h3>
              <button
                onClick={cerrarModal}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-500">Producto</p>
                <p className="truncate text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedProducto.nombre}
                </p>
                <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                  ${Number(selectedProducto.precio).toLocaleString("es-CL")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-200/70 bg-zinc-50 px-3 py-2.5 dark:border-zinc-800/60 dark:bg-zinc-900/40">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Cantidad
              </label>
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCompraCantidad((q) => Math.max(1, q - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={compraCantidad}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1 && v <= 999)
                      setCompraCantidad(v);
                  }}
                  className="h-7 w-12 rounded-md border border-zinc-200 bg-white text-center text-sm font-medium tabular-nums text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setCompraCantidad((q) => Math.min(999, q + 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  +
                </button>
              </div>
            </div>

            {compraCantidad > 1 && (
              <p className="-mt-2 text-right text-xs font-medium text-violet-600 dark:text-violet-400">
                Subtotal: $
                {(
                  Number(selectedProducto.precio) * compraCantidad
                ).toLocaleString("es-CL")}
              </p>
            )}

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setShowLocation((v) => !v)}
                aria-expanded={showLocation}
                aria-controls="buy-location-panel"
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  Ver ubicación del lugar
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${
                    showLocation ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showLocation && (
                <div
                  id="buy-location-panel"
                  className="space-y-3 border-t border-zinc-200 px-3 py-3 dark:border-zinc-700"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {lugar.direccion || (
                        <span className="italic text-zinc-400">
                          Sin dirección registrada
                        </span>
                      )}
                    </p>
                  </div>

                  {lugar.latitud !== null && lugar.longitud !== null ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <CoordField
                          label="Latitud"
                          value={lugar.latitud}
                          isCopied={copiedField === "lat"}
                          onCopy={() =>
                            copyToClipboard(String(lugar.latitud), "lat")
                          }
                        />
                        <CoordField
                          label="Longitud"
                          value={lugar.longitud}
                          isCopied={copiedField === "lng"}
                          onCopy={() =>
                            copyToClipboard(String(lugar.longitud), "lng")
                          }
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${lugar.latitud},${lugar.longitud}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                          <ExternalLinkIcon className="h-3 w-3" />
                          Abrir en Google Maps
                        </a>
                        <a
                          href={`https://waze.com/ul?ll=${lugar.latitud},${lugar.longitud}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                          <ExternalLinkIcon className="h-3 w-3" />
                          Abrir en Waze
                        </a>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs italic text-zinc-400">
                      Este lugar no tiene coordenadas registradas.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-zinc-500" />
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Tu presupuesto
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Disponible actual</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  ${disponible.toLocaleString("es-CL")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  Valor {compraCantidad > 1 && `(×${compraCantidad})`}
                </span>
                <span className="font-medium text-red-500">
                  -$
                  {(
                    Number(selectedProducto.precio) * compraCantidad
                  ).toLocaleString("es-CL")}
                </span>
              </div>
              <hr className="border-zinc-300 dark:border-zinc-600" />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-zinc-700 dark:text-zinc-300">
                  Saldo después de la compra
                </span>
                <span
                  className={
                    disponible -
                      Number(selectedProducto.precio) * compraCantidad >=
                    0
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  $
                  {(
                    disponible -
                    Number(selectedProducto.precio) * compraCantidad
                  ).toLocaleString("es-CL")}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={cerrarModal}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={confirmando}
                onClick={confirmarCompra}
              >
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                Confirmar
              </Button>
            </div>
          </div>
        )}

        {selectedProducto && compraExitosa && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                ¡Compra realizada!
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                {selectedProducto.nombre}
                {compraCantidad > 1 ? ` ×${compraCantidad}` : ""} — $
                {(
                  Number(selectedProducto.precio) * compraCantidad
                ).toLocaleString("es-CL")}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 dark:bg-green-950">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-zinc-500">Nuevo disponible</p>
                <p className="text-xl font-bold text-green-600">
                  ${disponible.toLocaleString("es-CL")}
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={cerrarModal}>
              Cerrar
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={!!historyProducto} onClose={() => setHistoryProducto(null)}>
        {historyProducto && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {historyProducto.nombre}
                </h3>
                <p className="text-xs text-zinc-500">
                  Evolución del precio basada en todos los registros con este
                  nombre
                </p>
              </div>
              <button
                onClick={() => setHistoryProducto(null)}
                aria-label="Cerrar"
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <PriceHistoryChart
              nombre={historyProducto.nombre}
              excludeId={historyProducto.id}
            />
          </div>
        )}
      </Modal>

      <UpdatePriceModal
        open={!!priceEditProducto}
        lugarId={lugar.id}
        producto={priceEditProducto}
        onClose={() => setPriceEditProducto(null)}
        onUpdated={(nuevoPrecio) => {
          setProductos((prev) =>
            prev.map((p) =>
              p.id === priceEditProducto?.id
                ? {
                    ...p,
                    precio: nuevoPrecio,
                    fech_act_precio: new Date().toISOString(),
                  }
                : p,
            ),
          );
        }}
      />

      <Modal open={!!packProducto} onClose={() => setPackProducto(null)}>
        {packProducto && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                  <ListPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Agregar a pack
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {packProducto.nombre} — $
                    {Number(packProducto.precio).toLocaleString("es-CL")} c/u
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPackProducto(null)}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-200/70 bg-zinc-50 px-3 py-2.5 dark:border-zinc-800/60 dark:bg-zinc-900/40">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Cantidad
              </label>
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPackCantidad((q) => Math.max(1, q - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={packCantidad}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1 && v <= 999) setPackCantidad(v);
                  }}
                  className="h-7 w-12 rounded-md border border-zinc-200 bg-white text-center text-sm font-medium tabular-nums text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setPackCantidad((q) => Math.min(999, q + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  +
                </button>
              </div>
            </div>
            {packCantidad > 1 && (
              <p className="text-xs text-right font-medium text-violet-600 dark:text-violet-400">
                Subtotal: $
                {(Number(packProducto.precio) * packCantidad).toLocaleString(
                  "es-CL",
                )}
              </p>
            )}

            {userPacks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <ListPlus className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No tienes packs. Crea uno desde tu perfil.
                </p>
                <Button size="sm" onClick={() => router.push("/perfil#packs")}>
                  Ir a mis packs
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {userPacks.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    disabled={addingToPack.has(pack.id)}
                    onClick={() => agregarAPack(pack.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-zinc-200/70 px-4 py-3 text-left transition-all hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50 dark:border-zinc-800/60 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                      <List className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {pack.nombre}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {pack.pendientes} pendientes · {pack.total_productos}{" "}
                        productos
                      </p>
                    </div>
                    {addingToPack.has(pack.id) ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-violet-500" />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-zinc-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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
