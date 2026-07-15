import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CURRENCIES } from "@/lib/data/currencies";
import { BUSINESS_PROFILE } from "@/lib/data/seed";
import { computeTotals, formatMoney } from "@/lib/utils/money";
import { useAppStore } from "@/lib/store/app-store";
import type { LineItem } from "@/lib/data/types";
import { Plus, Trash2, ArrowLeft, Save, Send, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/app/invoices/new")({
  head: () => ({ meta: [{ title: "New invoice — Ledgerly" }] }),
  component: NewInvoice,
});

function newItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", quantity: 1, price: 0, tax: 0, discount: 0 };
}

function QuickAddClient({ onCreated }: { onCreated: (id: string) => void }) {
  const { addClient } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", email: "", address: "" });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.name.trim()) {
      toast.error("Company and contact name are required");
      return;
    }
    const c = addClient(form);
    toast.success(`${c.company} added`);
    onCreated(c.id);
    setForm({ company: "", name: "", email: "", address: "" });
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button"><UserPlus className="mr-1.5 h-4 w-4" /> New client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add a client</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5"><Label>Company</Label><Input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label>Contact name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label>Address</Label><Textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewInvoice() {
  const nav = useNavigate();
  const { clients, addInvoice, nextInvoiceNumber } = useAppStore();

  const [number, setNumber] = useState(() => nextInvoiceNumber());
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10));
  const [currency, setCurrency] = useState("USD");
  const [clientId, setClientId] = useState<string>(clients[0]?.id ?? "");
  const client = clients.find((c) => c.id === clientId);

  useEffect(() => {
    if (!clientId && clients[0]) setClientId(clients[0].id);
  }, [clientId, clients]);

  const [items, setItems] = useState<LineItem[]>([
    { id: "i1", description: "", quantity: 1, price: 0, tax: 0, discount: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Payment due within 14 days.");
  const [amountPaid, setAmountPaid] = useState(0);

  const totals = useMemo(() => computeTotals(items), [items]);
  const balance = totals.total - amountPaid;

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  function removeItem(id: string) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((i) => i.id !== id)));
  }
  function save(status: "draft" | "sent") {
    if (!clientId) {
      toast.error("Add a client first");
      return;
    }
    if (items.every((it) => !it.description.trim())) {
      toast.error("Add at least one line item");
      return;
    }
    addInvoice({
      number, clientId, issueDate, dueDate, currency, items, notes, terms, amountPaid, status,
    });
    toast.success(status === "draft" ? "Invoice saved as draft" : "Invoice sent to client");
    nav({ to: "/app/invoices" });
  }

  const Preview = (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">{BUSINESS_PROFILE.logoInitials}</div>
          <div className="mt-2 text-sm font-semibold">{BUSINESS_PROFILE.name}</div>
          <div className="text-xs text-muted-foreground">{BUSINESS_PROFILE.email}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Invoice</div>
          <div className="text-base font-semibold">{number}</div>
          <div className="mt-1 text-xs text-muted-foreground">Issued {new Date(issueDate).toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">Due {new Date(dueDate).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Bill to</div>
          <div className="mt-1 font-medium">{client?.company ?? "—"}</div>
          <div className="text-muted-foreground">{client?.name ?? ""}</div>
        </div>
        <div className="text-right"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount due</div><div className="mt-1 text-lg font-semibold tabular-nums">{formatMoney(balance, currency)}</div></div>
      </div>
      <div className="mt-5 overflow-hidden rounded border border-border">
        <table className="w-full text-xs">
          <thead className="bg-surface-muted/60 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-2 py-1.5 text-left font-medium">Item</th><th className="px-2 py-1.5 text-right font-medium">Qty</th><th className="px-2 py-1.5 text-right font-medium">Amount</th></tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const line = it.quantity * it.price;
              const amt = (line - line * (it.discount / 100)) * (1 + it.tax / 100);
              return (
                <tr key={it.id} className="border-t border-border">
                  <td className="px-2 py-1.5">{it.description || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{it.quantity}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{formatMoney(amt, currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="w-52 space-y-1 text-xs">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="tabular-nums">{formatMoney(totals.subtotal, currency)}</span></div>
          {totals.discountTotal > 0 && <div className="flex justify-between text-muted-foreground"><span>Discount</span><span className="tabular-nums">−{formatMoney(totals.discountTotal, currency)}</span></div>}
          {totals.taxTotal > 0 && <div className="flex justify-between text-muted-foreground"><span>Tax</span><span className="tabular-nums">{formatMoney(totals.taxTotal, currency)}</span></div>}
          <div className="mt-1.5 flex justify-between border-t border-border pt-1.5 font-semibold"><span>Total</span><span className="tabular-nums">{formatMoney(totals.total, currency)}</span></div>
        </div>
      </div>
      {(notes || terms) && (
        <div className="mt-6 grid gap-3 border-t border-border pt-4 text-[11px] sm:grid-cols-2">
          {notes && <div><div className="mb-0.5 font-medium uppercase tracking-wider text-muted-foreground">Notes</div><p>{notes}</p></div>}
          {terms && <div><div className="mb-0.5 font-medium uppercase tracking-wider text-muted-foreground">Terms</div><p>{terms}</p></div>}
        </div>
      )}
    </div>
  );

  const Editor = (
    <div className="space-y-6">
      <Card>
        <CardHeader className="py-4"><CardTitle className="text-sm">Invoice details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Invoice number</Label><Input value={number} onChange={(e) => setNumber(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Issue date</Label><Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
          <CardTitle className="text-sm">Bill to</CardTitle>
          <QuickAddClient onCreated={setClientId} />
        </CardHeader>
        <CardContent className="space-y-3">
          {clients.length > 0 ? (
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
              <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company} — {c.name}</SelectItem>)}</SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">No clients yet — add one to continue.</p>
          )}
          {client && (
            <div className="rounded-md border border-border bg-surface-muted/40 p-3 text-sm">
              <div className="font-medium">{client.company}</div>
              <div className="text-muted-foreground">{client.name}{client.email ? ` · ${client.email}` : ""}</div>
              {client.address && <div className="text-muted-foreground">{client.address}</div>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
          <CardTitle className="text-sm">Line items</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setItems([...items, newItem()])}><Plus className="mr-1 h-4 w-4" /> Add item</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="hidden grid-cols-[1fr_70px_100px_70px_70px_100px_36px] gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid">
            <div>Description</div><div className="text-right">Qty</div><div className="text-right">Price</div><div className="text-right">Tax %</div><div className="text-right">Disc %</div><div className="text-right">Amount</div><div />
          </div>
          {items.map((it) => {
            const line = it.quantity * it.price;
            const amt = (line - line * (it.discount / 100)) * (1 + it.tax / 100);
            return (
              <div key={it.id} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_70px_100px_70px_70px_100px_36px] sm:border-0 sm:p-1">
                <Input placeholder="Description" value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} />
                <Input type="number" min={0} value={it.quantity} onChange={(e) => updateItem(it.id, { quantity: +e.target.value })} className="text-right" />
                <Input type="number" min={0} step="0.01" value={it.price} onChange={(e) => updateItem(it.id, { price: +e.target.value })} className="text-right" />
                <Input type="number" min={0} value={it.tax} onChange={(e) => updateItem(it.id, { tax: +e.target.value })} className="text-right" />
                <Input type="number" min={0} value={it.discount} onChange={(e) => updateItem(it.id, { discount: +e.target.value })} className="text-right" />
                <div className="flex items-center justify-end pr-2 text-sm tabular-nums">{formatMoney(amt, currency)}</div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(it.id)} aria-label="Remove item"><Trash2 className="h-4 w-4" /></Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4"><CardTitle className="text-sm">Notes & terms</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Notes for client</Label><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Thanks for the work…" /></div>
          <div className="space-y-1.5"><Label>Payment terms</Label><Textarea rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Amount paid</Label><Input type="number" min={0} step="0.01" value={amountPaid} onChange={(e) => setAmountPaid(+e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Balance due</Label><Input value={formatMoney(balance, currency)} readOnly /></div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container-page py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm"><Link to="/app/invoices"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">New invoice</h1>
            <p className="text-sm text-muted-foreground">Total <span className="font-medium text-foreground tabular-nums">{formatMoney(totals.total, currency)}</span></p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => save("draft")}><Save className="mr-1.5 h-4 w-4" /> Save draft</Button>
          <Button size="sm" onClick={() => save("sent")}><Send className="mr-1.5 h-4 w-4" /> Save & send</Button>
        </div>
      </div>

      <div className="hidden gap-6 lg:grid lg:grid-cols-[1.15fr_1fr]">
        <div>{Editor}</div>
        <div className="sticky top-20 self-start">{Preview}</div>
      </div>

      <div className="lg:hidden">
        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="edit">Edit</TabsTrigger><TabsTrigger value="preview">Preview</TabsTrigger></TabsList>
          <TabsContent value="edit" className="mt-4">{Editor}</TabsContent>
          <TabsContent value="preview" className="mt-4">{Preview}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
