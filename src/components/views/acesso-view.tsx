"use client";

import { useEffect, useRef, useState } from "react";
import { useDemo } from "@/components/providers/demo-provider";
import { Avatar, Kpi, List, PageHead, Panel, Plate, ScopeNote, Steps } from "@/components/ui/primitives";
import { ACCESS_EVENTS, DEVICES, PLATES, VISITS } from "@/lib/mock/operations";
import { fmt } from "@/lib/format";
import { portariaCondos } from "@/lib/scope";

const VISIT_SIM: Array<[string, string]> = [
  ["Foto capturada", "câmera da portaria"],
  ["Documento lido", "CNH · Ana Paula Ribeiro"],
  ["Destino", "1204 B · Marina Costa"],
  ["Morador avisado", "push com foto e botões Liberar / Recusar"],
  ["Liberada pela moradora", "resposta em 19 segundos"],
  ["Entrada registrada", "saída será fechada pela facial"],
];

const JOURNEY: Array<[string, string]> = [
  ["Convite", "o morador gera um QR com dia e horário"],
  ["Chegada", "foto e documento lidos pela câmera (OCR)"],
  ["Liberação", "o morador recebe a foto no celular e libera ou recusa"],
  ["Entrada", "registrada com horário e quem autorizou"],
  ["Saída", "a facial reconhece a foto da entrada e fecha a visita"],
  ["Limpeza", "foto e documento apagados no prazo definido pelo condomínio"],
];

export function AcessoView() {
  const { role, toast } = useDemo();
  const condos = portariaCondos(role);
  const one = condos.length === 1;
  const visit = condos.reduce((a, c) => a + c.acc.visit, 0);
  const entries = condos.reduce((a, c) => a + c.acc.entries, 0);
  const auto = Math.round(condos.reduce((a, c) => a + c.acc.auto, 0) / condos.length);

  const [sim, setSim] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const simulate = () => {
    timers.current.forEach(clearTimeout);
    setSim(0);
    let t = 300;
    VISIT_SIM.forEach((_, i) => {
      t += i === 4 ? 900 : 450;
      timers.current.push(setTimeout(() => setSim(i + 1), t));
    });
    timers.current.push(setTimeout(() => toast("Visitante liberada pelo app. Entrada registrada com foto e documento."), t + 100));
  };

  return (
    <>
      {role.id !== "diretor" && role.scope ? <ScopeNote>{role.scope}</ScopeNote> : null}
      <PageHead eyebrow="Portaria" title="Controle de acesso">
        Visitante com convite, foto e documento; morador libera pelo app; veículos entram pela placa; a saída do visitante fecha sozinha pela facial.
      </PageHead>
      <section className="grid kpis">
        <Kpi label="Visitantes agora" value={visit} detail={one ? "no Residencial Ipê Amarelo" : `em ${condos.length} condomínios`} />
        <Kpi label="Entradas hoje" value={fmt(entries)} detail="pessoas e veículos" />
        <Kpi label="Sem intervenção" value={auto} unit="%" detail="placa, facial ou QR, sem o porteiro digitar" />
        <Kpi label="Pendências" value={2} alert detail="1 placa sem cadastro · 1 visitante sem saída" />
      </section>

      <section className="grid cols-2">
        <Panel
          title="Agora na portaria · Ipê Amarelo"
          aside={
            <button className="btn primary" onClick={simulate}>
              Simular chegada de visitante
            </button>
          }
        >
          {sim !== null ? (
            <div className="sim">
              <Steps steps={VISIT_SIM} active={sim} waiting={sim === 4 ? 3 : undefined} />
            </div>
          ) : null}
          <div style={{ marginTop: 6 }}>
            {ACCESS_EVENTS.map((e) => (
              <div key={e.when + e.kind} className="ev">
                <time>{e.when}</time>
                <span className={`ic ${e.warn ? "warn" : "ok"}`}>{e.kind}</span>
                <span>
                  {e.plate ? (
                    <>
                      <Plate>{e.plate}</Plate>{" "}
                    </>
                  ) : null}
                  {e.text}
                </span>
              </div>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: 8 }}>
            PL leitura de placa · FC facial · QR convite · APP liberado pelo morador · IN aviso de chegada
          </p>
        </Panel>
        <Panel title="Placas reconhecidas">
          {PLATES.map((p) => (
            <div key={p.plate} className="dev">
              <span>
                <Plate>{p.plate}</Plate> <span className="small muted">{p.who}</span>
              </span>
              {p.ok ? (
                <span className="pill s-ok">✓ {p.conf}</span>
              ) : (
                <span style={{ display: "flex", gap: 6 }}>
                  <button className="btn" onClick={() => toast("A portaria liga para a unidade indicada pelo motorista e registra quem autorizou.")}>
                    Ligar e liberar
                  </button>
                  <button className="btn danger" onClick={() => toast("Entrada recusada e registrada com a foto da placa.")}>
                    Recusar
                  </button>
                </span>
              )}
            </div>
          ))}
          <h3 style={{ marginTop: 16 }}>Equipamentos</h3>
          {DEVICES.map(([d, s]) => (
            <div key={d} className="dev">
              <span>{d}</span>
              <span className="pill s-ok">✓ {s}</span>
            </div>
          ))}
          <p className="small muted" style={{ marginTop: 8 }}>
            Funciona com os equipamentos que o grupo já instala (câmeras de placa, terminais faciais, cancelas). Marcas a confirmar no diagnóstico.
          </p>
        </Panel>
      </section>

      <Panel title="Pessoas no condomínio" aside="visitantes, prestadores e autorizados">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Tipo</th>
                <th>Destino</th>
                <th>Entrada</th>
                <th>Como entrou</th>
                <th>Saída</th>
              </tr>
            </thead>
            <tbody>
              {VISITS.map((v) => (
                <tr key={v.name}>
                  <td>
                    <div className="who">
                      <Avatar initials={v.initials} />
                      <div>
                        <b>{v.name}</b>
                        <span>foto + documento na entrada</span>
                      </div>
                    </div>
                  </td>
                  <td>{v.type}</td>
                  <td>{v.dest}</td>
                  <td className="num">{v.time}</td>
                  <td className="small">{v.how}</td>
                  <td>{v.warn ? <span className="pill s-warn">! Sem saída</span> : <span className="pill s-idle">Automática pela facial</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="grid cols-2e">
        <Panel title={<h3>Jornada do visitante</h3>}>
          <Steps steps={JOURNEY} />
        </Panel>
        <Panel title={<h3>Privacidade (LGPD)</h3>}>
          <List
            items={[
              "Rosto é dado sensível: facial é opcional e sempre há alternativa (QR, tag ou senha)",
              "Consentimento registrado no app, com opção de revogar",
              "Prazo de guarda de fotos e documentos definido por condomínio, com exclusão automática",
              "Só portaria e supervisão do próprio condomínio veem fotos de visitantes",
              "Relatório de impacto (RIPD) entregue ao condomínio na implantação",
            ]}
          />
        </Panel>
      </section>
    </>
  );
}
