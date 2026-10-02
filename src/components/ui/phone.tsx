import type { ReactNode } from "react";
import { rng } from "@/lib/format";

/** Moldura de celular para prévias dos apps (o app real será React Native/Expo) */
export function Phone({ title, subtitle, active, tabs = ["Início", "Tarefas", "Ronda", "Mais"], caption, children }: {
  title: string;
  subtitle: string;
  active: string;
  tabs?: string[];
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="phone-wrap">
      <div className="phone">
        <div className="screen">
          <div className="sbar">
            <span>21:40</span>
            <span>4G ▮▮▯</span>
          </div>
          <div className="apphead">
            <b>{title}</b>
            <span>{subtitle}</span>
          </div>
          <div className="abody">{children}</div>
          <div className="tabbar">{tabs.map((t) => (t === active ? <b key={t}>{t}</b> : <span key={t}>{t}</span>))}</div>
        </div>
      </div>
      <span className="small muted">{caption}</span>
    </div>
  );
}

/** QR ilustrativo (decorativo). No produto, gerado por biblioteca a partir do token de retirada. */
export function FakeQr() {
  const r = rng(42);
  const n = 21;
  const s = 6;
  const cells: ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!inFinder && r() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x * s} y={y * s} width={s} height={s} fill="#0E1B33" />);
    }
  const finder = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x * s} y={y * s} width={7 * s} height={7 * s} fill="#0E1B33" />
      <rect x={(x + 1) * s} y={(y + 1) * s} width={5 * s} height={5 * s} fill="#fff" />
      <rect x={(x + 2) * s} y={(y + 2) * s} width={3 * s} height={3 * s} fill="#0E1B33" />
    </g>
  );
  return (
    <svg className="qr" viewBox={`0 0 ${n * s} ${n * s}`} role="img" aria-label="QR de retirada ilustrativo">
      {cells}
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
    </svg>
  );
}
