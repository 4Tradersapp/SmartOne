import type { Metadata } from "next";
import { AcessoView } from "@/components/views/acesso-view";

export const metadata: Metadata = { title: "Controle de acesso" };

export default function Page() {
  return <AcessoView />;
}
