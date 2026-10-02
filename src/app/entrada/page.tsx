"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function EntradaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/plano";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Senha incorreta");
        return;
      }
      router.replace(next.startsWith("/") ? next : "/plano");
      router.refresh();
    } catch {
      setError("Não foi possível validar. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="access-gate">
      <div className="access-card panel">
        <div className="eyebrow">Smart One · Grupo FortSvig</div>
        <h1>Plano passo a passo</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          Esta tela é restrita. Digite a senha para ver o cronograma e as entregas.
        </p>
        <form onSubmit={onSubmit} className="access-form">
          <label htmlFor="access-password">Senha</label>
          <input
            id="access-password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
            autoFocus
          />
          {error ? (
            <p className="access-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn primary" disabled={loading || !password}>
            {loading ? "Verificando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EntradaPage() {
  return (
    <Suspense
      fallback={
        <div className="access-gate">
          <div className="access-card panel">
            <p className="muted">Carregando…</p>
          </div>
        </div>
      }
    >
      <EntradaForm />
    </Suspense>
  );
}
