import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Logo } from "@/lib/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet, SheetContent, SheetTrigger,
} from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, FileText, Users, Settings, Plus, Menu, Search, Sun, Moon, LogOut, User } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const NAV = [
  { to: "/app" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/invoices" as const, label: "Invoices", icon: FileText },
  { to: "/app/clients" as const, label: "Clients", icon: Users },
  { to: "/app/settings" as const, label: "Settings", icon: Settings },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {NAV.map((n) => {
        const active = n.exact ? pathname === n.to : pathname === n.to || pathname.startsWith(n.to + "/");
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
              active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            }`}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Logo />
      </div>
      <div className="p-3">
        <Button asChild size="sm" className="w-full justify-start gap-2">
          <Link to="/app/invoices/new"><Plus className="h-4 w-4" /> New invoice</Link>
        </Button>
      </div>
      <SidebarNav />
      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-medium text-accent-foreground">AM</div>
          <div className="min-w-0 text-sm">
            <div className="truncate font-medium">Alex Morgan</div>
            <div className="truncate text-xs text-muted-foreground">Fieldwork Studio</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDark(!dark)}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function TopBar() {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b border-border px-5"><Logo /></div>
          <SidebarNav />
        </SheetContent>
      </Sheet>
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search invoices, clients…" className="h-9 pl-8" />
      </div>
      <div className="flex-1 sm:hidden" />
      <div className="flex items-center gap-1.5">
        <Button asChild size="sm" className="hidden sm:inline-flex"><Link to="/app/invoices/new"><Plus className="mr-1 h-4 w-4" /> New</Link></Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-medium text-accent-foreground" aria-label="Account">AM</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5 text-sm">
              <div className="font-medium">Alex Morgan</div>
              <div className="text-xs text-muted-foreground">alex@fieldwork.studio</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => nav({ to: "/app/settings" })}><User className="mr-2 h-4 w-4" /> Profile & settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => nav({ to: "/" })}><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
