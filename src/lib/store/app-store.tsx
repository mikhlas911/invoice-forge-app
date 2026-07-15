import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Client, Invoice, InvoiceStatus, LineItem } from "@/lib/data/types";
import { SEED_CLIENTS, SEED_INVOICES } from "@/lib/data/seed";
import { computeTotals } from "@/lib/utils/money";

type NewClientInput = Omit<Client, "id" | "invoicesCount" | "totalBilled">;
type NewInvoiceInput = Omit<Invoice, "id" | "clientName" | "clientCompany">;

type AppStore = {
  clients: Client[];
  invoices: Invoice[];
  addClient: (input: NewClientInput) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  addInvoice: (input: NewInvoiceInput) => Invoice;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  duplicateInvoice: (id: string) => Invoice | null;
  nextInvoiceNumber: () => string;
};

const AppStoreContext = createContext<AppStore | null>(null);

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(SEED_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);

  const nextInvoiceNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const maxNum = invoices.reduce((max, inv) => {
      const m = inv.number.match(/(\d+)$/);
      return m ? Math.max(max, parseInt(m[1], 10)) : max;
    }, 0);
    return `INV-${year}-${String(maxNum + 1).padStart(4, "0")}`;
  }, [invoices]);

  const addClient = useCallback((input: NewClientInput) => {
    const client: Client = { id: makeId("c"), invoicesCount: 0, totalBilled: 0, ...input };
    setClients((prev) => [client, ...prev]);
    return client;
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addInvoice = useCallback((input: NewInvoiceInput) => {
    const client = clients.find((c) => c.id === input.clientId);
    const invoice: Invoice = {
      id: makeId("i"),
      clientName: client?.name ?? "",
      clientCompany: client?.company ?? "",
      ...input,
    };
    setInvoices((prev) => [invoice, ...prev]);
    if (client) {
      const total = computeTotals(invoice.items).total;
      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id
            ? { ...c, invoicesCount: c.invoicesCount + 1, totalBilled: c.totalBilled + total }
            : c,
        ),
      );
    }
    return invoice;
  }, [clients]);

  const updateInvoice = useCallback((id: string, patch: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const setInvoiceStatus = useCallback((id: string, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }, []);

  const duplicateInvoice = useCallback((id: string): Invoice | null => {
    const src = invoices.find((i) => i.id === id);
    if (!src) return null;
    const copy: Invoice = {
      ...src,
      id: makeId("i"),
      number: nextInvoiceNumber(),
      status: "draft",
      amountPaid: 0,
      items: src.items.map((it: LineItem) => ({ ...it, id: makeId("l") })),
    };
    setInvoices((prev) => [copy, ...prev]);
    return copy;
  }, [invoices, nextInvoiceNumber]);

  const value = useMemo<AppStore>(
    () => ({ clients, invoices, addClient, updateClient, addInvoice, updateInvoice, setInvoiceStatus, duplicateInvoice, nextInvoiceNumber }),
    [clients, invoices, addClient, updateClient, addInvoice, updateInvoice, setInvoiceStatus, duplicateInvoice, nextInvoiceNumber],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
