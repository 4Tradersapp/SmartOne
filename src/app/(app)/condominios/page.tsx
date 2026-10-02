import type { Metadata } from "next";
import { CondominiosView } from "@/components/views/condominios-view";

export const metadata: Metadata = { title: "Condomínios" };

export default function Page() {
  return <CondominiosView />;
}
