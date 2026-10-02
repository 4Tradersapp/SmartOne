"use client";

import { useState } from "react";
import { useDemo } from "@/components/providers/demo-provider";
import { Dot, PageHead, ScopeNote } from "@/components/ui/primitives";
import { CO } from "@/lib/mock/companies";
import { CD } from "@/lib/mock/condos";
import { ESCALATION_CHAIN, SEV, SEV_ORDER } from "@/lib/mock/operations";
import { clamp, cx, fmtMin } from "@/lib/format";
import { scopeAlerts } from "@/lib/scope";
import type { Alert } from "@/lib/types";

type Filter = "todos" | "criticos" | "abertos" | "assumidos";

export function AlertasView() {
  const { role, alerts, acceptAlert, escalateAlert, closeAlert } = useDemo();
  const [filter, setFilter] = useState<Filter>("todos");
  const list = scopeAlerts(role, alerts);
  const shown = list
    .filter(
      (a) =>
        filter === "todos" ||
        (filter === "criticos" && (a.sev === "crit" || a.sev === "high")) ||
        (filter === "abertos" && a.status === "novo") ||
        (filter === "assumidos" && (a.status === "assumido" || a.status === "escalado")),
    )
    .sort((a, b) => SEV_ORDER.indexOf(a.sev) - SEV_ORDER.indexOf(b.sev));

  const btn = (k: Filter, label: string) => (
    <button key={k} className="fbtn" aria-pressed={filter === k} onClick={() => setFilter(k)}>
      {label}
    </button>
  );

  return (
    <>
      {role.scope ? <ScopeNote>{role.scope}</ScopeNote> : null}
      <PageHead eyebrow="Resposta a desvios" title="Central de alertas">
        Cada alerta tem dono, prazo e trilha. Sem aceite no prazo, o sistema sobe um degrau: push → supervisor → WhatsApp → ligação automática → coordenador.
      </PageHead>
      <div className="filters">
        {btn("todos", `Todos (${list.length})`)}
        {btn("criticos", "Crítico e alto")}
        {btn("abertos", "Aguardando aceite")}
        {btn("assumidos", "Assumidos")}
      </div>
      <section className="alerts">
        {shown.length ? (
          shown.map((a) => <AlertCard key={a.id} a={a} onAccept={acceptAlert} onEscalate={escalateAlert} onClose={closeAlert} />)
        ) : (
          <p className="muted">Nenhum alerta neste filtro.</p>
        )}
      </section>
    </>
  );
}

function AlertCard({ a, onAccept, onEscalate, onClose }: { a: Alert; onAccept: (id: number) => void; onEscalate: (id: number) => void; onClose: (id: number) => void }) {
  const s = SEV[a.sev];
  const ratio = clamp(a.openMin / a.slaMin, 0, 1);
  const over = a.openMin > a.slaMin;
  const statusPill =
    a.status === "novo" ? (
      <span className="pill s-crit">Aguardando aceite</span>
    ) : a.status === "assumido" ? (
      <span className="pill s-info">Assumido · {a.who || "você"}</span>
    ) : a.status === "escalado" ? (
      <span className="pill s-warn">Escalonado · {a.who}</span>
    ) : (
      <span className="pill s-ok">✓ Encerrado com evidência</span>
    );
  return (
    <article className={`al ${s.cls}`}>
      <div className="stripe" />
      <div className="body">
        <span className="meta">
          <span className={`pill ${s.pill}`}>{s.label}</span>
          {statusPill}
        </span>
        <span className="t">
          {a.title} · {CD[a.condo].name}
        </span>
        <span className="meta">
          <span>
            <Dot color={CO[a.company].color} /> {CO[a.company].name}
          </span>
          <span>{a.detail}</span>
        </span>
        <span className="meta">
          <span className="num">
            Aberto há {fmtMin(a.openMin)} · prazo de resposta {fmtMin(a.slaMin)}
          </span>
          {over && a.status !== "encerrado" ? <b style={{ color: "var(--crit)" }}>prazo estourado</b> : null}
        </span>
        <div className="sla" aria-hidden="true">
          <i style={{ width: `${(ratio * 100).toFixed(0)}%` }} />
        </div>
        <div className="chain">
          {ESCALATION_CHAIN.map((x, i) => (
            <span key={x} style={{ display: "contents" }}>
              <span className={cx(i + 1 < a.step && "done", i + 1 === a.step && "now")}>{x}</span>
              {i < ESCALATION_CHAIN.length - 1 ? <em>→</em> : null}
            </span>
          ))}
        </div>
      </div>
      <div className="acts">
        {a.status !== "encerrado" ? (
          <>
            {a.status === "novo" ? (
              <button className="btn primary" onClick={() => onAccept(a.id)}>
                Assumir
              </button>
            ) : null}
            <button className="btn" onClick={() => onEscalate(a.id)}>
              Escalonar
            </button>
            <button className="btn" onClick={() => onClose(a.id)}>
              Encerrar com evidência
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
