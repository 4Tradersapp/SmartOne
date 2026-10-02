"use client";

import { useEffect, useRef, useState } from "react";
import { useDemo } from "@/components/providers/demo-provider";
import { Kpi, List, PageHead, Panel, ScopeNote, Steps } from "@/components/ui/primitives";
import { CARRIERS } from "@/lib/mock/operations";
import { cx, fmtMin } from "@/lib/format";
import { portariaCondos } from "@/lib/scope";
import type { Package } from "@/lib/types";

const RECEIVE_STEPS: Array<[string, string]> = [
  ["Foto do volume", "tirada pelo tablet da portaria"],
  ["Código lido", "código de barras ou QR da etiqueta"],
  ["Etiqueta lida (OCR)", "nome e apartamento"],
  ["Morador encontrado", "cruza com o cadastro e com o pré-aviso"],
  ["Posição definida", "prateleira e etiqueta interna com QR"],
  ["Morador avisado", "push e WhatsApp com a foto e o QR de retirada"],
];

function StatusCell({ p }: { p: Package }) {
  switch (p.status) {
    case "aguardando":
      return p.minutes !== null && p.minutes > 2880 ? (
        <span className="pill s-crit">Mais de 48h</span>
      ) : p.minutes !== null && p.minutes > 1440 ? (
        <span className="pill s-warn">Mais de 24h</span>
      ) : (
        <span className="pill s-warn">Aguardando retirada</span>
      );
    case "urgente":
      return <span className="pill s-crit">Comida · morador descendo</span>;
    case "registrada":
      return <span className="pill s-info">Registrada · só o destinatário</span>;
    case "retirada":
      return <span className="pill s-ok">✓ Retirada · {p.by}</span>;
    case "previsto":
      return <span className="pill s-info">Pré-aviso · {p.track}</span>;
  }
}

export function EncomendasView() {
  const { role, packages, receivePackage, deliverPackage, c1Packages } = useDemo();
  const condos = portariaCondos(role);
  const one = condos.length === 1;
  const val = (c: (typeof condos)[number], k: "recv" | "wait") => (c.id === "c1" ? c1Packages[k] : c.pk[k]);
  const sum = (k: "recv" | "wait") => condos.reduce((a, c) => a + val(c, k), 0);
  const over = condos.reduce((a, c) => a + c.pk.over, 0);
  const avg = (condos.reduce((a, c) => a + c.pk.avgH, 0) / condos.length).toFixed(1).replace(".", ",");

  // Animação do recebimento: acende um passo por vez e registra no fim
  const [stepOn, setStepOn] = useState<number>(RECEIVE_STEPS.length);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const simulate = () => {
    timers.current.forEach(clearTimeout);
    setStepOn(0);
    RECEIVE_STEPS.forEach((_, i) => timers.current.push(setTimeout(() => setStepOn(i + 1), 250 + i * 380)));
    timers.current.push(setTimeout(receivePackage, 250 + RECEIVE_STEPS.length * 380 + 150));
  };

  return (
    <>
      {role.id !== "diretor" && role.scope ? <ScopeNote>{role.scope}</ScopeNote> : null}
      <PageHead eyebrow="Fim do caderno" title="Encomendas">
        Do recebimento à retirada com prova digital: foto do volume, leitura da etiqueta, aviso com foto, endereço na prateleira e retirada com QR, foto e assinatura na tela.
      </PageHead>
      <section className="grid kpis">
        <Kpi label="Recebidas hoje" value={sum("recv")} detail={one ? "Residencial Ipê Amarelo" : `${condos.length} condomínios`} />
        <Kpi label="Aguardando retirada" value={sum("wait")} detail="moradores já avisados por push e WhatsApp" />
        <Kpi label="Acima de 48h" value={over} alert={over > 0} detail="lembrete automático enviado" />
        <Kpi label="Tempo até a retirada" value={avg} unit=" h" detail="média do mês" />
        <Kpi label="Retiradas com prova digital" value="100" unit="%" detail="QR ou código + foto + assinatura · zero papel" />
      </section>

      {!one ? (
        <Panel title="Por condomínio" aside="hoje">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Condomínio</th>
                  <th className="c">Recebidas</th>
                  <th className="c">Aguardando</th>
                  <th className="c">Acima de 48h</th>
                  <th className="c">Tempo até retirada</th>
                </tr>
              </thead>
              <tbody>
                {[...condos]
                  .sort((a, b) => val(b, "wait") - val(a, "wait"))
                  .map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td className="c num">{val(c, "recv")}</td>
                      <td className="c num">{val(c, "wait")}</td>
                      <td className={cx("c num", c.pk.over > 0 && "ipo-low")}>{c.pk.over}</td>
                      <td className="c num">{String(c.pk.avgH).replace(".", ",")} h</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : null}

      <Panel
        title="Sala de encomendas · Residencial Ipê Amarelo"
        aside={
          <button className="btn primary" onClick={simulate}>
            Simular recebimento
          </button>
        }
      >
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Unidade</th>
                <th>Origem</th>
                <th>Há</th>
                <th>Posição</th>
                <th>Situação</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.unit}</b>
                    <br />
                    <span className="small muted">{p.resident}</span>
                  </td>
                  <td>
                    <span className="carrier">{p.carrier}</span>
                    <br />
                    <span className="small muted mono">{p.code}</span>
                  </td>
                  <td className="num">{p.minutes === null ? "—" : fmtMin(p.minutes)}</td>
                  <td className="num">{p.position}</td>
                  <td>
                    <StatusCell p={p} />
                  </td>
                  <td>
                    {p.status === "aguardando" || p.status === "registrada" || p.status === "urgente" ? (
                      <button className="btn" onClick={() => deliverPackage(p.id)}>
                        Registrar retirada
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="grid cols-2e">
        <Panel title="Recebimento em 10 segundos">
          <Steps steps={RECEIVE_STEPS} active={stepOn} />
        </Panel>
        <Panel title="Regras automáticas">
          <List
            items={[
              "Lembrete ao morador em 24h, 48h e 7 dias",
              "Após o prazo de guarda, devolução registrada com foto",
              "Correspondência registrada (AR): só o destinatário retira",
              "Comida e perecível: aviso urgente e prioridade no balcão",
              "Retirada por terceiro só se o morador autorizar no app",
              "Conferência diária: contagem física × sistema",
            ]}
          />
        </Panel>
      </section>

      <section className="grid cols-2e">
        <Panel title={<h3>Transportadoras reconhecidas</h3>}>
          <div className="tagline">
            {CARRIERS.map((t) => (
              <span key={t} className="carrier">
                {t}
              </span>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: 10 }}>
            Pré-aviso: o morador cadastra o código de rastreio ou do pedido no app. Correios, Jadlog, Shopee e outras são acompanhadas por um agregador de rastreio; para Mercado Livre e Amazon com entrega própria, o casamento acontece na chegada, pela etiqueta.
          </p>
        </Panel>
        <Panel title={<h3>Armários inteligentes 24h (opcional)</h3>}>
          <p className="small muted">
            Para condomínios com portaria remota ou muito volume: o entregador deposita, o morador recebe o código no app e retira a qualquer hora. A integração é por API com fornecedores de armários, e pode virar uma linha de receita do grupo em parceria.
          </p>
        </Panel>
      </section>
    </>
  );
}
