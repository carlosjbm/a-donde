"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PriceHistoryChart } from "@/components/productos/price-history-chart";
import { UpdatePriceModal } from "@/components/productos/update-price-modal";
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
} from "lucide-react";
import type { Producto, Lugar, Presupuesto, CompraConProducto } from "@/types";

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
    null
  );
  const [confirmando, setConfirmando] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [historyProducto, setHistoryProducto] = useState<Producto | null>(null);
  const [priceEditProducto, setPriceEditProducto] = useState<Producto | null>(null);

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

  const totalPresupuesto = presupuestos.reduce(
    (s, p) => s + Number(p.valor),
    0,
  );

  function abrirModal(producto: Producto) {
    if (!user) {
      router.push("/login");
      return;
    }
    setSelectedProducto(producto);
    setCompraExitosa(false);
    setErrorMsg("");
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
  }

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
  const disponible = totalPresupuesto - gastado;

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
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProductos.map((producto) => {
                  const isHighlighted = highlightedProductId === producto.id;
                  return (
                    <div
                      key={producto.id}
                      ref={(el) => {
                        productRefs.current[producto.id] = el;
                      }}
                      className={`flex flex-col gap-3 rounded-lg border p-4 transition-all hover:bg-zinc-50 sm:flex-row sm:items-center sm:gap-3 dark:hover:bg-zinc-800/50 ${
                        isHighlighted
                          ? "border-amber-400 bg-amber-50 ring-2 ring-amber-300 ring-offset-2 dark:border-amber-500 dark:bg-amber-950/30 dark:ring-amber-500/50"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
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
                            <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                              {producto.nombre}
                            </p>
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
                      </div>
                      <Button
                        onClick={() => abrirModal(producto)}
                        size="sm"
                        className="w-full shrink-0 sm:w-auto"
                      >
                        <ShoppingCart className="mr-1.5 h-4 w-4" />
                        Comprar
                      </Button>
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
              <p className="text-xs text-zinc-500">Total presupuestado</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              ${totalPresupuesto.toLocaleString("es-CL")}
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
              <div>
                <p className="text-sm text-zinc-500">Producto</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedProducto.nombre}
                </p>
                <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                  ${Number(selectedProducto.precio).toLocaleString("es-CL")}
                </p>
              </div>
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
                <span className="text-zinc-500">Valor del producto</span>
                <span className="font-medium text-red-500">
                  -${Number(selectedProducto.precio).toLocaleString("es-CL")}
                </span>
              </div>
              <hr className="border-zinc-300 dark:border-zinc-600" />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-zinc-700 dark:text-zinc-300">
                  Saldo después de la compra
                </span>
                <span
                  className={
                    disponible - Number(selectedProducto.precio) >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  $
                  {(
                    disponible - Number(selectedProducto.precio)
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
                {selectedProducto.nombre} — $
                {Number(selectedProducto.precio).toLocaleString("es-CL")}
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

      <Modal
        open={!!historyProducto}
        onClose={() => setHistoryProducto(null)}
      >
        {historyProducto && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {historyProducto.nombre}
                </h3>
                <p className="text-xs text-zinc-500">
                  Evolución del precio basada en todos los registros con este nombre
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
                ? { ...p, precio: nuevoPrecio, fech_act_precio: new Date().toISOString() }
                : p
            )
          );
        }}
      />
    </div>
  );
}
