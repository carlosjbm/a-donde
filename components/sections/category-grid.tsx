"use client";

import { useEffect, useState, type ElementType } from "react";
import { DollarSign, Package } from "lucide-react";
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
import type { Categoria } from "@/types";

type ProductDisplay = {
  id: number;
  nombre: string;
  precio: number;
  escencial: boolean;
};

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
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<ProductDisplay[]>(
    [],
  );
  const [loadingProducts, setLoadingProducts] = useState(false);

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

  const handleCategoryClick = (nombre: string) => {
    if (selectedCategory === nombre) {
      setSelectedCategory(null);
      setCategoryProducts([]);
      return;
    }

    setSelectedCategory(nombre);
    setLoadingProducts(true);

    // Mock data for demonstration - in a real app, this would call an API
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          nombre: `Producto ${nombre} - Premium`,
          precio: Math.floor(Math.random() * 5000) + 5000,
          escencial:
            nombre === "Supermercados" ||
            nombre === "Carnicerías" ||
            nombre === "Frutas y Verduras",
        },
        {
          id: 2,
          nombre: `Producto ${nombre} - Estándar`,
          precio: Math.floor(Math.random() * 3000) + 2000,
          escencial: false,
        },
        {
          id: 3,
          nombre: `Producto ${nombre} - Básico`,
          precio: Math.floor(Math.random() * 2000) + 1000,
          escencial: false,
        },
      ].sort((a, b) => b.precio - a.precio); // Sort by price descending

      setCategoryProducts(mockProducts);
      setLoadingProducts(false);
    }, 500);
  };

  const display = loading
    ? []
    : categories.length > 0
      ? categories.map((c) => ({ nombre: c.nombre }))
      : defaultCategories;

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

              const isSelected = selectedCategory === cat.nombre;

              return (
                <div
                  key={cat.nombre}
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(cat.nombre)}
                >
                  <div
                    className={`group flex flex-col items-center gap-3 rounded-xl border border-zinc-200 ${style.bg} px-4 py-6 transition-all duration-200 hover:shadow-lg ${style.hover} dark:border-zinc-800 ${isSelected ? "ring-2 ring-offset-2 ring-current" : ""}`}
                    style={{ ringColor: style.iconColor }}
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

      {selectedCategory && (
        <section className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950 sm:py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Productos de {selectedCategory}
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCategoryProducts([]);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cerrar
              </button>
            </div>

            {loadingProducts ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400">
                  Cargando productos...
                </p>
              </div>
            ) : categoryProducts.length === 0 ? (
              <div className="text-center py-8">
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
                        {producto.escencial && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                            Esencial
                          </span>
                        )}
                      </div>
                      <Package className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                    </div>

                    <div className="mt-auto flex gap-2">
                      <button className="flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                        Ver detalles
                      </button>
                      <button className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
