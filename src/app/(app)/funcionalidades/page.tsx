import type { Metadata } from "next";
import { FuncionalidadesView } from "@/components/views/funcionalidades-view";

export const metadata: Metadata = { title: "Mapa de funcionalidades" };

export default function Page() {
  return <FuncionalidadesView />;
}
