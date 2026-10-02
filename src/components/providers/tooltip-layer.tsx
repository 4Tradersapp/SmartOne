"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Tooltip global: qualquer elemento com `data-tip="texto"` mostra o texto ao passar o mouse.
 * Gráficos usam o próprio estado de hover e chamam `showTooltip`.
 */
type TipState = { html: string; x: number; y: number } | null;
let externalSet: ((t: TipState) => void) | null = null;

export function showTooltip(html: string, x: number, y: number) {
  externalSet?.({ html, x, y });
}
export function hideTooltip() {
  externalSet?.(null);
}

export function TooltipLayer() {
  const [tip, setTip] = useState<TipState>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    externalSet = setTip;
    const move = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-tip]");
      if (el) setTip({ html: escapeHtml(el.dataset.tip ?? ""), x: e.clientX, y: e.clientY });
      else if (!(e.target as HTMLElement | null)?.closest("[data-chart]")) setTip(null);
    };
    document.addEventListener("mousemove", move);
    return () => {
      document.removeEventListener("mousemove", move);
      externalSet = null;
    };
  }, []);

  // Posiciona depois de medir o próprio tamanho, sem sair da tela
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !tip) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    el.style.left = `${tip.x + 14 + w > window.innerWidth - 8 ? tip.x - w - 14 : tip.x + 14}px`;
    el.style.top = `${tip.y + 14 + h > window.innerHeight - 8 ? tip.y - h - 14 : tip.y + 14}px`;
  }, [tip]);

  return <div ref={ref} className="tip" hidden={!tip} dangerouslySetInnerHTML={{ __html: tip?.html ?? "" }} />;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}
