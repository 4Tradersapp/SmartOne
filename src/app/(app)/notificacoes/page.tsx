import type { Metadata } from "next";
import { NotificacoesView } from "@/components/views/notificacoes-view";

export const metadata: Metadata = { title: "Notificações" };

export default function Page() {
  return <NotificacoesView />;
}
