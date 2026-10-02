import type { Metadata } from "next";
import { VisaoView } from "@/components/views/visao-view";

export const metadata: Metadata = { title: "Visão do grupo" };

export default function Page() {
  return <VisaoView />;
}
