import type { Metadata } from "next";
import { AppColaboradorView } from "@/components/views/app-colaborador-view";

export const metadata: Metadata = { title: "App do colaborador" };

export default function Page() {
  return <AppColaboradorView />;
}
