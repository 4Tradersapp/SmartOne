import type { Metadata } from "next";
import { EstudoView } from "@/components/views/estudo-view";

export const metadata: Metadata = { title: "Estudo das empresas" };

export default function Page() {
  return <EstudoView />;
}
