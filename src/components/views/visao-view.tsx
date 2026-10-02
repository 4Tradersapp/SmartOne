"use client";

import Link from "next/link";
import { useDemo } from "@/components/providers/demo-provider";
import { Dot, Kpi, PageHead, Panel, ScopeNote, STATUS_ICON, STATUS_LABEL } from "@/components/ui/primitives";
import { Sparkline } from "@/components/ui/sparkline";
import { CO } from "@/lib/mock/companies";
import { activeContracts, TREND, totalCombos } from "@/lib/mock/condos";
import { SEV, SEV_ORDER } from "@/lib/mock/operations";
import { cx, fmt, fmtMin, pct, shortCondoName } from "@/lib/format";
import { portariaCondos, postoStatus, scopeAlerts, scopeCompanies, scopeCondos, scopePostos, services } from "@/lib/scope";
import type { Alert, Role } from "@/lib/types";

export function VisaoView() {
  const { role, alerts, isDay, now, queue, c1Packages } = useDemo();
  const condos = scopeCondos(role);
  const companies = scopeCompanies(role);
  const postos = scopePostos(role).map((p) => ({ ...p, status: postoStatus(p, isDay) }));
  const open = scopeAlerts(role, alerts).filter((a) => a.status !== "encerrado");

  let tasks = 0;
  let done = 0;
  let missed = 0;
  let colab = 0;
  let contracts = 0;
  for (const c of condos)
    for (const [, s] of services(role, c)) {
      tasks += s.tasks;
      done += s.done;
      missed += s.missed;
      colab += s.colab;
      contracts++;
    }
  const active = postos.filter((p) => p.status !== "idle");
  const covered = active.filter((p) => p.status === "ok").length;
  const crit = open.filter((a) => a.sev === "crit").length;
  const title = role.id === "diretor" ? "Visão do grupo" : role.id === "gerente" ? "Visão da Fortslimp" : "Sua rota hoje";
  const when = now
    ? `${now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" })} · ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    : "Hoje";

  const low = condos.flatMap((c) => services(role, c).map(([id, s]) => ({ c, id, s }))).sort((a, b) => a.s.ipo - b.s.ipo);
  const showPortaria = role.id === "diretor" || role.id === "supervisor";

  return (
    <>
      {role.scope ? <ScopeNote>{role.scope}</ScopeNote> : null}
      <PageHead eyebrow={when} title={title}>
        Tudo o que {companies.length > 1 ? "as quatro empresas entregam" : "as equipes entregam"} hoje, num só lugar. Passe o mouse nos postos e nas linhas para ver detalhes.
      </PageHead>

      <section className="grid kpis" aria-label="Indicadores">
        <Kpi
          label="Postos agora"
          value={covered}
          unit={`/${active.length}`}
          detail={
            <>
              {active.length - covered ? <b style={{ color: "var(--crit)" }}>{active.length - covered} com problema</b> : "todos cobertos"} · {postos.length - active.length} fora de turno
            </>
          }
        />
        <Kpi
          label="Cumprimento do dia"
          value={pct(done, tasks)}
          unit="%"
          detail={
            <>
              <span className="num">{fmt(done)}</span> de <span className="num">{fmt(tasks)}</span> tarefas · <span className="num">{missed}</span> não realizadas
            </>
          }
        />
        <Kpi label="Alertas abertos" value={open.length} alert={crit > 0} detail={`${crit} crítico${crit === 1 ? "" : "s"} · prazo de resposta em contagem`} />
        <Kpi label="Equipe em escala" value={fmt(colab)} detail={`colaboradores em ${contracts} contratos ativos`} />
        {role.id === "diretor" ? (
          <Kpi label="Venda cruzada" value={totalCombos - activeContracts} detail="serviços do grupo ainda não contratados nos 18 condomínios" />
        ) : (
          <Kpi label="Condomínios no escopo" value={condos.length} detail={role.company ? CO[role.company].name : ""} />
        )}
      </section>

      <section className={cx("grid companies", companies.length === 1 && "single")} aria-label="Empresas">
        {companies.map((co) => {
          const cs = condos.filter((c) => c.svc[co.id]);
          const p = cs.reduce((a, c) => a + (c.svc[co.id]?.postos ?? 0), 0);
          const a = open.filter((x) => x.company === co.id).length;
          return (
            <article key={co.id} className={`co ${co.color}`}>
              <div className="co-h">
                <span className="dot" />
                <div>
                  <b>{co.name}</b>
                  <br />
                  <span>{co.tag}</span>
                </div>
              </div>
              <div className="co-stats">
                <div>
                  <b>{cs.length}</b>
                  <span>condomínios</span>
                </div>
                <div>
                  <b>{p}</b>
                  <span>postos</span>
                </div>
                <div>
                  <b style={a ? { color: "var(--crit)" } : undefined}>{a}</b>
                  <span>alertas</span>
                </div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 2 }}>
                  Cumprimento · 14 dias
                </div>
                <Sparkline values={TREND[co.id]} color={co.color} name={co.name} />
              </div>
            </article>
          );
        })}
      </section>

      {showPortaria ? <PortariaHoje role={role} queueSize={queue.length} c1={c1Packages} /> : null}

      <section className="grid cols-2">
        <Panel
          title="Postos agora"
          aside={
            <div className="legend">
              <span><span className="pill s-ok">✓</span>Coberto</span>
              <span><span className="pill s-warn">!</span>Sem sinal</span>
              <span><span className="pill s-crit">✕</span>Descoberto</span>
              <span><span className="pill s-idle">–</span>Fora de turno</span>
            </div>
          }
        >
          <div className="board">
            {condos.map((c) => (
              <div key={c.id} className="brow">
                <span className="n" title={c.name}>
                  {shortCondoName(c.name)}
                </span>
                <span className="pps">
                  {postos
                    .filter((p) => p.condo === c.id)
                    .map((p) => (
                      <span key={`${p.company}${p.idx}`} className={`pp s-${p.status}`} data-tip={`${CO[p.company].name} · ${p.desc} · posto ${p.idx} · ${STATUS_LABEL[p.status]}`}>
                        <span className={`dot ${CO[p.company].color}`} />
                        {STATUS_ICON[p.status]}
                      </span>
                    ))}
                </span>
              </div>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: 10 }}>
            Cor do ponto = empresa. O app do posto envia sinal a cada 5 minutos; sem sinal por 15 minutos vira alerta automático.
          </p>
        </Panel>
        <Panel title="Alertas abertos" aside={<Link className="btn" href="/alertas">Abrir central</Link>}>
          <div className="alerts">
            {[...open]
              .sort((a, b) => SEV_ORDER.indexOf(a.sev) - SEV_ORDER.indexOf(b.sev))
              .slice(0, 4)
              .map((a) => (
                <MiniAlert key={a.id} a={a} condoName={condos.find((c) => c.id === a.condo)?.name ?? ""} />
              ))}
          </div>
        </Panel>
      </section>

      <Panel title="Onde olhar primeiro" aside="Menor índice de performance operacional (IPO) do mês">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Condomínio</th>
                <th>Empresa</th>
                <th>Serviço</th>
                <th className="c">IPO</th>
                <th className="c">Tarefas hoje</th>
                <th className="c">Não realizadas</th>
              </tr>
            </thead>
            <tbody>
              {low.slice(0, 6).map(({ c, id, s }) => (
                <tr key={c.id + id}>
                  <td>{c.name}</td>
                  <td>
                    <Dot color={CO[id].color} /> {CO[id].name}
                  </td>
                  <td className="muted">{s.desc}</td>
                  <td className={cx("c num", s.ipo < 85 && "ipo-low")}>{s.ipo}%</td>
                  <td className="c num">
                    {s.done}/{s.tasks}
                  </td>
                  <td className="c num">{s.missed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );

}

function PortariaHoje({ role, queueSize, c1 }: { role: Role; queueSize: number; c1: { recv: number; wait: number } }) {
  const cs = portariaCondos(role);
  const sum = (k: "recv" | "wait") => cs.reduce((a, c) => a + (c.id === "c1" ? c1[k] : c.pk[k]), 0);
  const visit = cs.reduce((a, c) => a + c.acc.visit, 0);
  const auto = Math.round(cs.reduce((a, c) => a + c.acc.auto, 0) / cs.length);
  return (
    <Panel title="Portaria hoje" aside="encomendas, acessos e comunicados">
      <div className="mini-kpis">
        <Link href="/encomendas"><b>{sum("recv")}</b><span>encomendas recebidas</span></Link>
        <Link href="/encomendas"><b>{sum("wait")}</b><span>aguardando retirada</span></Link>
        <Link href="/acesso"><b>{visit}</b><span>visitantes no condomínio agora</span></Link>
        <Link href="/acesso"><b>{auto}%</b><span>entradas sem o porteiro digitar</span></Link>
        {role.nav.includes("notificacoes") ? <Link href="/notificacoes"><b>{queueSize}</b><span>comunicados agendados</span></Link> : null}
      </div>
    </Panel>
  );
}

function MiniAlert({ a, condoName }: { a: Alert; condoName: string }) {
  const s = SEV[a.sev];
  return (
    <div className={`al ${s.cls}`}>
      <div className="stripe" />
      <div className="body">
        <span className="t">{a.title}</span>
        <span className="meta">
          <span className={`pill ${s.pill}`}>{s.label}</span>
          <span>{condoName}</span>
          <span style={{ whiteSpace: "nowrap" }}>
            <Dot color={CO[a.company].color} /> {CO[a.company].name}
          </span>
          <span>há {fmtMin(a.openMin)}</span>
        </span>
      </div>
      <div />
    </div>
  );
}
