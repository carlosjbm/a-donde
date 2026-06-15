"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

interface MapPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number, address?: string) => void;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

function fixLeafletIcons() {
  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const defaultCenter: [number, number] = [-33.456, -70.650];

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const center: [number, number] =
      lat !== null && lng !== null ? [lat, lng] : defaultCenter;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    if (lat !== null && lng !== null) {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChangeRef.current(pos.lat, pos.lng);
      });
      markerRef.current = marker;
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        const marker = L.marker([e.latlng.lat, e.latlng.lng], {
          draggable: true,
        }).addTo(map);
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onChangeRef.current(pos.lat, pos.lng);
        });
        markerRef.current = marker;
      }
      onChangeRef.current(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    if (lat === null || lng === null) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChangeRef.current(pos.lat, pos.lng);
      });
      markerRef.current = marker;
    }
    mapRef.current.setView([lat, lng]);
  }, [lat, lng, mapReady]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  async function handleNominatimSearch(query: string) {
    if (query.length < 3) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=es`,
        { headers: { "User-Agent": "a-donde-app/1.0" } },
      );
      if (res.status === 429) {
        setLocationError("Demasiadas búsquedas. Espera un momento e intenta de nuevo.");
        return;
      }
      if (!res.ok) return;
      const data: SearchResult[] = await res.json();
      setSearchResults(data);
    } catch {
      // ignore network errors silently
    } finally {
      setSearching(false);
    }
  }

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearchResults([]);
    setLocationError("");
    if (value.length < 3) return;
    searchTimeoutRef.current = setTimeout(() => {
      handleNominatimSearch(value);
    }, 600);
  }

  function handleSelectResult(result: SearchResult) {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setLocationError("");
    onChangeRef.current(Number(result.lat), Number(result.lon), result.display_name);
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocalización no disponible en este navegador. También puedes buscar una dirección en el campo superior.");
      return;
    }
    setGettingLocation(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setGettingLocation(false);
      },
      (err) => {
        const msg =
          err.code === 1
            ? "Permiso denegado. Habilita la ubicación en tu navegador o busca una dirección más arriba."
            : err.code === 2
              ? "Ubicación no disponible. Busca una dirección en el campo superior o intenta de nuevo."
              : "La solicitud de ubicación tardó demasiado. Busca una dirección en el campo superior o intenta de nuevo.";
        setLocationError(msg);
        setGettingLocation(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Ubicación en el mapa
        </p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          loading={gettingLocation}
          onClick={handleUseMyLocation}
          title="Usar mi ubicación actual"
          className="w-full sm:w-auto"
        >
          <MapPin className="mr-1 h-3.5 w-3.5" />
          Mi ubicación
        </Button>
      </div>

      <div ref={searchContainerRef} className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {searching ? (
            <svg className="h-4 w-4 animate-spin text-zinc-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Search className="h-4 w-4 text-zinc-400" />
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          placeholder="Buscar dirección…"
          aria-label="Buscar dirección"
          className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-56 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            {searchResults.map((result, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 first:rounded-t-lg last:rounded-b-lg dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        ref={mapContainerRef}
        className="h-40 w-full overflow-hidden rounded-xl border border-zinc-300 sm:h-56 lg:h-64 dark:border-zinc-600"
      />

      {locationError && (
        <p className="text-xs text-red-500">{locationError}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3 shrink-0" />
          Lat: {lat !== null ? lat.toFixed(6) : "—"}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3 shrink-0" />
          Lng: {lng !== null ? lng.toFixed(6) : "—"}
        </span>
      </div>
    </div>
  );
}
