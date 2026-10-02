"use client";

import { useDemo } from "@/components/providers/demo-provider";
import { PageHead, Panel, ScopeNote } from "@/components/ui/primitives";
import { Phone } from "@/components/ui/phone";

const CHECKPOINTS: Array<[string, string, "ok" | "next" | "pend"]> = [
  ["Portão de veículos", "22:02", "ok"],
  ["Casa de máquinas", "22:05", "ok"],
  ["Piscina e deck", "22:08", "ok"],
  ["Muro dos fundos", "22:11", "ok"],
  ["Garagem G1", "22:14", "ok"],
  ["Garagem G2", "próximo", "next"],
  ["Gerador", "", "pend"],
  ["Hall bloco B", "", "pend"],
];
const WAVE = [8, 18, 26, 14, 30, 22, 10, 24, 32, 16, 9, 20, 28, 12, 6];

export function AppColaboradorView() {
  const { role } = useDemo();
  return (
    <>
      {role.id !== "colaborador" ? <ScopeNote label="Prévia">App do colaborador no celular do posto. Funciona sem internet e sincroniza quando o sinal volta.</ScopeNote> : null}
      <PageHead eyebrow="Celular do posto" title="App do colaborador">
        Três modos no mesmo app: colaborador de posto, supervisor volante e portaria em tablet.
      </PageHead>
      <div className="phones">
        <Phone title="Olá, Carlos" subtitle="Porteiro · 12x36 noturno · Res. Ipê Amarelo · Portaria principal" active="Início" caption="Início do turno com selfie e PIN. Funciona offline.">
          <div className="acard">
            <b>Turno iniciado às 19:02</b>
            <span className="muted">Selfie + PIN confirmados · no posto (Wi-Fi do condomínio)</span>
          </div>
          <div className="acard">
            <b>Próxima ronda às 22:00</b>
            <span className="muted">8 pontos NFC · leva cerca de 20 min</span>
          </div>
          <div className="acard">
            <b>Tarefas do turno · 5 de 9</b>
            <div className="progress">
              <i style={{ width: "55%" }} />
            </div>
          </div>
          <div className="offline">Sem internet · 3 registros guardados, enviam sozinhos</div>
          <div className="abtns">
            <div className="abtn">Ocorrência por voz</div>
            <div className="abtn">Nova encomenda</div>
            <div className="abtn sos">SOS · pedir ajuda</div>
          </div>
        </Phone>
        <Phone title="Ronda perimetral · 22:00" subtitle="Aproxime o celular de cada etiqueta" active="Ronda" caption="Ronda por NFC com tempo entre pontos conferido.">
          <div className="acard">
            <b>5 de 8 pontos</b>
            <div className="progress">
              <i style={{ width: "62%" }} />
            </div>
            <span className="muted">Iniciada 22:01 · ritmo normal</span>
          </div>
          {CHECKPOINTS.map(([n, t, s]) => (
            <div key={n} className="cp">
              <i className={s}>{s === "ok" ? "✓" : s === "next" ? "→" : "·"}</i>
              <span style={{ flex: 1 }}>{n}</span>
              <span className="num muted">{t}</span>
            </div>
          ))}
          <span className="small muted">Etiqueta NFC criptografada: não dá para copiar nem ler por foto.</span>
        </Phone>
        <Phone title="Nova ocorrência" subtitle="Fale o que aconteceu; o sistema organiza" active="Início" caption="Relato por voz vira ocorrência estruturada.">
          <div className="acard" style={{ alignItems: "center" }}>
            <div className="wave">
              {WAVE.map((h, i) => (
                <i key={i} style={{ height: h }} />
              ))}
            </div>
            <span className="muted">00:21 · áudio original guardado</span>
          </div>
          <div className="acard">
            <b>Organizado automaticamente</b>
            <div className="field-chip"><span>Tipo</span><b>Acesso indevido</b></div>
            <div className="field-chip"><span>Local</span><b>Portão de veículos</b></div>
            <div className="field-chip"><span>Prioridade</span><b style={{ color: "var(--warn)" }}>Média</b></div>
            <div className="field-chip stack"><span>Resumo</span><b>Visitante tentou entrar atrás de morador; acesso negado, morador avisado.</b></div>
          </div>
          <div className="abtns">
            <div className="abtn">Adicionar foto</div>
            <div className="abtn" style={{ background: "#0E1B33", color: "#fff", borderColor: "#0E1B33" }}>
              Registrar
            </div>
          </div>
        </Phone>
      </div>
      <section className="grid cols-2e">
        <Panel title={<h3>Colaborador de posto</h3>}>
          <p className="small muted">Checklist do turno, ronda NFC, ocorrência por voz, encomendas com leitura da etiqueta, passagem de turno com chaves e equipamentos, SOS e procedimentos do posto.</p>
        </Panel>
        <Panel title={<h3>Supervisor volante</h3>}>
          <p className="small muted">Rota de visitas, checklist do posto (uniforme, postura, livro), assumir alertas, cobrir falta com folguista e aprovar justificativas.</p>
        </Panel>
      </section>
    </>
  );
}
