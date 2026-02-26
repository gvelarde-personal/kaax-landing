import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { type LeadInput } from "@shared/routes";
import { useCreateLead } from "@/hooks/use-leads";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Zap, BarChart3, Clock, Sparkles, Target, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { mutate: createLead, isPending } = useCreateLead();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<LeadInput>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
    }
  });

  const onSubmit = (data: LeadInput) => {
    createLead(data, {
      onSuccess: () => setIsSubmitted(true)
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen AI Sales Agents</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-tight">
              Automate your sales funnel with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 text-glow">intelligent agents.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Identify qualified leads, engage them instantly, and close more deals with a 24/7 AI-powered CRM system that never sleeps.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#capture" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-glow hover-elevate">
                  Start Capturing Leads
                </Button>
              </a>
              <a href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-white/10 hover:bg-white/5">
                  View Features
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-950 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Unfair Advantage.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Equip your team with tools that turn cold traffic into ready-to-close pipeline automatically.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl hover-elevate group">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Instant Qualification</h3>
              <p className="text-muted-foreground leading-relaxed">AI analyzes incoming prospects instantly, separating noise from high-intent buyers so you focus on what matters.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl hover-elevate group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">24/7 Availability</h3>
              <p className="text-muted-foreground leading-relaxed">Engage users the moment they show interest, regardless of time zone. Speed to lead is your new superpower.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl hover-elevate group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Actionable Insights</h3>
              <p className="text-muted-foreground leading-relaxed">Comprehensive dashboarding to track conversion rates, pipeline velocity, and team performance metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="capture" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to scale your sales?</h2>
              <p className="text-xl text-muted-foreground mb-8">Join top-tier tech companies using AgentFlow to supercharge their go-to-market motion.</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-lg">Setup in under 5 minutes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-lg">Seamless CRM integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-lg">Customizable AI behaviors</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-8 md:p-10 rounded-3xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl pointer-events-none" />
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Request Received!</h3>
                  <p className="text-muted-foreground mb-8 text-lg">Our AI agent has already processed your details. We'll be in touch shortly.</p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)} className="border-white/10">
                    Submit Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Jane Doe" 
                      className="bg-black/50 border-white/10 focus-visible:border-primary h-12"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Work Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="jane@company.com" 
                      className="bg-black/50 border-white/10 focus-visible:border-primary h-12"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-zinc-300">Company (Optional)</Label>
                      <Input 
                        id="company" 
                        placeholder="Acme Inc" 
                        className="bg-black/50 border-white/10 focus-visible:border-primary h-12"
                        {...form.register("company")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-zinc-300">Phone (Optional)</Label>
                      <Input 
                        id="phone" 
                        placeholder="+1 (555) 000-0000" 
                        className="bg-black/50 border-white/10 focus-visible:border-primary h-12"
                        {...form.register("phone")}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg mt-4 bg-primary hover:bg-primary/90 text-white"
                    disabled={isPending}
                  >
                    {isPending ? "Processing..." : "Get Priority Access"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-white/5 py-12 text-center text-zinc-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bot className="w-5 h-5" />
          <span className="font-display font-semibold text-white">AgentFlow</span>
        </div>
        <p>© 2024 AgentFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
