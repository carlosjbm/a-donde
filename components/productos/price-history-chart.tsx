"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Calendar,
  Package,
} from "lucide-react";
import {
  PrecioHistorial,
  PrecioHistorialPeriodo,
  PrecioHistorialPunto,
} from "@/types";

interface PriceHistoryChartProps {
  nombre: string;
  lugarId?: number;
  excludeId?: number;
}

const PERIODOS: { value: PrecioHistorialPeriodo; label: string }[] = [
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
  { value: "ano", label: "Año" },
];

const CHART_WIDTH = 320;
const CHART_HEIGHT = 140;
const PADDING = { top: 16, right: 12, bottom: 28, left: 44 };

function formatPeriodoLabel(p: PrecioHistorialPunto, periodo: PrecioHistorialPeriodo): string {
  const fecha = new Date(p.fecha_inicio);
  if (periodo === "ano") {
    return fecha.getFullYear().toString();
  }
  if (periodo === "mes") {
    return fecha.toLocaleDateString("es-CL", {
      month: "short",
      year: "2-digit",
    });
  }
  return fecha.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
  });
}

function formatPrice(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return `$${Math.round(value)}`;
}

function formatFullPrice(value: number): string {
  return `$${value.toLocaleString("es-CL")}`;
}

export function PriceHistoryChart({ nombre, lugarId, excludeId }: PriceHistoryChartProps) {
  const [periodo, setPeriodo] = useState<PrecioHistorialPeriodo>("mes");
  const [data, setData] = useState<PrecioHistorial | null>(null);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const params = new URLSearchParams({
          nombre,
          periodo,
        });
        if (lugarId !== undefined) params.set("lugar", String(lugarId));
        if (excludeId) params.set("exclude", String(excludeId));
        const res = await fetch(`/api/productos/historial?${params}`);
        const json = await res.json();
        if (!cancelled) {
          if (json.success) {
            setData(json.data);
          } else {
            setData(null);
            setErrorMsg(json.error ?? "Respuesta sin éxito");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setErrorMsg(err instanceof Error ? err.message : "Error de red");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [nombre, lugarId, periodo, excludeId]);

  const { points, minPrice, maxPrice } = useMemo(() => {
    const pts = data?.puntos ?? [];
    if (pts.length === 0) {
      return { points: [] as PrecioHistorialPunto[], minPrice: 0, maxPrice: 0 };
    }
    const min = Math.min(...pts.map((p) => p.minimo));
    const max = Math.max(...pts.map((p) => p.maximo));
    return { points: pts, minPrice: min, maxPrice: max };
  }, [data]);

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const scaleX = (i: number) =>
    points.length === 1
      ? PADDING.left + innerWidth / 2
      : PADDING.left + (i / (points.length - 1)) * innerWidth;

  const priceRange = maxPrice - minPrice || 1;
  const scaleY = (v: number) =>
    PADDING.top + innerHeight - ((v - minPrice) / priceRange) * innerHeight;

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(p.promedio)}`)
    .join(" ");

  const areaD = points.length
    ? `${pathD} L ${scaleX(points.length - 1)} ${PADDING.top + innerHeight} L ${scaleX(0)} ${PADDING.top + innerHeight} Z`
    : "";

  const yTicks = useMemo(() => {
    if (minPrice === maxPrice) return [minPrice];
    return [minPrice, (minPrice + maxPrice) / 2, maxPrice];
  }, [minPrice, maxPrice]);

  const tendencia = data?.tendencia ?? "estable";
  const variacion = data?.variacion_porcentaje ?? 0;

  const promedioPonderado = useMemo(() => {
    const totalCantidad = points.reduce((s, p) => s + p.cantidad, 0);
    if (totalCantidad === 0) return 0;
    return (
      points.reduce((s, p) => s + p.promedio * p.cantidad, 0) / totalCantidad
    );
  }, [points]);

  const trendColor =
    tendencia === "sube"
      ? "text-red-600 dark:text-red-400"
      : tendencia === "baja"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-zinc-500 dark:text-zinc-400";

  const trendBg =
    tendencia === "sube"
      ? "bg-red-50 dark:bg-red-950/40"
      : tendencia === "baja"
        ? "bg-emerald-50 dark:bg-emerald-950/40"
        : "bg-zinc-100 dark:bg-zinc-800";

  const lineColor =
    tendencia === "sube"
      ? "#dc2626"
      : tendencia === "baja"
        ? "#059669"
        : "#71717a";

  const TrendIcon =
    tendencia === "sube"
      ? TrendingUp
      : tendencia === "baja"
        ? TrendingDown
        : Minus;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          Fluctuación de precio
        </div>
        <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriodo(p.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                periodo === p.value
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-[140px] items-center justify-center text-xs text-zinc-400">
          Cargando historial...
        </div>
      ) : points.length === 0 ? (
        <div className="flex h-[140px] flex-col items-center justify-center gap-1 text-center text-xs text-zinc-400">
          {errorMsg ? (
            <>
              <span className="text-red-500">Error: {errorMsg}</span>
              <span className="text-[10px]">
                Revisá la consola del servidor para más detalle.
              </span>
            </>
          ) : (
            <>
              <span>Sin datos históricos aún.</span>
              <span className="text-[10px]">
                Se mostrarán cuando haya productos con fech_act_precio registrada.
              </span>
              <span className="text-[10px] text-zinc-300 dark:text-zinc-600">
                Verificá con: scripts/seed_price_history.sql
              </span>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                Precio actual
              </p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {formatFullPrice(data?.precio_actual ?? 0)}
              </p>
            </div>
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${trendBg} ${trendColor}`}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {variacion === 0
                ? "Estable"
                : `${variacion > 0 ? "+" : ""}${variacion.toFixed(1)}%`}
            </div>
          </div>

          <div className="overflow-hidden">
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="h-[140px] w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="priceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={lineColor}
                    stopOpacity="0.18"
                  />
                  <stop
                    offset="100%"
                    stopColor={lineColor}
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {yTicks.map((tick, i) => {
                const y = scaleY(tick);
                return (
                  <g key={i}>
                    <line
                      x1={PADDING.left}
                      x2={CHART_WIDTH - PADDING.right}
                      y1={y}
                      y2={y}
                      stroke="currentColor"
                      className="text-zinc-200 dark:text-zinc-800"
                      strokeWidth="1"
                      strokeDasharray="2 4"
                    />
                    <text
                      x={PADDING.left - 6}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-zinc-400 text-[10px]"
                    >
                      {formatPrice(tick)}
                    </text>
                  </g>
                );
              })}

              {areaD && (
                <path d={areaD} fill="url(#priceGradient)" />
              )}

              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {points.map((p, i) => {
                const x = scaleX(i);
                const y = scaleY(p.promedio);
                const isLast = i === points.length - 1;
                return (
                  <g key={p.periodo}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isLast ? 4 : 2.5}
                      fill="white"
                      stroke={lineColor}
                      strokeWidth="2"
                    />
                  </g>
                );
              })}

              {points.map((p, i) => {
                if (points.length > 6 && i % 2 !== 0) return null;
                const x = scaleX(i);
                return (
                  <text
                    key={`label-${p.periodo}`}
                    x={x}
                    y={CHART_HEIGHT - 10}
                    textAnchor="middle"
                    className="fill-zinc-500 text-[10px]"
                  >
                    {formatPeriodoLabel(p, periodo)}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                Mínimo
              </p>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {formatFullPrice(minPrice)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                Promedio
              </p>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {formatFullPrice(promedioPonderado)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                Máximo
              </p>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {formatFullPrice(maxPrice)}
              </p>
            </div>
          </div>

          {data?.nombre && (
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Package className="h-3 w-3" />
              Producto de referencia: {data.nombre}
            </div>
          )}
        </>
      )}
    </div>
  );
}
