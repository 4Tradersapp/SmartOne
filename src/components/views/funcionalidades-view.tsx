"use client";

import { useState } from "react";
import { PageHead } from "@/components/ui/primitives";
import { FEATURES, PERSONAS } from "@/lib/mock/presentation";
import type { Persona, Phase } from "@/lib/types";

const PHASE_CLASS: Record<Phase, string> = { MVP: "phase-mvp", "Fase 2": "phase-2", "Fase 3": "phase-3" };

export function FuncionalidadesView() {
  const [persona, setPersona] = useState<Persona | "all">("all");
  const [phase, setPhase] = useState<Phase | "all">("all");
  const list = FEATURES.filter((f) => (persona === "all" || f.personas.includes(persona)) && (phase === "all" || f.phase === phase));
  const count = (p: Phase) => FEATURES.filter((f) => f.phase === p).length;

  return (
    <>
      <PageHead
        eyebrow="Escopo completo"
        title="Mapa de funcionalidades"
        aside={
          <div className="factrow">
            <div><b>{FEATURES.length}</b><span>funcionalidades</span></div>
            <div><b>{count("MVP")}</b><span>na 1ª versão</span></div>
            <div><b>{count("Fase 2")}</b><span>fase 2</span></div>
            <div><b>{count("Fase 3")}</b><span>fase 3</span></div>
          </div>
        }
      />
      <p className="muted" style={{ maxWidth: "80ch" }}>
        Tudo o que a plataforma terá, por módulo, por público e por fase. Esta lista é a base da parte documental: cada linha vira requisito, tela e critério de aceite.
      </p>
      <div className="filters">
        <button className="fbtn" aria-pressed={persona === "all"} onClick={() => setPersona("all")}>
          Todos os públicos
        </button>
        {(Object.keys(PERSONAS) as Persona[]).map((k) => (
          <button key={k} className="fbtn" aria-pressed={persona === k} onClick={() => setPersona(k)}>
            {PERSONAS[k]}
          </button>
        ))}
      </div>
      <div className="filters">
        {(["all", "MVP", "Fase 2", "Fase 3"] as const).map((p) => (
          <button key={p} className="fbtn" aria-pressed={phase === p} onClick={() => setPhase(p)}>
            {p === "all" ? "Todas as fases" : p === "MVP" ? "1ª versão" : p}
          </button>
        ))}
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Funcionalidade</th>
              <th>Quem usa</th>
              <th>Fase</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((f, i) => (
                <tr key={f.module + f.name} className="feat-mod">
                  <td>{i === 0 || list[i - 1].module !== f.module ? f.module : ""}</td>
                  <td>{f.name}</td>
                  <td>
                    <div className="who-chips">
                      {f.personas.map((p) => (
                        <span key={p}>{PERSONAS[p]}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`pill ${PHASE_CLASS[f.phase]}`}>{f.phase === "MVP" ? "1ª versão" : f.phase}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="muted">
                  Nada neste filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
