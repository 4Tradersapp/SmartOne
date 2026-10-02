"use client";

import type { ReactNode } from "react";
import { useDemo } from "@/components/providers/demo-provider";
import { Kpi, PageHead, Panel, ScopeNote } from "@/components/ui/primitives";
import { POSTOS } from "@/lib/mock/condos";

const MODULES: Array<[string, string]> = [
  ["Cobertura de postos", "Ativo"],
  ["Ronda NFC", "Ativo"],
  ["Ocorrências e alertas", "Ativo"],
  ["Central de notificações", "Ativo"],
  ["Portal do síndico", "Ativo"],
  ["Encomendas com retirada digital", "Ativo"],
  ["App do morador", "Ativo"],
  ["Controle de acesso: placa e facial", "Fase 2"],
  ["Manutenção e ativos", "Fase 2"],
  ["Glosa / IMR", "Fase 2"],
  ["IA de previsão de faltas", "Fase 3"],
];

const HEALTH: Array<[string, ReactNode]> = [
  ["Versão do app em campo", <span key="v" className="num muted">1.4.2 em 92% · 1.4.1 em 8%</span>],
  ["Última cópia de segurança", <span key="b" className="num muted">hoje 03:00 · região São Paulo</span>],
  ["Fotos e evidências armazenadas", <span key="f" className="num muted">38 GB</span>],
  ["Acesso do suporte ao grupo", <span key="a" className="num muted">chamado #112 · autorizado pela diretoria</span>],
  ["Isolamento entre contas", <span key="i" className="pill s-ok">✓ testes automáticos</span>],
];

export function MasterView() {
  const { role } = useDemo();
  return (
    <>
      {role.scope ? <ScopeNote>{role.scope}</ScopeNote> : null}
      <PageHead eyebrow="4Traders" title="Master da plataforma">
        Onde a plataforma é operada: contas de clientes, módulos contratados, consumo e saúde dos aparelhos em campo.
      </PageHead>
      <section className="grid kpis">
        <Kpi label="Contas ativas" value={1} detail="Grupo FortSvig · 4 empresas" />
        <Kpi label="Locais" value={18} detail={`${POSTOS.length} postos cadastrados`} />
        <Kpi label="Entrega de push · 24h" value="99,2" unit="%" detail="aceite medido dentro do app" />
        <Kpi label="Aparelhos com fila" value={3} detail="aguardando sinal para sincronizar" />
        <Kpi label="WhatsApp no mês" value="4.812" detail="franquia do plano: 6.000" />
      </section>
      <section className="grid cols-2e">
        <Panel title="Módulos · Grupo FortSvig">
          <div className="docs">
            {MODULES.map(([m, s]) => (
              <div key={m}>
                <span>{m}</span>
                {s === "Ativo" ? <span className="pill s-ok">✓ Ativo</span> : <span className="pill s-idle">{s}</span>}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Saúde e auditoria">
          <div className="docs">
            {HEALTH.map(([l, v]) => (
              <div key={l}>
                <span>{l}</span>
                {v}
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  );
}
