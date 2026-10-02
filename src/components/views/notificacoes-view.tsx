"use client";

import { useState } from "react";
import { useDemo } from "@/components/providers/demo-provider";
import { PageHead, Panel, ScopeNote } from "@/components/ui/primitives";
import { CD } from "@/lib/mock/condos";
import { NOTIFICATION_RULES, PRIORITIES, READ_STATS, SMART_RULES } from "@/lib/mock/notifications";
import { fmt } from "@/lib/format";
import { scopeCondos } from "@/lib/scope";
import type { Priority, Role } from "@/lib/types";

type Audience = "moradores" | "sindicos" | "colaboradores" | "supervisores" | "gerentes";
type When = "agora" | "agendar" | "ia";

function audienceOptions(role: Role): Array<[Audience, string]> {
  if (role.id === "sindico") return [["moradores", "Moradores do condomínio"]];
  if (role.id === "gerente") return [["colaboradores", "Colaboradores da Fortslimp"], ["supervisores", "Encarregados da Fortslimp"]];
  return [["moradores", "Moradores"], ["sindicos", "Síndicos"], ["colaboradores", "Colaboradores"], ["supervisores", "Supervisores"], ["gerentes", "Gerentes das empresas"]];
}

export function NotificacoesView() {
  const { role, queue, enqueue, toast } = useDemo();
  const isSindico = role.id === "sindico";
  const opts = audienceOptions(role);
  const condoOpts: Array<[string, string]> = isSindico ? [["c1", "Residencial Ipê Amarelo"]] : [["all", "Todos do escopo"], ...scopeCondos(role).map((c) => [c.id, c.name] as [string, string])];

  const [to, setTo] = useState<Audience>(opts[0][0]);
  const [where, setWhere] = useState<string>(isSindico ? "c1" : "c16");
  const [msg, setMsg] = useState("Manutenção da bomba de recalque amanhã, das 9h às 12h. Pode faltar água no bloco B.");
  const [ch, setCh] = useState({ push: true, wa: true, email: false, confirm: true });
  const [when, setWhen] = useState<When>("ia");
  const [rules, setRules] = useState<Record<string, boolean>>(Object.fromEntries(SMART_RULES.map((r) => [r.key, true])));

  const audience = opts.find((o) => o[0] === to) ? to : opts[0][0];
  const place = condoOpts.find((o) => o[0] === where) ? where : condoOpts[0][0];

  const reach = (() => {
    const sc = isSindico ? [CD.c1] : place === "all" ? scopeCondos(role) : [CD[place] ?? CD.c1];
    if (audience === "moradores") {
      const u = sc.reduce((a, c) => a + c.size, 0);
      return `${fmt(u)} unidades · cerca de ${fmt(Math.round(u * 1.6))} moradores`;
    }
    if (audience === "sindicos") return `${sc.length} síndico${sc.length > 1 ? "s" : ""}`;
    if (audience === "colaboradores") {
      const n = sc.reduce((a, c) => a + Object.entries(c.svc).filter(([id]) => !role.company || id === role.company).reduce((b, [, s]) => b + (s?.colab ?? 0), 0), 0);
      return `${fmt(n)} colaboradores`;
    }
    if (audience === "supervisores") return role.id === "gerente" ? "3 encarregados" : "6 supervisores";
    return "4 gerentes";
  })();

  const whenLabel = when === "agora" ? "agora" : when === "agendar" ? "amanhã 07:30" : "melhor horário de cada pessoa";

  const send = () => {
    const toLabel = opts.find((o) => o[0] === audience)?.[1] ?? "";
    const whereLabel = place === "all" ? "todos do escopo" : CD[place]?.name ?? "";
    const channels = [ch.push && "Push", ch.wa && "WhatsApp", ch.email && "E-mail"].filter(Boolean).join(" + ") || "Push";
    enqueue({
      title: msg.length > 60 ? `${msg.slice(0, 60)}…` : msg,
      audience: `${toLabel} · ${whereLabel}`,
      when: when === "agora" ? "enviando" : when === "agendar" ? "amanhã 07:30" : "melhor horário",
      channel: channels + (ch.confirm ? " · leitura confirmada" : ""),
    });
    toast(when === "agora" ? `Comunicado enviado para ${reach}.` : `Comunicado agendado para ${reach}.`);
  };

  return (
    <>
      {isSindico ? <ScopeNote>O síndico envia comunicados só para os moradores do próprio condomínio, por bloco ou unidade.</ScopeNote> : role.scope ? <ScopeNote>{role.scope}</ScopeNote> : null}
      <PageHead eyebrow="Push, WhatsApp, e-mail e ligação" title="Central de notificações">
        Cada público recebe só o que é dele: o morador vê a própria unidade, o síndico o próprio condomínio, o gerente a própria empresa. Prioridade define som, canal e insistência.
      </PageHead>

      <section className="prio">
        {(Object.keys(PRIORITIES) as Priority[]).map((k) => (
          <div key={k} style={{ ["--sev" as string]: PRIORITIES[k].color }}>
            <b>{PRIORITIES[k].label}</b>
            <span className="muted">{PRIORITIES[k].behavior}</span>
          </div>
        ))}
      </section>

      <Panel title="Novo comunicado" aside={<span className="small muted">alcance: <b>{reach}</b></span>}>
        <div className="composer">
          <div className="grid" style={{ gap: 12 }}>
            <div className="inputs">
              <div className="field">
                <label htmlFor="n-to">Para</label>
                <select id="n-to" value={audience} onChange={(e) => setTo(e.target.value as Audience)}>
                  {opts.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="n-where">Onde</label>
                <select id="n-where" value={place} onChange={(e) => setWhere(e.target.value)}>
                  {condoOpts.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="n-msg">Mensagem</label>
              <textarea id="n-msg" value={msg} onChange={(e) => setMsg(e.target.value)} />
            </div>
            <div className="field">
              <label>Canais</label>
              <div className="checks">
                {([["push", "Push no app"], ["wa", "WhatsApp"], ["email", "E-mail"], ["confirm", "Exigir confirmação de leitura"]] as const).map(([k, l]) => (
                  <label key={k}>
                    <input type="checkbox" id={`n-${k}`} checked={ch[k]} onChange={(e) => setCh({ ...ch, [k]: e.target.checked })} /> {l}
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Quando</label>
              <div className="seg">
                {([["agora", "Agora"], ["agendar", "Agendar"], ["ia", "Melhor horário (IA)"]] as const).map(([k, l]) => (
                  <button key={k} aria-pressed={when === k} onClick={() => setWhen(k)}>
                    {l}
                  </button>
                ))}
              </div>
              <span className="small muted">
                {when === "ia"
                  ? "A IA envia no horário em que cada pessoa costuma abrir as mensagens, dentro da janela que você definir."
                  : when === "agendar"
                    ? "Data e hora definidas por você; pode repetir toda semana ou todo mês."
                    : "Envio imediato."}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn primary" onClick={send}>
                {when === "agora" ? "Enviar agora" : "Agendar envio"}
              </button>
              <button className="btn" onClick={() => toast("No produto, a IA reescreve o texto em tom claro e curto, e você aprova antes de enviar.")}>
                Melhorar texto com IA
              </button>
            </div>
          </div>
          <div className="lock">
            <div className="clock">07:30</div>
            <div className="notif">
              <div className="nh">
                <span>{isSindico ? "Residencial Ipê Amarelo" : "Grupo FortSvig"} · Comunicado</span>
                <span>agora</span>
              </div>
              <b>{ch.confirm ? "Confirme a leitura" : "Aviso do condomínio"}</b>
              <span>{msg.length > 110 ? `${msg.slice(0, 110)}…` : msg}</span>
            </div>
            <div className="notif crit">
              <div className="nh">
                <span>Smart One · Crítico</span>
                <span>há 2 min</span>
              </div>
              <b>Posto descoberto · Vila Romana</b>
              <span>Portaria posto 2 sem check-in há 38 min</span>
            </div>
            <span style={{ color: "#9DAECB", fontSize: ".75rem", textAlign: "center" }}>Prévia na tela de bloqueio · envio: {whenLabel}</span>
          </div>
        </div>
      </Panel>

      <section className="grid cols-2e">
        <Panel title="Agendados" aside={`${queue.length} na fila`}>
          <div className="queue">
            {queue.map((q, i) => (
              <div key={i}>
                <div>
                  <b>{q.title}</b>
                  <br />
                  <span>
                    {q.audience} · {q.channel}
                  </span>
                </div>
                <span className="num">{q.when}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Inteligência">
          {SMART_RULES.map((r) => (
            <div key={r.key} className="rule-row">
              <div>
                <b>{r.label}</b>
                <span>{r.detail}</span>
              </div>
              <button className="sw" role="switch" aria-checked={rules[r.key]} aria-label={r.label} onClick={() => setRules({ ...rules, [r.key]: !rules[r.key] })} />
            </div>
          ))}
        </Panel>
      </section>

      {!isSindico ? (
        <section>
          <div className="panel-h">
            <h2>Quem recebe o quê</h2>
            <div className="legend">
              {(Object.keys(PRIORITIES) as Priority[]).map((k) => (
                <span key={k} className={`pill ${PRIORITIES[k].pill}`}>
                  {PRIORITIES[k].label}
                </span>
              ))}
            </div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Quem recebe</th>
                  <th>Canal</th>
                  <th>Prioridade</th>
                  <th>Regra</th>
                </tr>
              </thead>
              <tbody>
                {NOTIFICATION_RULES.map((r) => (
                  <tr key={r.event}>
                    <td><b>{r.event}</b></td>
                    <td>{r.audience}</td>
                    <td className="small">{r.channel}</td>
                    <td><span className={`pill ${PRIORITIES[r.priority].pill}`}>{PRIORITIES[r.priority].label}</span></td>
                    <td className="small muted">{r.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <Panel title="Leitura do último comunicado" aside="Relatório de setembro · 18 síndicos">
        <div className="bars">
          {READ_STATS.map(([l, v]) => (
            <div key={l} className="bar">
              <span>{l}</span>
              <div className="track">
                <i style={{ width: `${v}%` }} />
              </div>
              <b>{v}%</b>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
