import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Bot, Users, LayoutDashboard, Settings, Loader2, Trash2, Edit, MoreHorizontal
} from "lucide-react";

import { useLeads, useUpdateLead, useDeleteLead } from "@/hooks/use-leads";
import { type Lead } from "@shared/schema";
import { type LeadUpdateInput } from "@shared/routes";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  qualified: "bg-green-500/10 text-green-400 border-green-500/20",
  lost: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function Admin() {
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
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">AgentFlow</span>
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
            <h1 className="text-xl font-display font-semibold">Lead Management</h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/10">View Landing Page</Button>
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/5 border-white/5 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Captured</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold">{totalLeads}</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/5 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Needs Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-blue-400">{newLeads}</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/5 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Qualified</CardTitle>
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
                      <TableHead className="font-medium text-zinc-400">Prospect</TableHead>
                      <TableHead className="font-medium text-zinc-400">Contact</TableHead>
                      <TableHead className="font-medium text-zinc-400">Status</TableHead>
                      <TableHead className="font-medium text-zinc-400">Received</TableHead>
                      <TableHead className="text-right font-medium text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">{lead.company || "No Company"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{lead.email}</div>
                          <div className="text-xs text-muted-foreground">{lead.phone || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {lead.createdAt ? format(new Date(lead.createdAt), "MMM d, h:mm a") : "Unknown"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10">
                              <DropdownMenuItem onClick={() => openEdit(lead)} className="cursor-pointer hover:bg-white/10">
                                <Edit className="w-4 h-4 mr-2" /> Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeletingLead(lead)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Lead
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
            <DialogTitle>Update Lead</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update pipeline status and internal notes for {editingLead?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Status</label>
              <Select 
                value={editForm.watch("status")} 
                onValueChange={(val) => editForm.setValue("status", val)}
              >
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Internal Notes</label>
              <Textarea 
                placeholder="Met at conference, looking for Q3 deployment..."
                className="bg-black/50 border-white/10 min-h-[100px] resize-none"
                {...editForm.register("notes")}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingLead(null)} className="border-white/10 hover:bg-white/5">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
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
              <Trash2 className="w-5 h-5" /> Delete Lead
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              Are you sure you want to permanently delete the lead <strong>{deletingLead?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setDeletingLead(null)} className="border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
