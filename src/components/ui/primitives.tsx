import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/format";
import type { PostoStatus } from "@/lib/types";

export function PageHead({ eyebrow, title, children, aside }: { eyebrow: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="pagehead">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>
      {aside ?? (children ? <p className="muted small">{children}</p> : null)}
    </div>
  );
}

export function ScopeNote({ label = "Escopo do perfil", children }: { label?: string; children: ReactNode }) {
  return (
    <div className="scope">
      <b style={{ whiteSpace: "nowrap" }}>{label}</b>
      <span>{children}</span>
    </div>
  );
}

export function Kpi({ label, value, unit, detail, alert }: { label: string; value: ReactNode; unit?: string; detail?: ReactNode; alert?: boolean }) {
  return (
    <div className={cx("kpi", alert && "alert")}>
      <span className="eyebrow">{label}</span>
      <span className="v">
        {value}
        {unit ? <small>{unit}</small> : null}
      </span>
      {detail ? <span className="d">{detail}</span> : null}
    </div>
  );
}

export function Panel({ title, aside, children, className, style }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section className={cx("panel", className)} style={style}>
      {title || aside ? (
        <div className="panel-h">
          {typeof title === "string" ? <h2>{title}</h2> : title}
          {typeof aside === "string" ? <span className="small muted">{aside}</span> : aside}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Pill({ tone, children }: { tone: "ok" | "warn" | "crit" | "idle" | "info"; children: ReactNode }) {
  return <span className={`pill s-${tone}`}>{children}</span>;
}

export const STATUS_ICON: Record<PostoStatus, string> = { ok: "✓", warn: "!", crit: "✕", idle: "–" };
export const STATUS_LABEL: Record<PostoStatus, string> = { ok: "coberto", warn: "sem sinal", crit: "descoberto", idle: "fora de turno" };

export function StatusPill({ status, warnLabel = "Sem sinal" }: { status: PostoStatus; warnLabel?: string }) {
  const map: Record<PostoStatus, [string, string]> = {
    ok: ["s-ok", "✓ Coberto"],
    warn: ["s-warn", `! ${warnLabel}`],
    crit: ["s-crit", "✕ Descoberto"],
    idle: ["s-idle", "– Fora de turno"],
  };
  return <span className={`pill ${map[status][0]}`}>{map[status][1]}</span>;
}

export function Dot({ color }: { color: string }) {
  return <span className={`dot ${color}`} />;
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}

export function Plate({ children }: { children: string }) {
  return <span className="plate">{children}</span>;
}

export function Steps({ steps, active, waiting }: { steps: Array<[string, string]>; active?: number; waiting?: number }) {
  return (
    <div className="steps">
      {steps.map(([t, d], i) => {
        const on = active === undefined || i < active;
        return (
          <div key={t} className={cx("step", on && "on", waiting === i && "wait")}>
            <i>{i + 1}</i>
            <div>
              {t}
              <small>{d}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Avatar({ initials, size }: { initials: string; size?: number }) {
  return (
    <span className="avatar" style={size ? { width: size, height: size, fontSize: size / 3.2 } : undefined}>
      {initials}
    </span>
  );
}
