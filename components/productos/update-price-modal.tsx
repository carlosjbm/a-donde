"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DollarSign, X } from "lucide-react";
import type { Producto } from "@/types";

interface UpdatePriceModalProps {
  open: boolean;
  lugarId: number;
  producto: Producto | null;
  onClose: () => void;
  onUpdated: (precioNuevo: number, activo?: boolean) => void;
}

export function UpdatePriceModal({
  open,
  lugarId,
  producto,
  onClose,
  onUpdated,
}: UpdatePriceModalProps) {
  const [precio, setPrecio] = useState("");
  const [notas, setNotas] = useState("");
  const [activo, setActivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (producto) {
      setActivo(producto.activo);
    }
  }, [producto]);

  function reset() {
    setPrecio("");
    setNotas("");
    setErrorMsg("");
    setSaving(false);
  }

  function handleClose() {
    if (saving) return;
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!producto) return;
    setErrorMsg("");

    const precioNum = precio.trim()
      ? Number(precio)
      : producto.precio;

    if (precio.trim() && (!Number.isFinite(precioNum) || precioNum <= 0)) {
      setErrorMsg("Ingresa un precio válido mayor a 0");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        notas: notas.trim() || undefined,
        activo,
      };
      if (precio.trim()) {
        body.precio = precioNum;
      }

      const res = await fetch(
        `/api/lugares/${lugarId}/productos/${producto.id}/precio`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.error ?? "No se pudo actualizar el precio");
        return;
      }
      onUpdated(precioNum, activo);
      reset();
      onClose();
    } catch {
      setErrorMsg("Error de red al actualizar el precio");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {producto && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Actualizar precio
              </h3>
              <p className="text-xs text-zinc-500">{producto.nombre}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50 dark:hover:bg-zinc-800"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-800">
            <p className="text-zinc-500">Precio actual</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              ${Number(producto.precio).toLocaleString("es-CL")}
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Nuevo precio
            </span>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="number"
                inputMode="decimal"
                step="1"
                min="1"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Dejar en blanco para mantener actual"
                className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Notas (opcional)
            </span>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Ej: oferta, ajuste de temporada, etc."
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </label>

          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Producto activo
              </p>
              <p className="text-xs text-zinc-500">
                {activo
                  ? "Visible para los usuarios"
                  : "Oculto para los usuarios"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={activo}
              onClick={() => setActivo(!activo)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 ${
                activo
                  ? "bg-emerald-500"
                  : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  activo ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              Guardar
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
