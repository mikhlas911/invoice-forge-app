import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatMoney, computeTotals } from "@/lib/utils/money";
import { useAppStore } from "@/lib/store/app-store";
import type { Invoice } from "@/lib/data/types";
import { ArrowUpRight, TrendingUp, AlertTriangle, FileText, Wallet, Plus } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — Ledgerly" }] }),
  component: Dashboard,
});

function invTotal(inv: Invoice) {
  return computeTotals(inv.items).total;
}

function Kpi({ label, value, hint, tone = "default", icon: Icon }: { label: string; value: string; hint?: string; tone?: "default" | "success" | "danger" | "warn"; icon: React.ComponentType<{ className?: string }> }) {
  const toneCls = tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : tone === "warn" ? "text-warning-foreground" : "text-primary";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <Icon className={`h-4 w-4 ${toneCls}`} />
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { invoices } = useAppStore();
  const totalInvoiced = invoices.reduce((s, i) => s + invTotal(i), 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + invTotal(i), 0) + invoices.filter((i) => i.status === "partial").reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = totalInvoiced - totalPaid;
  const overdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + invTotal(i), 0);
  const drafts = invoices.filter((i) => i.status === "draft").length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const paidThisMonth = invoices.filter((i) => i.status === "paid" && i.issueDate.startsWith(thisMonth)).reduce((s, i) => s + invTotal(i), 0);

  const recent = [...invoices].sort((a, b) => b.issueDate.localeCompare(a.issueDate)).slice(0, 6);

  return (
    <div className="container-page py-6 sm:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Alex</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your billing this week.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/app/invoices">View all invoices</Link></Button>
          <Button asChild size="sm"><Link to="/app/invoices/new"><Plus className="mr-1 h-4 w-4" /> New invoice</Link></Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Total invoiced" value={formatMoney(totalInvoiced)} hint="Last 90 days" icon={FileText} />
        <Kpi label="Total paid" value={formatMoney(totalPaid)} tone="success" hint="+12% vs. last month" icon={TrendingUp} />
        <Kpi label="Outstanding" value={formatMoney(outstanding)} icon={Wallet} />
        <Kpi label="Overdue" value={formatMoney(overdue)} tone="danger" hint={`${invoices.filter(i=>i.status==="overdue").length} invoice(s)`} icon={AlertTriangle} />
        <Kpi label="Drafts" value={String(drafts)} icon={FileText} />
        <Kpi label="Paid this month" value={formatMoney(paidThisMonth)} tone="success" icon={TrendingUp} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
            <CardTitle className="text-base">Recent invoices</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/invoices">View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-surface-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2.5 text-left font-medium">Invoice</th>
                    <th className="px-4 py-2.5 text-left font-medium">Client</th>
                    <th className="px-4 py-2.5 text-left font-medium">Due</th>
                    <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                    <th className="px-4 py-2.5 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((inv) => (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-surface-muted/40">
                      <td className="px-4 py-3">
                        <Link to="/app/invoices/$id" params={{ id: inv.id }} className="font-medium text-foreground hover:text-primary">
                          {inv.number}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div>{inv.clientCompany}</div>
                        <div className="text-xs text-muted-foreground">{inv.clientName}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatMoney(invTotal(inv), inv.currency)}</td>
                      <td className="px-4 py-3 text-right"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4"><CardTitle className="text-base">Status summary</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {(["paid","sent","overdue","partial","draft"] as const).map((s) => {
              const list = invoices.filter((i) => i.status === s);
              const total = list.reduce((sum, i) => sum + invTotal(i), 0);
              return (
                <div key={s} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><StatusBadge status={s} /><span className="text-muted-foreground">{list.length}</span></div>
                  <div className="tabular-nums">{formatMoney(total)}</div>
                </div>
              );
            })}
            <div className="mt-2 border-t border-border pt-3">
              <div className="text-xs text-muted-foreground">Quick actions</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline"><Link to="/app/invoices/new">Create invoice</Link></Button>
                <Button asChild size="sm" variant="outline"><Link to="/app/clients">Add client</Link></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
