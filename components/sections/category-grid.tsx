"use client";

import { useEffect, useState, useCallback, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, AlertCircle, Check } from "lucide-react";
import {
  ShoppingBag,
  Beef,
  Croissant,
  Apple,
  Milk,
  Sparkles,
  Store,
  Car,
  Shirt,
  BookOpen,
  Home,
  Dumbbell,
  Smartphone,
  Utensils,
  Wine,
  Candy,
  Coffee,
  Droplets,
  Dog,
  Flower2,
  Fuel,
  GraduationCap,
  HeartPulse,
  Pizza,
  Wrench,
} from "lucide-react";
import type { Categoria, Producto } from "@/types";

const iconMap: Record<string, ElementType> = {
  supermercados: ShoppingBag,
  carnicerías: Beef,
  carnicerias: Beef,
  panaderías: Croissant,
  panaderias: Croissant,
  "frutas y verduras": Apple,
  frutas: Apple,
  verduras: Apple,
  lácteos: Milk,
  lacteos: Milk,
  limpieza: Sparkles,
  restaurant: Utensils,
  restaurante: Utensils,
  comidas: Pizza,
  bebidas: Wine,
  licores: Wine,
  farmacia: HeartPulse,
  farmacias: HeartPulse,
  electrónica: Smartphone,
  electronica: Smartphone,
  tecnología: Smartphone,
  tecnologia: Smartphone,
  ropa: Shirt,
  vestuario: Shirt,
  educación: GraduationCap,
  educacion: GraduationCap,
  librería: BookOpen,
  libreria: BookOpen,
  mascotas: Dog,
  ferretería: Wrench,
  ferreteria: Wrench,
  jardinería: Flower2,
  jardineria: Flower2,
  combustible: Fuel,
  gasolinera: Fuel,
  deportes: Dumbbell,
  muebles: Home,
  hogar: Home,
  dulces: Candy,
  café: Coffee,
  cafe: Coffee,
  postres: Candy,
};

const defaultCategories = [
  { nombre: "Supermercados" },
  { nombre: "Carnicerías" },
  { nombre: "Panaderías" },
  { nombre: "Frutas y Verduras" },
  { nombre: "Lácteos" },
  { nombre: "Limpieza" },
];

function getCategoryIcon(nombre: string): ElementType {
  const key = nombre.toLowerCase().trim();
  return iconMap[key] || Store;
}

function getCategoryColor(nombre: string): string {
  const key = nombre.toLowerCase().trim();
  const colors: Record<string, string> = {
    supermercados: "emerald",
    carnicerías: "rose",
    carnicerias: "rose",
    panaderías: "amber",
    panaderias: "amber",
    "frutas y verduras": "green",
    frutas: "green",
    verduras: "green",
    lácteos: "blue",
    lacteos: "blue",
    limpieza: "violet",
    restaurant: "orange",
    restaurante: "orange",
    farmacia: "red",
    farmacias: "red",
    electrónica: "cyan",
    electronica: "cyan",
    ropa: "pink",
    educación: "yellow",
    librería: "stone",
    mascotas: "orange",
    ferretería: "zinc",
    hogar: "indigo",
    deportes: "lime",
    café: "amber",
    cafe: "amber",
  };
  return colors[key] || "zinc";
}

const colorStyles: Record<
  string,
  { bg: string; iconBg: string; iconColor: string; hover: string }
> = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    hover:
      "group-hover:border-emerald-300 group-hover:shadow-emerald-200/50 dark:group-hover:border-emerald-700",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    hover:
      "group-hover:border-rose-300 group-hover:shadow-rose-200/50 dark:group-hover:border-rose-700",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    hover:
      "group-hover:border-amber-300 group-hover:shadow-amber-200/50 dark:group-hover:border-amber-700",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    hover:
      "group-hover:border-green-300 group-hover:shadow-green-200/50 dark:group-hover:border-green-700",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    hover:
      "group-hover:border-blue-300 group-hover:shadow-blue-200/50 dark:group-hover:border-blue-700",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    hover:
      "group-hover:border-violet-300 group-hover:shadow-violet-200/50 dark:group-hover:border-violet-700",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    hover:
      "group-hover:border-orange-300 group-hover:shadow-orange-200/50 dark:group-hover:border-orange-700",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    hover:
      "group-hover:border-red-300 group-hover:shadow-red-200/50 dark:group-hover:border-red-700",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    hover:
      "group-hover:border-cyan-300 group-hover:shadow-cyan-200/50 dark:group-hover:border-cyan-700",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    iconBg: "bg-pink-100 dark:bg-pink-900/50",
    iconColor: "text-pink-600 dark:text-pink-400",
    hover:
      "group-hover:border-pink-300 group-hover:shadow-pink-200/50 dark:group-hover:border-pink-700",
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    hover:
      "group-hover:border-yellow-300 group-hover:shadow-yellow-200/50 dark:group-hover:border-yellow-700",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    hover:
      "group-hover:border-indigo-300 group-hover:shadow-indigo-200/50 dark:group-hover:border-indigo-700",
  },
  lime: {
    bg: "bg-lime-50 dark:bg-lime-950/30",
    iconBg: "bg-lime-100 dark:bg-lime-900/50",
    iconColor: "text-lime-600 dark:text-lime-400",
    hover:
      "group-hover:border-lime-300 group-hover:shadow-lime-200/50 dark:group-hover:border-lime-700",
  },
  stone: {
    bg: "bg-stone-50 dark:bg-stone-950/30",
    iconBg: "bg-stone-100 dark:bg-stone-900/50",
    iconColor: "text-stone-600 dark:text-stone-400",
    hover:
      "group-hover:border-stone-300 group-hover:shadow-stone-200/50 dark:group-hover:border-stone-700",
  },
  zinc: {
    bg: "bg-zinc-50 dark:bg-zinc-900/30",
    iconBg: "bg-zinc-100 dark:bg-zinc-800/50",
    iconColor: "text-zinc-600 dark:text-zinc-400",
    hover:
      "group-hover:border-zinc-300 group-hover:shadow-zinc-200/50 dark:group-hover:border-zinc-700",
  },
};

export function CategoryGrid() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [selectedCatName, setSelectedCatName] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Producto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [buyProduct, setBuyProduct] = useState<Producto | null>(null);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState("");
  const [buySuccess, setBuySuccess] = useState(false);
  const [compraCantidad, setCompraCantidad] = useState(1);

  useEffect(() => {
    fetch("/api/categorias")
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((json) => {
        if (json.success) setCategories(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = useCallback(
    async (cat: Categoria) => {
      if (selectedCatId === cat.id) {
        setSelectedCatId(null);
        setSelectedCatName(null);
        setCategoryProducts([]);
        return;
      }

      setSelectedCatId(cat.id);
      setSelectedCatName(cat.nombre);
      setLoadingProducts(true);

      try {
        const res = await fetch(`/api/categorias/${cat.id}/productos`);
        const json = await res.json();
        if (json.success) {
          setCategoryProducts(json.data);
        } else {
          setCategoryProducts([]);
        }
      } catch {
        setCategoryProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    },
    [selectedCatId],
  );

  function abrirCompra(producto: Producto) {
    if (!user) {
      router.push("/login?redirect=/");
      return;
    }
    setBuyProduct(producto);
    setBuyError("");
    setBuySuccess(false);
    setCompraCantidad(1);
  }

  async function confirmarCompra() {
    if (!buyProduct) return;
    setBuying(true);
    setBuyError("");
    try {
      const res = await fetch("/api/compras/mine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": String(user!.id),
        },
        body: JSON.stringify({
          id_producto: buyProduct.id,
          cantidad: compraCantidad,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setBuySuccess(true);
        setTimeout(() => {
          setBuyProduct(null);
          setBuySuccess(false);
        }, 1800);
      } else {
        setBuyError(json.error || "Error al comprar");
      }
    } catch {
      setBuyError("Error al realizar la compra");
    } finally {
      setBuying(false);
    }
  }

  const display = loading
    ? []
    : categories.length > 0
      ? categories
      : defaultCategories.map((c, i) => ({ id: i + 1, nombre: c.nombre, descripcion: "", icono: null, created_at: "", updated_at: "" }));

  if (loading) {
    return (
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-16 dark:border-zinc-800 dark:bg-black/50 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Categorías
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Explora lugares por categoría
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-16 dark:border-zinc-800 dark:bg-black/50 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Categorías
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Explora lugares por categoría
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {display.map((cat) => {
              const colorName = getCategoryColor(cat.nombre);
              const style = colorStyles[colorName] || colorStyles.zinc;
              const Icon = getCategoryIcon(cat.nombre);

              const isSelected = selectedCatId === cat.id;

              return (
                <div
                  key={cat.nombre}
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div
                    className={`group flex flex-col items-center gap-3 rounded-xl border-2 px-4 py-6 transition-all duration-200 hover:shadow-lg dark:border-zinc-800 ${isSelected ? `${style.bg} ${style.iconColor} shadow-lg` : `${style.bg} border-zinc-200 hover:border-zinc-300 ${style.hover}`}`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.iconBg} transition-transform duration-200 ${isSelected ? "scale-110 rotate-3" : "group-hover:scale-110 group-hover:rotate-3"}`}
                    >
                      <Icon className={`h-6 w-6 ${style.iconColor}`} />
                    </div>
                    <span
                      className={`text-center text-sm font-medium ${isSelected ? style.iconColor : "text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100"}`}
                    >
                      {cat.nombre}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedCatId && (
        <section className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950 sm:py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Productos de {selectedCatName}
              </h3>
              <button
                onClick={() => {
                  setSelectedCatId(null);
                  setSelectedCatName(null);
                  setCategoryProducts([]);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cerrar
              </button>
            </div>

            {loadingProducts ? (
              <div className="py-8 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">
                  Cargando productos...
                </p>
              </div>
            ) : categoryProducts.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  No hay productos disponibles en esta categoría
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {producto.nombre}
                        </h4>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {Number(producto.precio).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {producto.escencial && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                              Esencial
                            </span>
                          )}
                          {producto.categoria && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              {producto.categoria}
                            </span>
                          )}
                        </div>
                      </div>
                      <Package className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                    </div>

                    <div className="mt-auto flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => abrirCompra(producto)}
                      >
                        <ShoppingCart className="mr-1.5 h-4 w-4" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Modal
        open={!!buyProduct}
        onClose={() => !buying && !buySuccess && setBuyProduct(null)}
      >
        {buyProduct && !buySuccess && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Confirmar compra
                </h3>
                <p className="text-sm text-zinc-500">
                  ¿Deseas comprar este producto?
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {buyProduct.nombre}
              </p>
              <p className="text-sm text-zinc-500">
                {Number(buyProduct.precio).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </p>
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
                  Number(buyProduct.precio) * compraCantidad
                ).toLocaleString("es-CL")}
              </p>
            )}

            {buyError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {buyError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setBuyProduct(null)}
                disabled={buying}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={buying}
                onClick={confirmarCompra}
              >
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                Comprar
              </Button>
            </div>
          </div>
        )}

        {buySuccess && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
              <Check className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Compra realizada
              </h3>
              <p className="text-sm text-zinc-500">
                {buyProduct?.nombre}
                {compraCantidad > 1 ? ` ×${compraCantidad}` : ""} se ha
                agregado a tu lista
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
