import type { Metadata } from "next";
import { UsuariosView } from "@/components/views/usuarios-view";

export const metadata: Metadata = { title: "Usuários e permissões" };

export default function Page() {
  return <UsuariosView />;
}
