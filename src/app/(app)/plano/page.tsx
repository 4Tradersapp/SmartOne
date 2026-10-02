import type { Metadata } from "next";
import { PlanoView } from "@/components/views/plano-view";

export const metadata: Metadata = { title: "Plano passo a passo" };

export default function Page() {
  return <PlanoView />;
}
