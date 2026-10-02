"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  Bell,
  Building2,
  FileText,
  House,
  LayoutDashboard,
  ListChecks,
  ListOrdered,
  Monitor,
  Package,
  ScanFace,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useDemo } from "@/components/providers/demo-provider";
import { NAV, ROLE_ORDER, ROLES, viewFromPath } from "@/lib/rbac";
import { scopeAlerts } from "@/lib/scope";
import type { RoleId, ViewId } from "@/lib/types";

const ICONS: Record<ViewId, LucideIcon> = {
  visao: LayoutDashboard,
  condominios: Building2,
  alertas: TriangleAlert,
  notificacoes: Bell,
  encomendas: Package,
  acesso: ScanFace,
  portal: Monitor,
  "app-colaborador": Smartphone,
  "app-morador": House,
  usuarios: Users,
  master: ShieldCheck,
  estudo: FileText,
  funcionalidades: ListChecks,
  plano: ListOrdered,
  economia: TrendingUp,
};

export function Shell({ children }: { children: ReactNode }) {
  const { role, setRole, alerts } = useDemo();
  const pathname = usePathname();
  const router = useRouter();
  const current = viewFromPath(pathname);

  // Perfil sem acesso à tela atual: volta para a tela inicial do perfil
  useEffect(() => {
    if (current && !role.nav.includes(current)) router.replace(NAV[role.home].path);
  }, [current, role, router]);

  const open = scopeAlerts(role, alerts).filter((a) => a.status !== "encerrado").length;
  const prod = role.nav.filter((k) => NAV[k].group === "prod");
  const pres = role.nav.filter((k) => NAV[k].group === "pres");

  const item = (k: ViewId) => {
    const Icon = ICONS[k];
    return (
      <Link key={k} href={NAV[k].path} className="nav" aria-current={current === k ? "page" : undefined}>
        <Icon aria-hidden="true" strokeWidth={1.7} />
        <span>{NAV[k].label}</span>
        {k === "alertas" && open ? <span className="count">{open}</span> : null}
      </Link>
    );
  };

  return (
    <div className="shell">
      <aside className="rail" aria-label="Navegação">
        <div className="brand">
          <div className="mark" aria-hidden="true">
            S1
          </div>
          <div>
            <b>SMART ONE</b>
            <span>Grupo FortSvig</span>
          </div>
        </div>
        <nav className="navgroup" aria-label="Produto">
          <div className="eyebrow">Produto</div>
          {prod.map(item)}
        </nav>
        {pres.length ? (
          <nav className="navgroup" aria-label="Apresentação">
            <div className="eyebrow">Apresentação</div>
            {pres.map(item)}
          </nav>
        ) : null}
        <div className="rail-foot">
          Protótipo de apresentação · 4Traders
          <br />
          Dados ilustrativos, não são números reais do grupo.
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="tenant">
            <b>Grupo FortSvig</b>
            <span>{role.subtitle}</span>
          </div>
          <div className="spacer" />
          <span className="chip demo">Dados ilustrativos</span>
          <div className="viewas">
            <label htmlFor="role">Ver como</label>
            <select
              id="role"
              value={role.id}
              onChange={(e) => {
                const id = e.target.value as RoleId;
                setRole(id);
                router.push(NAV[ROLES[id].home].path);
              }}
            >
              {ROLE_ORDER.map((id) => (
                <option key={id} value={id}>
                  {ROLES[id].option}
                </option>
              ))}
            </select>
          </div>
        </header>
        <main className="content" id="view">
          {children}
        </main>
      </div>
    </div>
  );
}
