import type { Metadata } from "next";
import { MapEditor } from "@/components/editor/MapEditor";

export const metadata: Metadata = {
  title: "Create your map — Stratakort",
  description: "Search a place, shape the cartography, and export a poster.",
};

export default function CreatePage() {
  return <MapEditor />;
}
