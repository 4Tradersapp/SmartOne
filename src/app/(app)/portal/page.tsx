import type { Metadata } from "next";
import { PortalView } from "@/components/views/portal-view";

export const metadata: Metadata = { title: "Portal do síndico" };

export default function Page() {
  return <PortalView />;
}
