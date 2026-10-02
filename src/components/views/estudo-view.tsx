"use client";

import { useState } from "react";
import { List, PageHead, Panel } from "@/components/ui/primitives";
import { CO, COMPANIES } from "@/lib/mock/companies";
import { CONDOS } from "@/lib/mock/condos";
import { STUDY } from "@/lib/mock/presentation";
import type { CompanyId } from "@/lib/types";

export function EstudoView() {
  const [tab, setTab] = useState<CompanyId>("infraseg");
  const co = CO[tab];
  const s = STUDY[tab];
  const cs = CONDOS.filter((c) => c.svc[tab]);
  const postos = cs.reduce((a, c) => a + (c.svc[tab]?.postos ?? 0), 0);
  const colab = cs.reduce((a, c) => a + (c.svc[tab]?.colab ?? 0), 0);
  const ipo = Math.round(cs.reduce((a, c) => a + (c.svc[tab]?.ipo ?? 0), 0) / cs.length);

  return (
    <>
      <PageHead eyebrow="Estudo individual" title="As quatro empresas do grupo">
        Montado a partir do projeto Smart One, do site do grupo e das normas de cada serviço. O que está marcado para confirmar fecha na reunião.
      </PageHead>
      <div className="tabs" role="tablist">
        {COMPANIES.map((c) => (
          <button key={c.id} className={`tab ${c.color}`} role="tab" aria-selected={c.id === tab} onClick={() => setTab(c.id)}>
            <span className="dot" />
            <div>
              <b>{c.name}</b>
              <span>{c.tag}</span>
            </div>
          </button>
        ))}
      </div>
      <section className={`panel ${co.color}`} style={{ borderTop: "3px solid var(--cc)" }}>
        <div className="panel-h">
          <div>
            <h2>{co.name}</h2>
            <span className="muted">{co.tag}</span>
          </div>
          <div className="factrow">
            <div><b>{cs.length}</b><span>condomínios</span></div>
            <div><b>{postos}</b><span>postos</span></div>
            <div><b>{colab}</b><span>colaboradores</span></div>
            <div><b>{ipo}%</b><span>IPO médio</span></div>
          </div>
        </div>
        <div className="tagline">
          {s.lines.map((l) => (
            <span key={l} className="chip">
              {l}
            </span>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 8 }}>
          Números ilustrativos do protótipo. Na versão real, vêm do cadastro.
        </p>
      </section>
      <section className="study">
        <div className="panel"><h3>Funções em campo</h3><List items={s.roles} /></div>
        <div className="panel"><h3>Rotinas que viram checklist</h3><List items={s.routine} /></div>
        <div className="panel"><h3>Normas e documentos que o sistema controla</h3><List items={s.rules} /></div>
        <div className="panel"><h3>Indicadores no painel</h3><List items={s.kpis} /></div>
        <div className="panel"><h3>Dores que o sistema resolve</h3><List items={s.pains} /></div>
        <div className="panel"><h3>Módulos da plataforma</h3><List items={s.modules} /></div>
        <div className="panel ask"><h3>Confirmar na reunião</h3><List items={s.ask} /></div>
      </section>
      <Panel title="O que só o grupo tem">
        <p style={{ maxWidth: "80ch" }}>
          Em 5 dos 18 condomínios, três ou mais empresas do grupo trabalham no mesmo prédio. Hoje cada serviço presta contas separado. Com uma plataforma única, o síndico recebe um portal e um relatório com portaria, limpeza, brigada e manutenção juntos, e o grupo enxerga onde oferecer o serviço que falta.
        </p>
      </Panel>
    </>
  );
}
