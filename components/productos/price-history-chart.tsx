"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Package,
} from "lucide-react";
import {
  PrecioHistorial,
  PrecioHistorialPeriodo,
  PrecioHistorialPunto,
} from "@/types";

function WaveIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 12c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3" />
      <path d="M2 18c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3" />
    </svg>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

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

const CHART_WIDTH = 360;
const CHART_HEIGHT = 180;
const PADDING = { top: 18, right: 16, bottom: 30, left: 48 };

function formatPeriodoLabel(
  p: PrecioHistorialPunto,
  periodo: PrecioHistorialPeriodo,
): string {
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

function formatDate(value: string, periodo: PrecioHistorialPeriodo): string {
  const fecha = new Date(value);
  if (periodo === "ano") {
    return fecha.getFullYear().toString();
  }
  return fecha.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: periodo === "semana" ? "2-digit" : undefined,
  });
}

export function PriceHistoryChart({
  nombre,
  lugarId,
  excludeId,
}: PriceHistoryChartProps) {
  const [periodo, setPeriodo] = useState<PrecioHistorialPeriodo>("mes");
  const [data, setData] = useState<PrecioHistorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const gradientId = `priceGradient-${reactId.replace(/:/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const params = new URLSearchParams({ nombre, periodo });
        if (lugarId !== undefined) params.set("lugar", String(lugarId));
        if (excludeId) params.set("exclude", String(excludeId));
        const res = await fetch(`/api/productos/historial?${params}`);
        const json = await res.json();
        if (!cancelled) {
          if (json.success) {
            setData(json.data);
            setActiveIndex(null);
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

  const { points, minPrice, maxPrice, volatilidad } = useMemo(() => {
    const pts = data?.puntos ?? [];
    if (pts.length === 0) {
      return {
        points: [] as PrecioHistorialPunto[],
        minPrice: 0,
        maxPrice: 0,
        volatilidad: 0,
      };
    }
    const min = Math.min(...pts.map((p) => p.minimo));
    const max = Math.max(...pts.map((p) => p.maximo));

    const totalCantidad = pts.reduce((s, p) => s + p.cantidad, 0);
    const volatilidad =
      totalCantidad > 0
        ? pts.reduce(
            (s, p) =>
              s + (p.promedio > 0 ? ((p.maximo - p.minimo) / p.promedio) * p.cantidad : 0),
            0,
          ) / totalCantidad
        : 0;

    return { points: pts, minPrice: min, maxPrice: max, volatilidad };
  }, [data]);

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const range = useMemo(() => {
    if (points.length === 0) return { lo: 0, hi: 1 };
    const paddingFactor = 0.12;
    const r = maxPrice - minPrice || maxPrice * 0.1 || 1;
    const pad = r * paddingFactor;
    return { lo: minPrice - pad, hi: maxPrice + pad };
  }, [minPrice, maxPrice, points.length]);

  const scaleX = (i: number) =>
    points.length === 1
      ? PADDING.left + innerWidth / 2
      : PADDING.left + (i / (points.length - 1)) * innerWidth;

  const scaleY = (v: number) => {
    const r = range.hi - range.lo || 1;
    return PADDING.top + innerHeight - ((v - range.lo) / r) * innerHeight;
  };

  const buildPath = (
    pts: PrecioHistorialPunto[],
    accessor: (p: PrecioHistorialPunto) => number,
  ) =>
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(accessor(p))}`,
      )
      .join(" ");

  const avgPath = buildPath(points, (p) => p.promedio);
  const minPath = buildPath(points, (p) => p.minimo);
  const maxPath = buildPath(points, (p) => p.maximo);

  const bandPath = (() => {
    if (points.length === 0) return "";
    const top = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(p.maximo)}`)
      .join(" ");
    const bottom = points
      .slice()
      .reverse()
      .map((p, idxFromEnd) => {
        const i = points.length - 1 - idxFromEnd;
        return `L ${scaleX(i)} ${scaleY(p.minimo)}`;
      })
      .join(" ");
    return `${top} ${bottom} Z`;
  })();

  const avgAreaPath = points.length
    ? `${avgPath} L ${scaleX(points.length - 1)} ${PADDING.top + innerHeight} L ${scaleX(0)} ${PADDING.top + innerHeight} Z`
    : "";

  const yTicks = useMemo(() => {
    if (points.length === 0) return [];
    if (range.lo === range.hi) return [range.lo];
    return [range.hi, (range.hi + range.lo) / 2, range.lo];
  }, [range, points.length]);

  const tendencia = data?.tendencia ?? "estable";
  const variacion = data?.variacion_porcentaje ?? 0;
  const currentPrice = data?.precio_actual ?? 0;

  const promedioPonderado = useMemo(() => {
    const totalCantidad = points.reduce((s, p) => s + p.cantidad, 0);
    if (totalCantidad === 0) return 0;
    return (
      points.reduce((s, p) => s + p.promedio * p.cantidad, 0) / totalCantidad
    );
  }, [points]);

  const totalRegistros = points.reduce((s, p) => s + p.cantidad, 0);

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

  const trendBorder =
    tendencia === "sube"
      ? "border-red-200/60 dark:border-red-900/40"
      : tendencia === "baja"
        ? "border-emerald-200/60 dark:border-emerald-900/40"
        : "border-zinc-200 dark:border-zinc-700";

  const lineColor =
    tendencia === "sube"
      ? "#dc2626"
      : tendencia === "baja"
        ? "#059669"
        : "#71717a";

  const bandColor =
    tendencia === "sube"
      ? "rgba(220, 38, 38, 0.10)"
      : tendencia === "baja"
        ? "rgba(5, 150, 105, 0.10)"
        : "rgba(113, 113, 122, 0.10)";

  const bandStroke =
    tendencia === "sube"
      ? "rgba(220, 38, 38, 0.35)"
      : tendencia === "baja"
        ? "rgba(5, 150, 105, 0.35)"
        : "rgba(113, 113, 122, 0.35)";

  const TrendIcon =
    tendencia === "sube"
      ? TrendingUp
      : tendencia === "baja"
        ? TrendingDown
        : Minus;

  const volatilidadLabel =
    volatilidad < 2
      ? { text: "Estable", color: "text-zinc-500 dark:text-zinc-400" }
      : volatilidad < 6
        ? { text: "Moderada", color: "text-amber-600 dark:text-amber-400" }
        : { text: "Alta", color: "text-orange-600 dark:text-orange-400" };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xRel = ((e.clientX - rect.left) / rect.width) * CHART_WIDTH;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      const dist = Math.abs(scaleX(i) - xRel);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    setActiveIndex(closest);
  };

  const handlePointerLeave = () => setActiveIndex(null);

  const activePoint =
    activeIndex !== null && points[activeIndex] ? points[activeIndex] : null;

  const tooltipX =
    activeIndex !== null
      ? (scaleX(activeIndex) / CHART_WIDTH) * 100
      : 50;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <WaveIcon className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Fluctuación de precio
            </p>
            <p className="text-[11px] text-zinc-500">
              {totalRegistros > 0
                ? `${totalRegistros} ${totalRegistros === 1 ? "registro" : "registros"} · banda min–max por período`
                : "Rango entre mínimo y máximo por período"}
            </p>
          </div>
        </div>
        <div
          role="tablist"
          aria-label="Período de tiempo"
          className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-800/60"
        >
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              type="button"
              role="tab"
              aria-selected={periodo === p.value}
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
        <div className="flex h-[200px] items-center justify-center text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-700" />
            Cargando historial...
          </div>
        </div>
      ) : points.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center gap-1.5 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <InfoIcon className="h-4 w-4 text-zinc-400" />
          </div>
          {errorMsg ? (
            <>
              <p className="text-xs font-medium text-red-500">
                No se pudo cargar el historial
              </p>
              <p className="max-w-[260px] text-[11px] text-zinc-500">
                {errorMsg}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Sin datos históricos aún
              </p>
              <p className="max-w-[260px] text-[11px] text-zinc-500">
                Empezarás a ver la fluctuación cuando registres cambios de
                precio o realices compras.
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                Precio actual
              </p>
              <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {formatFullPrice(currentPrice)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${trendBg} ${trendColor} ${trendBorder}`}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {variacion === 0
                  ? "Sin cambios"
                  : `${variacion > 0 ? "+" : ""}${variacion.toFixed(1)}%`}
                <span className="text-[10px] font-normal opacity-70">vs. inicio</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800/60 ${volatilidadLabel.color}`}
                title="Variación promedio entre el precio mínimo y máximo dentro de cada período"
              >
                <WaveIcon className="h-3 w-3" />
                {volatilidadLabel.text} · {volatilidad.toFixed(1)}%
              </span>
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative"
            onPointerLeave={handlePointerLeave}
          >
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="block h-[180px] w-full touch-none select-none"
              preserveAspectRatio="none"
              onPointerMove={handlePointerMove}
              onPointerDown={handlePointerMove}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={lineColor} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                </linearGradient>
                <clipPath id={`${gradientId}-clip`}>
                  <rect
                    x={PADDING.left}
                    y={PADDING.top}
                    width={innerWidth}
                    height={innerHeight}
                  />
                </clipPath>
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
                      className="text-zinc-200/70 dark:text-zinc-800"
                      strokeWidth="1"
                      strokeDasharray="2 4"
                    />
                    <text
                      x={PADDING.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-zinc-400 text-[10px]"
                    >
                      {formatPrice(tick)}
                    </text>
                  </g>
                );
              })}

              {currentPrice >= range.lo && currentPrice <= range.hi && (
                <g>
                  <line
                    x1={PADDING.left}
                    x2={CHART_WIDTH - PADDING.right}
                    y1={scaleY(currentPrice)}
                    y2={scaleY(currentPrice)}
                    stroke="currentColor"
                    className="text-zinc-500 dark:text-zinc-400"
                    strokeWidth="1.25"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={CHART_WIDTH - PADDING.right - 4}
                    y={scaleY(currentPrice) - 4}
                    textAnchor="end"
                    className="fill-zinc-500 text-[9px] font-medium dark:fill-zinc-400"
                  >
                    actual
                  </text>
                </g>
              )}

              {bandPath && (
                <path
                  d={bandPath}
                  fill={bandColor}
                  stroke={bandStroke}
                  strokeWidth="1"
                  strokeDasharray="0"
                  className="transition-opacity duration-200"
                />
              )}

              <g clipPath={`url(#${gradientId}-clip)`}>
                {avgAreaPath && (
                  <path d={avgAreaPath} fill={`url(#${gradientId})`} />
                )}
              </g>

              {minPath && (
                <path
                  d={minPath}
                  fill="none"
                  stroke={bandStroke}
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  strokeLinecap="round"
                />
              )}

              {avgPath && (
                <path
                  d={avgPath}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-sm"
                />
              )}

              {maxPath && (
                <path
                  d={maxPath}
                  fill="none"
                  stroke={bandStroke}
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  strokeLinecap="round"
                />
              )}

              {activeIndex !== null && (
                <line
                  x1={scaleX(activeIndex)}
                  x2={scaleX(activeIndex)}
                  y1={PADDING.top}
                  y2={PADDING.top + innerHeight}
                  stroke="currentColor"
                  className="text-zinc-400 dark:text-zinc-500"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}

              {points.map((p, i) => {
                const x = scaleX(i);
                const y = scaleY(p.promedio);
                const isActive = i === activeIndex;
                const isLast = i === points.length - 1;
                return (
                  <g key={p.periodo}>
                    {isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r={7}
                        fill={lineColor}
                        fillOpacity="0.15"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 4.5 : isLast ? 3.5 : 2.5}
                      fill="white"
                      stroke={lineColor}
                      strokeWidth="2"
                      className="transition-all duration-150"
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

            {activePoint && activeIndex !== null && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${tooltipX}%`,
                  top: `${(scaleY(activePoint.maximo) / CHART_HEIGHT) * 100}%`,
                }}
              >
                <div className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                  <p className="font-semibold text-zinc-700 dark:text-zinc-200">
                    {formatDate(activePoint.fecha_inicio, periodo)}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                    <span className="text-zinc-500">min</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatFullPrice(activePoint.minimo)}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-600">·</span>
                    <span className="text-zinc-500">max</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {formatFullPrice(activePoint.maximo)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 border-t border-zinc-100 pt-0.5 text-[11px] dark:border-zinc-700">
                    <span className="text-zinc-500">promedio</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatFullPrice(activePoint.promedio)}
                    </span>
                    <span className="text-zinc-400">·</span>
                    <span className="text-zinc-500">
                      {activePoint.cantidad} {activePoint.cantidad === 1 ? "reg." : "regs."}
                    </span>
                  </div>
                </div>
                <div className="mx-auto h-1.5 w-1.5 -translate-y-0.5 rotate-45 border-b border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                Mínimo
              </p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {formatFullPrice(minPrice)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                Promedio
              </p>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {formatFullPrice(promedioPonderado)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                Máximo
              </p>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {formatFullPrice(maxPrice)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Package className="h-3 w-3" />
              <span>{data?.nombre ?? nombre}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span
                  className="inline-block h-0.5 w-3 rounded-full"
                  style={{ backgroundColor: lineColor }}
                />
                promedio
              </span>
              <span className="inline-flex items-center gap-1">
                <span
                  className="inline-block h-2 w-3 rounded-sm border"
                  style={{
                    backgroundColor: bandColor,
                    borderColor: bandStroke,
                  }}
                />
                rango min–max
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
