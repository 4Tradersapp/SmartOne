import type { Metadata } from "next";
import { AlertasView } from "@/components/views/alertas-view";

export const metadata: Metadata = { title: "Central de alertas" };

export default function Page() {
  return <AlertasView />;
}
