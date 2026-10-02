"use client";

import type { MouseEvent } from "react";
import { clamp } from "@/lib/format";
import { hideTooltip, showTooltip } from "@/components/providers/tooltip-layer";
import type { CompanyColor } from "@/lib/types";

const W = 240;
const H = 52;
const PAD = 4;
const LAB = 34;

/** Linha de 14 dias com área, linha de referência em 90% e valor do último dia */
export function Sparkline({ values, color, name }: { values: number[]; color: CompanyColor; name: string }) {
  const min = Math.min(...values) - 2;
  const max = Math.max(...values) + 1;
  const x = (i: number) => PAD + (i * (W - PAD * 2 - LAB)) / (values.length - 1);
  const y = (v: number) => H - 6 - ((v - min) / (max - min)) * (H - 14);
  const pts = values.map((v, i) => [x(i), y(v)] as const);
  const line = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `M${pts[0][0]},${H - 3} L${line.split(" ").join(" L")} L${pts[pts.length - 1][0]},${H - 3} Z`;
  const last = pts[pts.length - 1];

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const sc = r.width / W;
    const i = clamp(Math.round(((e.clientX - r.left) / sc - PAD) / ((W - PAD * 2 - LAB) / (values.length - 1))), 0, values.length - 1);
    const d = new Date();
    d.setDate(d.getDate() - (values.length - 1 - i));
    showTooltip(`<b>${name}</b><br>${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} · ${values[i]}% de cumprimento`, e.clientX, e.clientY);
  };

  return (
    <svg
      className={`spark ${color}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Cumprimento dos últimos 14 dias da ${name}, hoje ${values[values.length - 1]}%`}
      data-chart=""
      onMouseMove={onMove}
      onMouseLeave={hideTooltip}
    >
      <line x1={PAD} x2={W - LAB} y1={y(90)} y2={y(90)} stroke="var(--line)" strokeDasharray="3 3" />
      <path d={area} fill="var(--cc)" fillOpacity={0.12} />
      <polyline points={line} fill="none" stroke="var(--cc)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={3.5} fill="var(--cc)" stroke="var(--surface)" strokeWidth={2} />
      <text x={last[0] + 7} y={last[1] + 4}>
        {values[values.length - 1]}%
      </text>
    </svg>
  );
}
