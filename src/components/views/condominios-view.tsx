"use client";

import { useDemo } from "@/components/providers/demo-provider";
import { PageHead, ScopeNote } from "@/components/ui/primitives";
import { scopeCompanies, scopeCondos, services } from "@/lib/scope";

export function CondominiosView() {
  const { role } = useDemo();
  const condos = scopeCondos(role);
  const cos = scopeCompanies(role);
  const total = condos.length * cos.length;
  const active = condos.reduce((a, c) => a + cos.filter((co) => c.svc[co.id]).length, 0);
  const isDir = role.id === "diretor";
  const rows = [...condos].sort((a, b) => Object.keys(b.svc).length - Object.keys(a.svc).length);

  return (
    <>
      {role.scope ? <ScopeNote>{role.scope}</ScopeNote> : null}
      <PageHead
        eyebrow="Carteira de clientes"
        title="Condomínios × serviços do grupo"
        aside={
          isDir ? (
            <div className="factrow">
              <div><b className="num">{active}</b><span>contratos ativos</span></div>
              <div><b className="num">{total}</b><span>combinações possíveis</span></div>
              <div><b className="num" style={{ color: "var(--crit)" }}>{total - active}</b><span>oportunidades de venda cruzada</span></div>
            </div>
          ) : undefined
        }
      />
      {isDir ? (
        <p className="muted" style={{ maxWidth: "75ch" }}>
          Cada linha é um cliente; cada coluna, uma empresa do grupo. Célula preenchida mostra o índice de performance do mês. Célula tracejada é um serviço que o grupo pode oferecer ao mesmo síndico, já com histórico de entrega para mostrar.
        </p>
      ) : null}
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Condomínio</th>
              {cos.map((co) => (
                <th key={co.id} className="c">
                  <span className={`dot ${co.color}`} /> {co.name}
                  <br />
                  <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>{co.short}</span>
                </th>
              ))}
              <th className="c">Postos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <b>{c.name}</b>
                  <br />
                  <span className="small muted">
                    {c.kind} · {c.size} {c.kind === "Comercial" ? "salas" : "unidades"}
                  </span>
                </td>
                {cos.map((co) => {
                  const s = c.svc[co.id];
                  return (
                    <td key={co.id} className="c">
                      {s ? (
                        <span className={`cell ${co.color}`} data-tip={`${co.name} · ${s.desc} · ${s.postos} posto(s) · ${s.colab} colaboradores · IPO ${s.ipo}%`}>
                          <span className="dot" />
                          {s.ipo}%
                        </span>
                      ) : isDir ? (
                        <span className="cell opp" data-tip={`${co.name} ainda não atende este condomínio`}>
                          + oportunidade
                        </span>
                      ) : null}
                    </td>
                  );
                })}
                <td className="c num">{services(role, c).reduce((a, [, s]) => a + s.postos, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
