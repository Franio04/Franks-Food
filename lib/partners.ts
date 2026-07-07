// A "partner" is any farm or buyer on the network.
// This shape intentionally mirrors a future database row (Postgres/PostGIS),
// so when you wire up Supabase later you can swap this static array for a
// query and the map won't need to change.
export type Partner = {
  id: string;
  name: string;
  type: "farmer" | "buyer";
  // Longitude first, then latitude — this is the order MapLibre/GeoJSON expects.
  lng: number;
  lat: number;
};

export const PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Green Valley Farm",
    type: "farmer",
    lng: -76.9378,
    lat: 38.9897, // College Park, MD area
  },
];
