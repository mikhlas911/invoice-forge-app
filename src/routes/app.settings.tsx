import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CURRENCIES, BUSINESS_PROFILE } from "@/lib/demo-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Ledgerly" }] }),
  component: Settings,
});

const TEMPLATES = [
  { id: "minimal", label: "Minimal", desc: "Clean, single-column" },
  { id: "classic", label: "Classic", desc: "Structured, table-forward" },
  { id: "modern", label: "Modern", desc: "Bold typography" },
];

function Settings() {
  const [template, setTemplate] = useState("classic");
  const [currency, setCurrency] = useState("USD");
  const [tax, setTax] = useState(8);
  const [prefix, setPrefix] = useState("INV-2026-");

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground">Business profile, invoice defaults and preferences.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="py-4"><CardTitle className="text-sm">Business profile</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-1.5"><Label>Business name</Label><Input defaultValue={BUSINESS_PROFILE.name} /></div>
            <div className="space-y-1.5"><Label>Owner</Label><Input defaultValue={BUSINESS_PROFILE.ownerName} /></div>
            <div className="space-y-1.5"><Label>Billing email</Label><Input type="email" defaultValue={BUSINESS_PROFILE.email} /></div>
            <div className="space-y-1.5"><Label>Address</Label><Textarea rows={2} defaultValue={BUSINESS_PROFILE.address} /></div>
            <div className="space-y-1.5"><Label>Tax ID</Label><Input defaultValue={BUSINESS_PROFILE.taxId} /></div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm">Invoice defaults</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Default currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Default tax rate (%)</Label><Input type="number" value={tax} onChange={(e) => setTax(+e.target.value)} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Invoice number prefix</Label><Input value={prefix} onChange={(e) => setPrefix(e.target.value)} /><p className="text-xs text-muted-foreground">Next invoice will be numbered {prefix}0043.</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm">Invoice template</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => setTemplate(t.id)} className={`rounded-lg border p-4 text-left transition-colors ${template === t.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm">Preferences</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Theme is toggled from the top bar. Use the sun/moon icon to switch between light and dark.
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
      </div>
    </div>
  );
}
