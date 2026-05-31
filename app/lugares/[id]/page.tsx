"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
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
} from "lucide-react";
import type { Producto, Lugar, Presupuesto, CompraConProducto } from "@/types";

export default function LugarDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

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

  useEffect(() => {
    async function load() {
      try {
        const lugarId = Number(params.id);
        const [lugRes, prodRes] = await Promise.all([
          fetch(`/api/lugares/${lugarId}`),
          fetch(`/api/lugares/${lugarId}/productos`),
        ]);

        const lugJson = await lugRes.json();
        if (lugJson.success) setLugar(lugJson.data);

        const prodJson = await prodRes.json();
        if (prodJson.success) setProductos(prodJson.data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
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

  const totalPresupuesto = presupuestos.reduce(
    (s, p) => s + Number(p.valor),
    0
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

  const gastado = compras.reduce(
    (s, c) => s + Number(c.producto_precio),
    0
  );
  const disponible = totalPresupuesto - gastado;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 pt-12">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
          <Store className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {lugar.nombre}
          </h1>
          {lugar.descripcion && (
            <p className="mt-0.5 text-sm text-zinc-500">
              {lugar.descripcion}
            </p>
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
            {productos.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Package className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                <p className="text-sm text-zinc-500">
                  No hay productos registrados en este lugar.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <Package className="h-5 w-5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {producto.nombre}
                        </p>
                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                          ${Number(producto.precio).toLocaleString("es-CL")}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => abrirModal(producto)}>
                      <ShoppingCart className="mr-1.5 h-4 w-4" />
                      Comprar
                    </Button>
                  </div>
                ))}
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
                Confirmar compra
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
    </div>
  );
}
