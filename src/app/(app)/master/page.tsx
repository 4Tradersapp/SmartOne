import type { Metadata } from "next";
import { MasterView } from "@/components/views/master-view";

export const metadata: Metadata = { title: "Master da plataforma" };

export default function Page() {
  return <MasterView />;
}
