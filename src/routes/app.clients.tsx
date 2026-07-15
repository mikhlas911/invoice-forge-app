import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CLIENTS, formatMoney } from "@/lib/demo-data";
import { Plus, Search, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/clients")({
  head: () => ({ meta: [{ title: "Clients — Ledgerly" }] }),
  component: Clients,
});

function Clients() {
  const [q, setQ] = useState("");
  const list = CLIENTS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.company.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="container-page py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">Reusable client profiles to prefill new invoices.</p>
        </div>
        <Button size="sm" onClick={() => toast("Add client — demo")}><Plus className="mr-1 h-4 w-4" /> Add client</Button>
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
                <a href={`mailto:${c.email}`} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground" aria-label="Email"><Mail className="h-4 w-4" /></a>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">{c.address}</div>
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
