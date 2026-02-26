import { useState, useEffect } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Users, LayoutDashboard, Settings, Loader2, Trash2, Edit, MoreHorizontal, LogIn
} from "lucide-react";

import { useLeads, useUpdateLead, useDeleteLead } from "@/hooks/use-leads";
import { type Lead } from "@shared/schema";
import { type LeadUpdateInput } from "@shared/routes";
import { Logo } from "@/components/Logo";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Simple hook to check Replit Auth status
function useReplitAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/_replauth")
      .then(res => {
        if (res.status === 401) return null;
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { user, loading };
}

  const STATUS_LABELS: Record<string, string> = {
    new: "Nuevo",
    contacted: "Contactado",
    qualified: "Calificado",
    lost: "Perdido",
  };

  const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    qualified: "bg-green-500/10 text-green-400 border-green-500/20",
    lost: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

export default function Admin() {
  const { user, loading: authLoading } = useReplitAuth();
  const { data: leads = [], isLoading } = useLeads();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const editForm = useForm<LeadUpdateInput>({
    // We only need status and notes for the quick edit
    defaultValues: {
      status: "new",
      notes: "",
    }
  });

  const openEdit = (lead: Lead) => {
    editForm.reset({ status: lead.status, notes: lead.notes || "" });
    setEditingLead(lead);
  };

  const onEditSubmit = (data: LeadUpdateInput) => {
    if (!editingLead) return;
    updateLead({ id: editingLead.id, ...data }, {
      onSuccess: () => setEditingLead(null)
    });
  };

  const confirmDelete = () => {
    if (!deletingLead) return;
    deleteLead(deletingLead.id, {
      onSuccess: () => setDeletingLead(null)
    });
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
        <Logo className="w-20 h-20 mb-8" />
        <h1 className="text-3xl font-display font-bold mb-4">Acceso Restringido</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          El panel de administración es privado. Por favor, inicia sesión con tu cuenta de Replit para continuar.
        </p>
        <Button 
          onClick={() => window.location.href = `/_replauth?redirect_url=${window.location.href}`}
          className="bg-primary hover:bg-primary/90 h-12 px-8 text-white font-bold"
        >
          <LogIn className="w-4 h-4 mr-2" /> Iniciar Sesión con Replit
        </Button>
      </div>
    );
  }

  // Derived stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-zinc-950 text-foreground">
        
        {/* Simple Sidebar directly in the page for containment */}
        <aside className="w-64 border-r border-white/5 bg-zinc-950/50 hidden md:flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo className="w-8 h-8" />
              <span className="font-display font-bold text-lg tracking-tight">Kaax AI</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-white/5 font-medium">
              <Users className="w-4 h-4 mr-3" />
              Leads
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white">
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard (Soon)
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-zinc-950/50">
            <h1 className="text-xl font-display font-semibold">Gestión de Leads</h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/10">Ver Landing Page</Button>
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/5 border-white/5 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Capturados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold">{totalLeads}</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/5 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Necesitan Atención</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-blue-400">{newLeads}</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/5 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Calificados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-green-400">{qualifiedLeads}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/5 bg-black/20">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : leads.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                  <Users className="w-12 h-12 mb-4 opacity-20" />
                  <p>No leads captured yet.</p>
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
                      <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 transition-colors">
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
                          {lead.createdAt ? format(new Date(lead.createdAt), "d MMM, h:mm a") : "Desconocido"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white">
                              <DropdownMenuItem onClick={() => openEdit(lead)} className="cursor-pointer hover:bg-white/10">
                                <Edit className="w-4 h-4 mr-2" /> Actualizar Estado
                              </DropdownMenuItem>
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
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLead} onOpenChange={(open) => !open && setEditingLead(null)}>
        <DialogContent className="bg-zinc-950 border-white/10 text-foreground sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">Actualizar Lead</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Actualiza el estado del embudo y notas internas para {editingLead?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Estado</label>
              <Select 
                value={editForm.watch("status")} 
                onValueChange={(val) => editForm.setValue("status", val)}
              >
                <SelectTrigger className="bg-black/50 border-white/10 text-white">
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
                {...editForm.register("notes")}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingLead(null)} className="border-white/10 hover:bg-white/5 text-white">
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingLead} onOpenChange={(open) => !open && setDeletingLead(null)}>
        <DialogContent className="bg-zinc-950 border-white/10 text-foreground sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Eliminar Lead
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              ¿Estás seguro de que deseas eliminar permanentemente al lead <strong>{deletingLead?.name}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setDeletingLead(null)} className="border-white/10 hover:bg-white/5 text-white">
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sí, Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
