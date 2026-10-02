"use client";

import type { CSSProperties, ReactNode } from "react";
import { useDemo } from "@/components/providers/demo-provider";
import { PageHead, Panel, ScopeNote } from "@/components/ui/primitives";
import { PERM_COLUMNS, PERMISSIONS, USERS } from "@/lib/rbac";
import type { Perm } from "@/lib/types";

const SYM: Record<Perm, ReactNode> = {
  y: <span className="y">✓</span>,
  p: <span className="p">◐</span>,
  n: <span className="n">—</span>,
};

const HIER_1: Array<[string, string]> = [
  ["Plataforma", "4Traders"],
  ["Grupo FortSvig", "conta do cliente"],
  ["Empresa", "4 CNPJs"],
  ["Cliente / contrato", "síndico, empresa"],
  ["Local", "condomínio"],
  ["Posto ou área", "portaria, garagem"],
  ["Colaborador", "turno"],
];
const HIER_2: Array<[string, string]> = [
  ["Local", "condomínio"],
  ["Unidade", "apartamento ou sala"],
  ["Morador", "e autorizados"],
  ["Visitante", "convite temporário"],
];

function Hier({ items, style }: { items: Array<[string, string]>; style?: CSSProperties }) {
  return (
    <div className="hier" style={style}>
      {items.map(([b, s], i) => (
        <span key={b + i} style={{ display: "contents" }}>
          <div>
            <b>{b}</b>
            <span>{s}</span>
          </div>
          {i < items.length - 1 ? <em>→</em> : null}
        </span>
      ))}
    </div>
  );
}

export function UsuariosView() {
  const { role, toast } = useDemo();
  const isGerente = role.id === "gerente";
  const users = isGerente ? USERS.filter((u) => u[2].includes("Fortslimp") || u[1] === "Colaborador de campo") : USERS;

  return (
    <>
      {role.scope ? <ScopeNote>{role.scope}</ScopeNote> : null}
      {isGerente ? <ScopeNote>Gerente vê a matriz e convida usuários só da própria empresa. Não pode criar diretores nem acessar outras empresas.</ScopeNote> : null}
      <PageHead eyebrow="Quem vê o quê" title="Usuários e permissões">
        Cada pessoa tem um perfil (o que pode fazer) e um escopo (onde pode fazer). Toda ação fica registrada.
      </PageHead>
      <Panel title="Hierarquia de acesso">
        <Hier items={HIER_1} />
        <Hier items={HIER_2} style={{ marginTop: 8 }} />
        <p className="small muted" style={{ marginTop: 10 }}>
          Um supervisor da Infraseg com escopo em 7 condomínios só enxerga esses 7, e só os serviços da Infraseg. O síndico enxerga o próprio condomínio com todos os serviços do grupo.
        </p>
      </Panel>
      <section>
        <div className="panel-h">
          <h2>Matriz de permissões</h2>
          <div className="legend">
            <span>{SYM.y} permitido</span>
            <span>{SYM.p} só no próprio escopo</span>
            <span>{SYM.n} não permitido</span>
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="mx">
            <thead>
              <tr>
                <th>Permissão</th>
                {PERM_COLUMNS.map((c) => (
                  <th key={c} className="c">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(([label, ...vals]) => (
                <tr key={label}>
                  <td>{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="c">
                      {SYM[v]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <div className="panel-h">
          <h2>Usuários</h2>
          <button className="btn primary" onClick={() => toast("No produto, o convite vai por WhatsApp ou e-mail com o perfil e o escopo já definidos.")}>
            Convidar usuário
          </button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Perfil</th>
                <th>Escopo</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {users.map(([name, profile, scope, status]) => (
                <tr key={name}>
                  <td>
                    <b>{name}</b>
                  </td>
                  <td>{profile}</td>
                  <td className="muted">{scope}</td>
                  <td>
                    <span className={`pill ${status.startsWith("Ativo") ? "s-ok" : status === "Auditado" ? "s-info" : "s-idle"}`}>{status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="rules">
        {[
          ["Demissão bloqueia na hora", "Desligamento no RH (Protheus) revoga o acesso ao app automaticamente."],
          ["Verificação em duas etapas", "Obrigatória para diretoria, gerentes e financeiro."],
          ["Nada é apagado", "Correções ficam como nova versão, com quem alterou, quando e por quê."],
          ["Morador com ou sem app", "Quem não instala recebe WhatsApp com link. Cada morador só vê a própria unidade."],
          ["Biometria opcional", "Facial só com consentimento e sempre com alternativa: QR, tag ou senha."],
          ["Diretoria não vê rosto de visitante", "Fotos e documentos ficam com a portaria e a supervisão do condomínio, pelo prazo definido."],
        ].map(([t, d]) => (
          <div key={t} className="rule">
            <b>{t}</b>
            <span className="muted">{d}</span>
          </div>
        ))}
      </section>
    </>
  );
}
