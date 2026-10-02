"use client";

import { useState, type MouseEvent } from "react";
import { hideTooltip, showTooltip } from "@/components/providers/tooltip-layer";
import { Kpi, List, PageHead, Panel } from "@/components/ui/primitives";
import { brl, clamp, mil } from "@/lib/format";

interface Inputs {
  n: number;
  atual: number;
  nova: number;
  impl: number;
  overlap: number;
  h: number;
}

const FIELDS: Array<[keyof Inputs, string, number]> = [
  ["n", "Condomínios atendidos", 1],
  ["atual", "Plataforma atual · R$ por condomínio/mês", 10],
  ["nova", "Nova plataforma · R$ por condomínio/mês", 10],
  ["impl", "Implantação · R$ (uma vez)", 1000],
  ["overlap", "Meses pagando as duas na migração", 1],
  ["h", "Horizonte · meses", 6],
];

/** Custo acumulado mês a mês. A implantação entra no mês 0; a plataforma atual segue durante a sobreposição. */
export function calcEconomy(e: Inputs) {
  const A = e.n * e.atual;
  const N = e.n * e.nova;
  const months = Array.from({ length: e.h + 1 }, (_, m) => ({ m, cur: A * m, nw: e.impl + N * m + A * Math.min(m, e.overlap) }));
  const exact = A - N > 0 ? (e.impl + A * e.overlap) / (A - N) : null;
  return { A, N, months, exact, save: A - N };
}

const W = 920;
const H = 300;
const L = 70;
const R = 150;
const T = 16;
const B = 34;

function niceStep(raw: number) {
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / p;
  return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * p;
}

function EconomyChart({ e }: { e: Inputs }) {
  const c = calcEconomy(e);
  const [hover, setHover] = useState<number | null>(null);
  const maxV = Math.max(...c.months.map((p) => Math.max(p.cur, p.nw)), 1) * 1.08;
  const x = (m: number) => L + (m * (W - L - R)) / e.h;
  const y = (v: number) => H - B - (v / maxV) * (H - B - T);
  const step = niceStep(maxV / 4);
  const ticks: number[] = [];
  for (let v = 0; v <= maxV; v += step) ticks.push(v);
  const path = (k: "cur" | "nw") => c.months.map((p, i) => `${i ? "L" : "M"}${x(p.m).toFixed(1)},${y(p[k]).toFixed(1)}`).join(" ");
  const last = c.months[c.months.length - 1];
  const xt: number[] = [];
  for (let m = 0; m <= e.h; m += e.h > 24 ? 12 : 6) xt.push(m);
  const ex = c.exact !== null && c.exact <= e.h ? c.exact : null;
  let ly1 = y(last.cur);
  let ly2 = y(last.nw);
  if (Math.abs(ly1 - ly2) < 16) {
    if (ly1 < ly2) ly2 = ly1 + 16;
    else ly1 = ly2 + 16;
  }

  const onMove = (ev: MouseEvent<SVGRectElement>) => {
    const svg = ev.currentTarget.ownerSVGElement;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = (ev.clientX - r.left) * (W / r.width);
    const m = clamp(Math.round(((px - L) / (W - L - R)) * e.h), 0, e.h);
    setHover(m);
    const p = c.months[m];
    showTooltip(`<b>${m === 0 ? "Início" : `Mês ${m}`}</b><br>Atual: ${brl(p.cur)}<br>Nova: ${brl(p.nw)}<br>Diferença: ${brl(p.cur - p.nw)}`, ev.clientX, ev.clientY);
  };

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" data-chart="" aria-label={`Custo acumulado em ${e.h} meses: plataforma atual ${mil(last.cur)}, nova plataforma ${mil(last.nw)}`}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray={v ? "2 4" : undefined} />
          <text x={L - 8} y={y(v) + 4} textAnchor="end">
            {v ? `${Math.round(v / 1000)} mil` : "0"}
          </text>
        </g>
      ))}
      {xt.map((m) => (
        <text key={m} x={x(m)} y={H - B + 18} textAnchor="middle">
          {m === 0 ? "início" : `mês ${m}`}
        </text>
      ))}
      {ex !== null ? (
        <>
          <line x1={x(ex)} x2={x(ex)} y1={T} y2={H - B} stroke="var(--ok)" strokeDasharray="4 3" />
          <text x={x(ex) + 6} y={T + 10} style={{ fill: "var(--ok)" }}>
            equilíbrio · mês {ex.toFixed(1).replace(".", ",")}
          </text>
        </>
      ) : null}
      <path d={path("cur")} fill="none" stroke="var(--chart-a)" strokeWidth={2} strokeLinejoin="round" />
      <path d={path("nw")} fill="none" stroke="var(--chart-b)" strokeWidth={2.4} strokeLinejoin="round" />
      <circle cx={x(last.m)} cy={y(last.cur)} r={4} fill="var(--chart-a)" stroke="var(--surface)" strokeWidth={2} />
      <circle cx={x(last.m)} cy={y(last.nw)} r={4} fill="var(--chart-b)" stroke="var(--surface)" strokeWidth={2} />
      <text className="lbl" x={x(last.m) + 10} y={ly1 + 4}>
        Atual {mil(last.cur)}
      </text>
      <text className="lbl" x={x(last.m) + 10} y={ly2 + 4}>
        Nova {mil(last.nw)}
      </text>
      {hover !== null ? <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="var(--ink-3)" opacity={0.6} /> : null}
      <rect
        x={L}
        y={T}
        width={W - L - R}
        height={H - B - T}
        fill="transparent"
        onMouseMove={onMove}
        onMouseLeave={() => {
          setHover(null);
          hideTooltip();
        }}
      />
    </svg>
  );
}

export function EconomiaView() {
  const [e, setE] = useState<Inputs>({ n: 18, atual: 900, nova: 450, impl: 60000, overlap: 1, h: 24 });
  const c = calcEconomy(e);
  const last = c.months[c.months.length - 1];
  const update = (k: keyof Inputs, raw: string) => {
    const v = Math.max(0, Number(raw) || 0);
    setE({ ...e, [k]: k === "h" ? clamp(v, 6, 60) : v });
  };

  return (
    <>
      <PageHead eyebrow="Quanto o grupo economiza" title="Economia">
        Valores de exemplo para a conversa. Ajuste os campos e o gráfico recalcula.
      </PageHead>
      <Panel>
        <div className="inputs">
          {FIELDS.map(([k, label, step]) => (
            <div key={k} className="field">
              <label htmlFor={`eco-${k}`}>{label}</label>
              <input id={`eco-${k}`} type="number" min={0} step={step} value={e[k]} onChange={(ev) => update(k, ev.target.value)} />
            </div>
          ))}
        </div>
      </Panel>
      <section className="grid kpis">
        <Kpi label="Hoje o grupo paga" value={<span className="num">{brl(c.A)}</span>} detail={`por mês · ${brl(c.A * 12)} por ano`} />
        <Kpi label="Com a nova plataforma" value={<span className="num">{brl(c.N)}</span>} detail="por mês" />
        <Kpi label="Economia mensal" value={<span className="num" style={{ color: c.save > 0 ? "var(--ok)" : "var(--crit)" }}>{brl(c.save)}</span>} detail={`${brl(c.save * 12)} por ano`} />
        <Kpi
          label="Implantação se paga em"
          value={c.exact !== null && c.save > 0 ? c.exact.toFixed(1).replace(".", ",") : "—"}
          unit=" meses"
          detail={`já contando ${e.overlap} ${e.overlap === 1 ? "mês" : "meses"} com as duas plataformas`}
        />
      </section>
      <Panel
        title={`Custo acumulado em ${e.h} meses`}
        aside={
          <div className="legend">
            <span><span className="swatch" style={{ ["--sw" as string]: "var(--chart-a)" }} />Plataforma atual</span>
            <span><span className="swatch" style={{ ["--sw" as string]: "var(--chart-b)" }} />Nova plataforma (com implantação)</span>
          </div>
        }
      >
        <div style={{ overflowX: "auto" }}>
          <EconomyChart e={e} />
        </div>
        <p className="small" style={{ marginTop: 8 }}>
          Em {e.h} meses: <b className="num">{brl(last.cur - last.nw)}</b> a menos no caixa do grupo{last.cur - last.nw < 0 ? " (negativo: revise os valores)" : ""}.
        </p>
      </Panel>
      <section className="grid cols-2e">
        <div className="panel">
          <h3>Ganhos que não entram nessa conta</h3>
          <List
            items={[
              <><b>Venda cruzada:</b> 34 serviços do grupo ainda não contratados nos condomínios atuais</>,
              <><b>Renovação:</b> síndico com relatório mensal comprovado troca menos de prestadora</>,
              <><b>Glosa:</b> em contratos públicos, cada falha comprovada ou contestada no prazo vira dinheiro recebido</>,
              <><b>Folha:</b> menos hora extra e falta sem cobertura</>,
              <><b>Fim do caderno:</b> encomenda e visitante com registro digital reduzem extravio, disputa com morador e retrabalho na portaria</>,
            ]}
          />
        </div>
        <div className="panel">
          <h3>O que o sistema passa a ser do grupo</h3>
          <List
            items={[
              "Feito para as quatro empresas, não adaptado de um app genérico",
              "Marca do grupo no portal do síndico e nos relatórios",
              "Evolução guiada pela operação do grupo",
              "Opção de participar da plataforma quando ela for oferecida a outras empresas do setor",
            ]}
          />
        </div>
      </section>
    </>
  );
}
