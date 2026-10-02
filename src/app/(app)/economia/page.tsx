import type { Metadata } from "next";
import { EconomiaView } from "@/components/views/economia-view";

export const metadata: Metadata = { title: "Economia" };

export default function Page() {
  return <EconomiaView />;
}
