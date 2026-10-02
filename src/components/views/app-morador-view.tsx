"use client";

import { useDemo } from "@/components/providers/demo-provider";
import { Avatar, PageHead, Panel, Plate, ScopeNote } from "@/components/ui/primitives";
import { FakeQr, Phone } from "@/components/ui/phone";

const TABS = ["Início", "Encomendas", "Visitas", "Mais"];

export function AppMoradorView() {
  const { role } = useDemo();
  return (
    <>
      {role.id !== "morador" ? <ScopeNote label="Prévia">App do morador. Quem não instalar continua recebendo encomendas e visitantes pelo WhatsApp, com link.</ScopeNote> : null}
      <PageHead eyebrow="Morador" title="App do morador">
        O morador cuida do próprio cadastro, libera visitantes, retira encomendas com QR e avisa quando está chegando. A portaria ganha tempo e o condomínio ganha registro.
      </PageHead>
      <div className="phones">
        <Phone title="Olá, Marina" subtitle="1204 B · Residencial Ipê Amarelo" active="Início" tabs={TABS} caption='Início com encomendas, visitantes, comunicados e o botão "Estou chegando".'>
          <div className="acard">
            <b>1 encomenda chegou</b>
            <span className="muted">Mercado Livre · prateleira C3 · há 12 min</span>
            <span style={{ color: "var(--focus)", fontWeight: 600 }}>Ver QR de retirada →</span>
          </div>
          <div className="acard">
            <b>Visitante hoje às 19:00</b>
            <span className="muted">Ana Paula · convite enviado por WhatsApp</span>
          </div>
          <div className="acard">
            <b>Comunicado do síndico</b>
            <span className="muted">Manutenção da bomba amanhã, 9h–12h</span>
            <span style={{ color: "var(--warn)", fontWeight: 600 }}>Confirmar leitura</span>
          </div>
          <div className="acard">
            <b>Seu cadastro: 85%</b>
            <div className="progress">
              <i style={{ width: "85%", background: "var(--warn)" }} />
            </div>
            <span className="muted">Falta contato de emergência · revisar até 15/10</span>
          </div>
          <div className="abtns">
            <div className="abtn" style={{ gridColumn: "1 / -1", background: "#0E1B33", color: "#fff", borderColor: "#0E1B33" }}>
              Estou chegando
            </div>
            <div className="abtn">Convidar visitante</div>
            <div className="abtn">Autorizar retirada</div>
          </div>
        </Phone>
        <Phone title="Visitante na portaria" subtitle="agora · portaria principal" active="Visitas" tabs={TABS} caption="Visitante na portaria: foto, documento conferido e liberação com um toque.">
          <div className="acard" style={{ alignItems: "center", textAlign: "center", gap: 8 }}>
            <Avatar initials="AP" size={72} />
            <b style={{ fontSize: "1rem" }}>Ana Paula Ribeiro</b>
            <span className="muted">CNH conferida · foto da entrada</span>
            <span className="pill s-info">Convite seu · válido até 23:00</span>
          </div>
          <div className="abtns">
            <div className="abtn" style={{ background: "#1E7F47", color: "#fff", borderColor: "#1E7F47" }}>
              Liberar
            </div>
            <div className="abtn">Recusar</div>
            <div className="abtn" style={{ gridColumn: "1 / -1" }}>
              Falar com a portaria
            </div>
          </div>
          <span className="small muted" style={{ textAlign: "center" }}>
            Sem resposta em 2 minutos, a portaria liga para você.
          </span>
        </Phone>
        <Phone title="Meu cadastro" subtitle="você é responsável por mantê-lo atualizado" active="Mais" tabs={TABS} caption="Cadastro da unidade com revisão obrigatória e termo de responsabilidade.">
          <div className="acard">
            <b>Completo: 85%</b>
            <div className="progress">
              <i style={{ width: "85%", background: "var(--warn)" }} />
            </div>
            <span className="muted">Última revisão em 03/2026 · revisar a cada 6 meses</span>
          </div>
          <div className="acard">
            <div className="compl"><span>Moradores</span><b>3 pessoas</b></div>
            <div className="compl">
              <span>Veículos</span>
              <b>
                <Plate>FJK2B47</Plate> <Plate>RTB4C21</Plate>
              </b>
            </div>
            <div className="compl"><span>Autorizados</span><b>Rosa · ter e sex, 8h–17h</b></div>
            <div className="compl"><span>Pets</span><b>1 cachorro</b></div>
            <div className="compl"><span>Contato de emergência</span><b className="miss">Falta</b></div>
            <div className="compl"><span>Facial</span><b>Ativa · pode desligar</b></div>
          </div>
          <div className="acard">
            <span className="muted">Ao salvar, você confirma que os dados são verdadeiros e autoriza seu uso pela portaria.</span>
          </div>
        </Phone>
        <Phone title="Retirar encomenda" subtitle="mostre o QR na portaria" active="Encomendas" tabs={TABS} caption="Retirada por QR, autorização de terceiro e pré-aviso de compras.">
          <div className="acard" style={{ alignItems: "center", gap: 8 }}>
            <FakeQr />
            <b>Mercado Livre · prateleira C3</b>
            <span className="muted">Código alternativo: 4 8 2 1</span>
          </div>
          <div className="acard">
            <b>Outra pessoa vai retirar?</b>
            <span className="muted">Autorize pelo nome; ela mostra o documento e a portaria tira foto.</span>
          </div>
          <div className="acard">
            <b>Pré-aviso</b>
            <span className="muted">Amazon · pedido 702-8811 · saiu para entrega</span>
          </div>
        </Phone>
      </div>
      <section className="grid cols-2e">
        <Panel title={<h3>&quot;Estou chegando&quot;</h3>}>
          <p className="small muted">
            A portaria recebe a placa e o tempo estimado; o portão fica pronto e, à noite, o porteiro acompanha a chegada pela câmera. O aviso automático por localização é opcional e só funciona se o morador permitir.
          </p>
        </Panel>
        <Panel title={<h3>Cadastro em dia é responsabilidade do morador</h3>}>
          <p className="small muted">
            Lembrete mensal enquanto houver pendência, revisão obrigatória a cada 6 meses e aviso à portaria quando a unidade estiver com cadastro vencido. Veículo sem cadastro não entra pela placa.
          </p>
        </Panel>
      </section>
    </>
  );
}
