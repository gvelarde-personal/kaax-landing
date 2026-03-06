"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Users, CreditCard, Loader2, Trash2, Edit, MoreHorizontal,
  TrendingUp, CheckCircle2, XCircle, Clock, BadgeDollarSign, MessageCircle,
} from "lucide-react";

import { useLeads, useUpdateLead, useDeleteLead } from "@/hooks/use-leads";
import { type Lead, type Subscription, type LeadUpdateInput } from "@/types";
import { Logo } from "@/components/Logo";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const STATUS_LABELS: Record<string, string> = {
  new: "Nuevo", contacted: "Contactado", qualified: "Calificado", lost: "Perdido",
};
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  qualified: "bg-green-500/10 text-green-400 border-green-500/20",
  lost: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};
function whatsappGreetingUrl(lead: Lead): string | null {
  if (!lead.phone) return null;
  const digits = lead.phone.replace(/\D/g, "");
  const nombre = lead.name.split(" ")[0];
  const empresa = lead.company ? ` de ${lead.company}` : "";
  const msg = `Hola ${nombre}${empresa}, soy de Kaax AI. Me comunico porque mostraste interés en nuestro agente de WhatsApp para automatizar ventas. ¿Tienes un momento para platicar?`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

const SUB_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  past_due: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://auth.kaax.ai";

function useSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: [`${API_URL}/subscriptions`],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/subscriptions`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      return await res.json();
    },
  });
}

export default function Admin() {
  const { data: leads = [], isLoading: leadsLoading } = useLeads();
  const { data: subscriptions = [], isLoading: subsLoading } = useSubscriptions();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();

  const [activeTab, setActiveTab] = useState<"leads" | "ventas">("leads");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const editForm = useForm<LeadUpdateInput>({ defaultValues: { status: "new", notes: "" } });

  const openEdit = (lead: Lead) => {
    editForm.reset({ status: lead.status, notes: lead.notes || "" });
    setEditingLead(lead);
  };
  const onEditSubmit = (data: LeadUpdateInput) => {
    if (!editingLead) return;
    updateLead({ id: editingLead.id, ...data }, { onSuccess: () => setEditingLead(null) });
  };
  const confirmDelete = () => {
    if (!deletingLead) return;
    deleteLead(deletingLead.id, { onSuccess: () => setDeletingLead(null) });
  };

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const activeSubs = subscriptions.filter(s => s.status === 'active').length;
  const totalMrr = activeSubs * 18000;
  const testSubs = subscriptions.filter(s => s.mode === 'test').length;

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-zinc-950 text-foreground">

        <aside className="w-64 border-r border-white/5 bg-zinc-950/50 hidden md:flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo className="w-8 h-8" />
              <span className="font-display font-bold text-lg tracking-tight">Kaax AI</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start font-medium ${activeTab === "leads" ? "bg-white/5" : "text-muted-foreground hover:text-white"}`}
              onClick={() => setActiveTab("leads")}
              data-testid="nav-leads"
            >
              <Users className="w-4 h-4 mr-3" /> Leads
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start font-medium ${activeTab === "ventas" ? "bg-white/5" : "text-muted-foreground hover:text-white"}`}
              onClick={() => setActiveTab("ventas")}
              data-testid="nav-ventas"
            >
              <CreditCard className="w-4 h-4 mr-3" /> Ventas / Stripe
            </Button>
          </nav>
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-zinc-950/50">
            <h1 className="text-xl font-display font-semibold">
              {activeTab === "leads" ? "Gestión de Leads" : "Ventas y Suscripciones"}
            </h1>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-white/10">Ver Landing Page</Button>
            </Link>
          </header>

          <div className="flex-1 overflow-auto p-8">

            {/* ── LEADS TAB ─────────────────────────────────────────── */}
            {activeTab === "leads" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-white/5 border-white/5 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Capturados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-display font-bold" data-testid="stat-total-leads">{totalLeads}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/5 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Necesitan Atención</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-display font-bold text-blue-400" data-testid="stat-new-leads">{newLeads}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/5 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Calificados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-display font-bold text-green-400" data-testid="stat-qualified-leads">{qualifiedLeads}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-white/5 bg-black/20">
                  {leadsLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="w-12 h-12 mb-4 opacity-20" />
                      <p>No hay leads capturados aún.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-white/5">
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="font-medium text-zinc-400">Prospecto</TableHead>
                          <TableHead className="font-medium text-zinc-400">Contacto</TableHead>
                          <TableHead className="font-medium text-zinc-400">Estado</TableHead>
                          <TableHead className="font-medium text-zinc-400">Recibido</TableHead>
                          <TableHead className="text-right font-medium text-zinc-400">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 transition-colors" data-testid={`row-lead-${lead.id}`}>
                            <TableCell>
                              <div className="font-medium">{lead.name}</div>
                              <div className="text-xs text-muted-foreground">{lead.company || "Sin Empresa"}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{lead.email}</div>
                              <div className="text-xs text-muted-foreground">{lead.phone || "-"}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`capitalize ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                                {STATUS_LABELS[lead.status] || lead.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {lead.createdAt ? format(new Date(lead.createdAt), "d MMM, h:mm a") : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" data-testid={`menu-lead-${lead.id}`}>
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white">
                                  {whatsappGreetingUrl(lead) ? (
                                    <DropdownMenuItem asChild>
                                      <a
                                        href={whatsappGreetingUrl(lead)!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer hover:bg-[#25D366]/10 text-[#25D366] focus:bg-[#25D366]/10 focus:text-[#25D366] flex items-center"
                                        data-testid={`whatsapp-lead-${lead.id}`}
                                      >
                                        <MessageCircle className="w-4 h-4 mr-2" /> Saludar por WhatsApp
                                      </a>
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem disabled className="text-zinc-600 cursor-not-allowed">
                                      <MessageCircle className="w-4 h-4 mr-2" /> Sin teléfono registrado
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => openEdit(lead)} className="cursor-pointer hover:bg-white/10">
                                    <Edit className="w-4 h-4 mr-2" /> Actualizar Estado
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-white/10" />
                                  <DropdownMenuItem onClick={() => setDeletingLead(lead)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar Lead
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Card>
              </>
            )}

            {/* ── VENTAS TAB ────────────────────────────────────────── */}
            {activeTab === "ventas" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-white/5 border-white/5 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> MRR Activo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-display font-bold text-primary" data-testid="stat-mrr">
                        ${totalMrr.toLocaleString("es-MX")}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">MXN / mes</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/5 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" /> Activas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-display font-bold text-green-400" data-testid="stat-active-subs">{activeSubs}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/5 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BadgeDollarSign className="w-4 h-4" /> Total Registradas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-display font-bold" data-testid="stat-total-subs">{subscriptions.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/5 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-400" /> En modo prueba
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-display font-bold text-yellow-400" data-testid="stat-test-subs">{testSubs}</div>
                    </CardContent>
                  </Card>
                </div>

                {testSubs > 0 && (
                  <div className="mb-6 flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm px-4 py-3 rounded-lg">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Hay <strong>{testSubs}</strong> suscripción(es) en modo <strong>Test</strong>. Cambia a claves <code>sk_live_</code> cuando estés listo para producción.</span>
                  </div>
                )}

                <Card className="border-white/5 bg-black/20">
                  {subsLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : subscriptions.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                      <CreditCard className="w-12 h-12 mb-4 opacity-20" />
                      <p>No hay suscripciones aún.</p>
                      <p className="text-xs mt-2 max-w-xs text-center">Las ventas aparecerán aquí cuando un cliente complete el pago en Stripe.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-white/5">
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="font-medium text-zinc-400">Cliente</TableHead>
                          <TableHead className="font-medium text-zinc-400">Plan</TableHead>
                          <TableHead className="font-medium text-zinc-400">Monto</TableHead>
                          <TableHead className="font-medium text-zinc-400">Estado</TableHead>
                          <TableHead className="font-medium text-zinc-400">Modo</TableHead>
                          <TableHead className="font-medium text-zinc-400">Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscriptions.map((sub) => (
                          <TableRow key={sub.id} className="border-white/5 hover:bg-white/5 transition-colors" data-testid={`row-sub-${sub.id}`}>
                            <TableCell>
                              <div className="font-medium">{sub.customerName || "—"}</div>
                              <div className="text-xs text-muted-foreground">{sub.customerEmail}</div>
                            </TableCell>
                            <TableCell className="text-sm capitalize">{sub.plan.replace("_", " ")}</TableCell>
                            <TableCell className="text-sm font-mono">
                              ${sub.amountMxn.toLocaleString("es-MX")} MXN
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`capitalize ${SUB_STATUS_COLORS[sub.status] || ""}`}>
                                {sub.status === "active" ? <><CheckCircle2 className="w-3 h-3 mr-1" />Activa</> : 
                                 sub.status === "cancelled" ? <><XCircle className="w-3 h-3 mr-1" />Cancelada</> : sub.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={sub.mode === "test" ? "text-yellow-400 border-yellow-500/20 bg-yellow-500/10" : "text-green-400 border-green-500/20 bg-green-500/10"}>
                                {sub.mode === "test" ? "Test" : "Live"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {sub.createdAt ? format(new Date(sub.createdAt), "d MMM yyyy") : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Card>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLead} onOpenChange={(open) => !open && setEditingLead(null)}>
        <DialogContent className="bg-zinc-950 border-white/10 text-foreground sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">Actualizar Lead</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Actualiza el estado y notas para {editingLead?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Estado</label>
              <Select value={editForm.watch("status")} onValueChange={(val) => editForm.setValue("status", val)}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white" data-testid="select-status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="new">Nuevo</SelectItem>
                  <SelectItem value="contacted">Contactado</SelectItem>
                  <SelectItem value="qualified">Calificado</SelectItem>
                  <SelectItem value="lost">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Notas Internas</label>
              <Textarea
                placeholder="Escribe notas aquí..."
                className="bg-black/50 border-white/10 min-h-[100px] resize-none text-white"
                data-testid="input-notes"
                {...editForm.register("notes")}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingLead(null)} className="border-white/10 hover:bg-white/5 text-white">Cancelar</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isUpdating} data-testid="button-save-lead">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingLead} onOpenChange={(open) => !open && setDeletingLead(null)}>
        <DialogContent className="bg-zinc-950 border-white/10 text-foreground sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Eliminar Lead
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              ¿Estás seguro de que deseas eliminar permanentemente a <strong>{deletingLead?.name}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setDeletingLead(null)} className="border-white/10 hover:bg-white/5 text-white">Cancelar</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting} data-testid="button-confirm-delete">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sí, Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
