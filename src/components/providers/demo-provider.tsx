"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ROLES } from "@/lib/rbac";
import { ALERTS, ESCALATION_CHAIN, PACKAGES } from "@/lib/mock/operations";
import { INITIAL_QUEUE } from "@/lib/mock/notifications";
import type { Alert, Package, QueuedMessage, Role, RoleId } from "@/lib/types";

/**
 * Estado da demonstração (em memória no navegador).
 * Quando o Supabase entrar, cada ação aqui vira uma mutation/RPC e os dados vêm de queries.
 */
interface DemoState {
  role: Role;
  setRole: (id: RoleId) => void;
  alerts: Alert[];
  acceptAlert: (id: number) => void;
  escalateAlert: (id: number) => void;
  closeAlert: (id: number) => void;
  packages: Package[];
  receivePackage: () => void;
  deliverPackage: (id: string) => void;
  c1Packages: { recv: number; wait: number };
  queue: QueuedMessage[];
  enqueue: (m: QueuedMessage) => void;
  toast: (msg: string) => void;
  isDay: boolean;
  now: Date | null;
}

const Ctx = createContext<DemoState | null>(null);
const ROLE_KEY = "smartone.role";

/* Perfil salvo no navegador e relógio por minuto, lidos como "stores" externos
   para não divergir da renderização do servidor. */
const roleListeners = new Set<() => void>();
function subscribeRole(cb: () => void) {
  roleListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    roleListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function readRole(): RoleId {
  try {
    const saved = window.localStorage.getItem(ROLE_KEY) as RoleId | null;
    return saved && saved in ROLES ? saved : "diretor";
  } catch {
    return "diretor";
  }
}
function subscribeMinute(cb: () => void) {
  const t = setInterval(cb, 30_000);
  return () => clearInterval(t);
}
const readMinute = () => Math.floor(Date.now() / 60_000);

export function DemoProvider({ children }: { children: ReactNode }) {
  const storedRole = useSyncExternalStore(subscribeRole, readRole, () => "diretor" as RoleId);
  const [roleOverride, setRoleOverride] = useState<RoleId | null>(null);
  const roleId = roleOverride ?? storedRole;
  const minute = useSyncExternalStore(subscribeMinute, readMinute, () => null);
  const now = useMemo(() => (minute === null ? null : new Date(minute * 60_000)), [minute]);
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [packages, setPackages] = useState<Package[]>(PACKAGES);
  const [c1Packages, setC1Packages] = useState({ recv: 27, wait: 11 });
  const [queue, setQueue] = useState<QueuedMessage[]>(INITIAL_QUEUE);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const seq = useRef(20);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const setRole = useCallback(
    (id: RoleId) => {
      setRoleOverride(id);
      try {
        window.localStorage.setItem(ROLE_KEY, id);
      } catch {
        /* armazenamento indisponível: vale só nesta aba */
      }
      roleListeners.forEach((l) => l());
      toast(`Agora você vê o sistema como: ${ROLES[id].label}`);
    },
    [toast],
  );

  const patchAlert = (id: number, fn: (a: Alert) => Alert) => setAlerts((list) => list.map((a) => (a.id === id ? fn(a) : a)));

  const value = useMemo<DemoState>(() => {
    const hour = now?.getHours() ?? 12;
    return {
      role: ROLES[roleId],
      setRole,
      alerts,
      acceptAlert: (id) => {
        patchAlert(id, (a) => ({ ...a, status: "assumido", who: "você" }));
        toast("Alerta assumido. O cronômetro de resolução começou.");
      },
      escalateAlert: (id) => {
        const a = alerts.find((x) => x.id === id);
        const step = Math.min(ESCALATION_CHAIN.length, (a?.step ?? 1) + 1);
        patchAlert(id, (x) => ({ ...x, status: "escalado", step, who: ESCALATION_CHAIN[step - 1] }));
        toast(`Escalonado para: ${ESCALATION_CHAIN[step - 1]}.`);
      },
      closeAlert: (id) => {
        patchAlert(id, (a) => ({ ...a, status: "encerrado" }));
        toast("No produto, encerrar pede foto ou relato. Fica tudo no histórico do condomínio.");
      },
      packages,
      receivePackage: () => {
        seq.current += 1;
        const n = seq.current;
        setPackages((list) => [
          { id: `p${n}`, unit: "1806 A", resident: "Gustavo Neri", carrier: "Mercado Livre", code: `ML 4415 22${n}`, minutes: 0, position: "C4", status: "aguardando" },
          ...list,
        ]);
        setC1Packages((p) => ({ recv: p.recv + 1, wait: p.wait + 1 }));
        toast("Encomenda registrada. Gustavo (1806 A) recebeu push e WhatsApp com a foto e o QR.");
      },
      deliverPackage: (id) => {
        setPackages((list) =>
          list.map((p) =>
            p.id === id
              ? { ...p, status: "retirada", position: "—", by: p.carrier.includes("AR") ? "destinatário · documento + assinatura" : "QR validado · foto + assinatura" }
              : p,
          ),
        );
        setC1Packages((p) => ({ ...p, wait: Math.max(0, p.wait - 1) }));
        toast("Retirada registrada com foto e assinatura. O morador recebeu a confirmação.");
      },
      c1Packages,
      queue,
      enqueue: (m) => setQueue((q) => [m, ...q]),
      toast,
      isDay: hour >= 7 && hour < 19,
      now,
    };
  }, [roleId, setRole, alerts, packages, c1Packages, queue, toast, now]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {toastMsg ? (
        <div className="toast" role="status">
          {toastMsg}
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

export function useDemo(): DemoState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo precisa estar dentro de <DemoProvider>");
  return ctx;
}
