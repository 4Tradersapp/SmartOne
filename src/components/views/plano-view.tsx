import { List, PageHead } from "@/components/ui/primitives";
import { PLAN, SPRINTS } from "@/lib/mock/presentation";
import { cx } from "@/lib/format";

export function PlanoView() {
  return (
    <>
      <PageHead eyebrow="Do acordo ao uso diário" title="Plano passo a passo">
        Estimativa para a primeira versão. O prazo final depende do escopo fechado no diagnóstico.
      </PageHead>
      <section className="phases">
        {PLAN.map((p) => (
          <div key={p.title} className={cx("ph", p.current && "now")}>
            <div className="when">{p.when}</div>
            <div className="node">
              <i />
            </div>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <h3>{p.title}</h3>
                <span className="num small muted">{p.when}</span>
              </div>
              {p.items ? (
                <ul className="list" style={{ marginTop: 0 }}>
                  {p.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              ) : (
                <div className="sprints">
                  {SPRINTS.map(([s, d]) => (
                    <div key={s}>
                      <b>{s}</b>
                      {d}
                    </div>
                  ))}
                </div>
              )}
              <div className="deliv">
                <b>Entrega:</b> {p.delivery}
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="grid cols-2e">
        <div className="panel">
          <h3>O que precisamos do grupo</h3>
          <List
            items={[
              "Uma pessoa de referência na operação",
              "Planilhas de condomínios, escalas e colaboradores",
              "2h por semana de um gestor de cada empresa durante a construção",
              "Celulares para os postos do piloto",
              "Acesso de leitura ao Protheus para a integração",
            ]}
          />
        </div>
        <div className="panel">
          <h3>Decisões para esta reunião</h3>
          <List items={["Formato: contrato de desenvolvimento ou sociedade", "Quais 3 condomínios entram no piloto", "Data de início do diagnóstico", "Prazo e aviso prévio da plataforma atual"]} />
        </div>
      </section>
    </>
  );
}
