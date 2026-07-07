"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Partner } from "@/lib/partners";

// A keyless map style using OpenStreetMap's raster tiles — no signup or API key.
// Upgrade path: swap this for a MapTiler/Mapbox vector style (needs a free key)
// for sharper, faster maps once you're ready.
const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export default function PartnerMap({ partners }: { partners: Partner[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const first = partners[0];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: first ? [first.lng, first.lat] : [-98.5, 39.8], // fallback: center of US
      zoom: first ? 11 : 3,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    for (const partner of partners) {
      const color = partner.type === "farmer" ? "#059669" : "#d97706";
      new maplibregl.Marker({ color })
        .setLngLat([partner.lng, partner.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 24 }).setText(
            `${partner.name} · ${partner.type}`,
          ),
        )
        .addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [partners]);

  return (
    <div
      ref={containerRef}
      className="h-[70vh] w-full overflow-hidden rounded-2xl border border-current/10"
    />
  );
}
