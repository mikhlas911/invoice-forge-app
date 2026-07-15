import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatMoney } from "@/lib/utils/money";
import { useAppStore } from "@/lib/store/app-store";
import { Plus, Search, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/clients")({
  head: () => ({ meta: [{ title: "Clients — Ledgerly" }] }),
  component: Clients,
});

function AddClientDialog() {
  const { addClient } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", email: "", address: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.name.trim()) {
      toast.error("Company and contact name are required");
      return;
    }
    addClient(form);
    toast.success(`${form.company} added`);
    setForm({ company: "", name: "", email: "", address: "" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a client</DialogTitle>
          <DialogDescription>Save a reusable client profile to prefill future invoices.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Northwind Studio" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Contact name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sara Whitfield" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sara@northwind.co" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, city, country" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Clients() {
  const { clients } = useAppStore();
  const [q, setQ] = useState("");
  const list = clients.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.company.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="container-page py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">Reusable client profiles to prefill new invoices.</p>
        </div>
        <AddClientDialog />
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients by name or company" className="pl-8" />
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                    {c.company.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{c.company}</div>
                    <div className="text-xs text-muted-foreground">{c.name}</div>
                  </div>
                </div>
                {c.email && (
                  <a href={`mailto:${c.email}`} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground" aria-label="Email"><Mail className="h-4 w-4" /></a>
                )}
              </div>
              {c.address && <div className="mt-4 text-xs text-muted-foreground">{c.address}</div>}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-sm">
                <div><div className="text-xs text-muted-foreground">Invoices</div><div className="font-medium">{c.invoicesCount}</div></div>
                <div><div className="text-xs text-muted-foreground">Total billed</div><div className="font-medium tabular-nums">{formatMoney(c.totalBilled)}</div></div>
              </div>
            </CardContent>
          </Card>
        ))}
        {list.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-muted-foreground">No clients match your search.</div>
        )}
      </div>
    </div>
  );
}
