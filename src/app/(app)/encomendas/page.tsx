import type { Metadata } from "next";
import { EncomendasView } from "@/components/views/encomendas-view";

export const metadata: Metadata = { title: "Encomendas" };

export default function Page() {
  return <EncomendasView />;
}
