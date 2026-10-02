"use client";

import { useDemo } from "@/components/providers/demo-provider";
import { Dot, Panel, ScopeNote, StatusPill } from "@/components/ui/primitives";
import { CO } from "@/lib/mock/companies";
import { CD } from "@/lib/mock/condos";
import type { CompanyId, Service } from "@/lib/types";

const TIMELINE: Array<[string, string, string]> = [
  ["06:58", "c1", "Passagem de turno da portaria registrada · chaves e rádio conferidos"],
  ["07:30", "c3", "Inspeção diária da brigada: 24 extintores, 6 hidrantes, central de alarme"],
  ["09:12", "c2", "Hall e elevadores limpos · 4 fotos antes/depois"],
  ["10:40", "c4", "Chamado aberto: portão da garagem lento · técnico agendado 14:00"],
  ["11:05", "c1", "12 encomendas recebidas · moradores avisados por WhatsApp"],
  ["14:02", "c1", "Ronda perimetral concluída · 8 de 8 pontos NFC"],
];

export function PortalView() {
  const { role, toast } = useDemo();
  const c = CD.c1;
  const preview = role.id !== "sindico";
  const line = (id: CompanyId, s: Service) =>
    ({
      infraseg: `Portaria: ${s.postos} postos cobertos · rondas 7/8 · 3 encomendas aguardando`,
      fortslimp: `Limpeza: ${s.done} de ${s.tasks} tarefas do roteiro · próxima: garagem às 16:00`,
      fortsbravo: "Brigada: inspeção diária concluída · extintores e hidrantes em dia",
      fortservice: "Manutenção: 1 chamado aberto (portão da garagem) · 2 preventivas no mês",
    })[id];

  return (
    <>
      {preview ? (
        <ScopeNote label="Prévia">É isto que o síndico vê no celular ou no computador, com a marca do grupo. Um portal para todos os serviços que o grupo presta no condomínio.</ScopeNote>
      ) : null}
      <div className="portal-h">
        <div>
          <span>Portal do cliente · Grupo FortSvig</span>
          <h2>{c.name}</h2>
          <span>Síndico: Antônio Mendes · 240 unidades · 4 serviços contratados com o grupo</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="big" style={{ color: "#fff" }}>
            96%
          </div>
          <span>Índice de performance de setembro</span>
        </div>
      </div>
      <section className="grid cols-2">
        <Panel title="Hoje no seu condomínio" aside="atualizado agora">
          {(Object.entries(c.svc) as Array<[CompanyId, Service]>).map(([id, s]) => (
            <div key={id} className="svc-row">
              <div>
                <Dot color={CO[id].color} /> <b>{CO[id].name}</b> <span className="small muted">· {CO[id].short}</span>
                <br />
                <span className="small">{line(id, s)}</span>
              </div>
              <StatusPill status={id === "fortservice" ? "warn" : "ok"} warnLabel="Em atendimento" />
            </div>
          ))}
        </Panel>
        <Panel title="Linha do tempo">
          <div className="tl">
            {TIMELINE.map(([t, color, text]) => (
              <div key={t}>
                <time>{t}</time>
                <i className={color} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>
      <section className="grid cols-2e">
        <Panel title="Documentos e prazos">
          <div className="docs">
            <div>
              <span>Relatório mensal · setembro/2026</span>
              <span className="pill s-ok">Disponível</span>
            </div>
            <div>
              <span>AVCB do condomínio</span>
              <span className="num muted">válido até 03/2027</span>
            </div>
            <div>
              <span>Atestado de brigada (IT 17)</span>
              <span className="num muted">renovar até 11/2026</span>
            </div>
            <div>
              <span>Limpeza da caixa d’água</span>
              <span className="num muted">próxima 12/2026</span>
            </div>
          </div>
        </Panel>
        <Panel title="Ações">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button className="btn primary" onClick={() => toast("No produto, o chamado vai direto para a empresa certa do grupo, com prazo e resposta registrados.")}>
              Abrir chamado
            </button>
            <button className="btn" onClick={() => toast("No produto, o PDF sai assinado, com QR de verificação de autenticidade.")}>
              Baixar relatório do mês
            </button>
            <button className="btn" onClick={() => toast("No produto, o síndico aprova orçamentos e ordens de serviço por aqui.")}>
              Aprovações pendentes (1)
            </button>
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            Moradores não precisam instalar nada: recebem aviso de encomenda e comunicados pelo WhatsApp, com link para retirada.
          </p>
        </Panel>
      </section>
    </>
  );
}
