import Link from "next/link";
import PartnerMap from "./PartnerMap";
import { PARTNERS } from "@/lib/partners";

export const metadata = {
  title: "Partner Map — Frank's Food",
  description: "A live map of farms and buyers on the Frank's Food network.",
};

export default function MapPage() {
  const farmers = PARTNERS.filter((p) => p.type === "farmer").length;
  const buyers = PARTNERS.filter((p) => p.type === "buyer").length;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partner Map</h1>
          <p className="mt-1 text-sm opacity-70">
            {farmers} farm{farmers === 1 ? "" : "s"} · {buyers} buyer
            {buyers === 1 ? "" : "s"} on the network
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-emerald-700 underline underline-offset-4 dark:text-emerald-400"
        >
          ← Home
        </Link>
      </div>

      <PartnerMap partners={PARTNERS} />

      <p className="mt-3 text-xs opacity-50">
        🟢 Farmers · 🟠 Buyers — click a pin for details.
      </p>
    </main>
  );
}
