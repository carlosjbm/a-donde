"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Award } from "lucide-react";
import Link from "next/link";
import type { ProductoSearchResult } from "@/types";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductoSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/productos/buscar?q=${encodeURIComponent(q)}`,
      );
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
        setIsOpen(json.data.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(val), 300);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topResults = results.slice(0, 3);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Buscar producto..."
          className="w-full rounded-lg border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
          </div>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
        >
          {topResults.map((result, index) => (
            <Link
              key={`${result.id}-${result.lugar_id}`}
              href={`/lugares/${result.lugar_id}`}
              className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50 ${
                index > 0
                  ? "border-t border-zinc-100 dark:border-zinc-700"
                  : ""
              }`}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
              >
                {index === 0 ? (
                  <Award className="h-4 w-4" />
                ) : (
                  `#${index + 1}`
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {result.nombre}
                </p>
                <p className="flex items-center gap-1 text-xs text-zinc-500">
                  <MapPin className="h-3 w-3" />
                  {result.lugar_nombre}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ${Number(result.precio).toLocaleString("es-CL")}
                </p>
                {index === 0 && (
                  <p className="text-[10px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    Mejor precio
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
