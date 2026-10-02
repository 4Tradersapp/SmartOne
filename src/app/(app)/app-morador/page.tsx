import type { Metadata } from "next";
import { AppMoradorView } from "@/components/views/app-morador-view";

export const metadata: Metadata = { title: "App do morador" };

export default function Page() {
  return <AppMoradorView />;
}
