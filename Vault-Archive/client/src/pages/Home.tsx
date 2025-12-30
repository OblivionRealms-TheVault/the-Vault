import { useState, useEffect } from "react";
import { useFiles } from "@/hooks/use-files";
import { useAuthStatus, useLogout } from "@/hooks/use-auth";
import { FileCard } from "@/components/FileCard";
import { GlitchText } from "@/components/GlitchText";
import { CreateFileModal } from "@/components/CreateFileModal";
import { LoginModal } from "@/components/LoginModal";
import { ReturnVisitorMessage } from "@/components/ReturnVisitorMessage";
import { Loader2, Terminal, ShieldAlert, Lock, LogOut, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "ANOMALY" | "ENVIRONMENTAL" | "DISCOVERY">("ALL");
  const [scrollProgress, setScrollProgress] = useState(0);
  const { data: files, isLoading, error } = useFiles();
  const { data: authStatus } = useAuthStatus();
  const { mutate: logout } = useLogout();

  // Track scroll progress and save it to localStorage
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / scrollHeight;
      const progress = Math.min(scrolled, 1);
      setScrollProgress(progress);
      
      // Save scroll position to localStorage
      localStorage.setItem("vaultScrollProgress", progress.toString());
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-primary font-mono text-sm tracking-widest animate-pulse">ESTABLISHING SECURE CONNECTION...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="border border-destructive p-8 max-w-md text-center bg-destructive/5 backdrop-blur-sm">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-display text-destructive mb-2">CONNECTION TERMINATED</h2>
          <p className="text-muted-foreground font-mono text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const sortedFiles = files?.sort((a, b) => a.id - b.id) || [];

  return (
    <div className="relative" style={{ 
      backgroundColor: `rgb(${Math.floor(5 + scrollProgress * 3)}, ${Math.floor(2 + scrollProgress * 2)}, ${Math.floor(2 + scrollProgress * 2)})`
    }}>
      {/* Return visitor message */}
      <ReturnVisitorMessage />
      
      {/* Ambient fog overlay for dreamlike effect */}
      <div className="fog-overlay" />
      
      {/* Floating ambient symbols */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <Eye className="float-symbol" style={{ top: "10%", left: "5%", fontSize: "2rem", animation: "float-symbols 8s ease-in-out infinite" }} />
        <Eye className="float-symbol" style={{ top: "20%", right: "8%", fontSize: "1.5rem", animation: "float-symbols 10s ease-in-out infinite 2s" }} />
        <div className="absolute ambient-pulse" style={{ top: "30%", left: "15%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="absolute ambient-pulse" style={{ bottom: "10%", right: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(255,0,0,0.05) 0%, transparent 70%)", borderRadius: "50%", animationDelay: "1s" }} />
      </div>

    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto relative z-10">
      {/* Header Section - Cinematic entrance */}
      <header className="mb-16 border-b border-primary/30 pb-8 flex flex-col md:flex-row justify-between items-end gap-6 scroll-section-content" style={{ 
        animation: "fade-in-up 1.5s ease-out" 
      }}>
        <div>
          <div className="flex items-center gap-3 text-primary/60 mb-2 font-mono text-xs tracking-[0.2em]">
            <Terminal className="w-4 h-4" />
            <span>SECURE TERMINAL ACCESS // V.4.0.2</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tighter mb-2 glow-heading">
            <GlitchText text="THE VAULT" />
          </h1>
          <p className="text-muted-foreground max-w-xl font-mono text-sm leading-relaxed border-l-2 border-primary/30 pl-4 mt-4">
            CLASSIFIED ARCHIVE containing records of paranormal entities, anomalies, and containment procedures. Unauthorized access is punishable by immediate termination.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {authStatus?.authenticated ? (
            <>
              <CreateFileModal />
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="border-primary/50 text-primary hover:bg-primary/10 font-mono uppercase tracking-widest text-xs"
              >
                <LogOut className="w-3 h-3 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setLoginOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest uppercase text-xs shadow-[0_0_15px_rgba(255,0,0,0.2)]"
            >
              <Lock className="w-3 h-3 mr-2" /> Admin Access
            </Button>
          )}
        </div>
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />

      {/* Stats Bar - Fade in with delay */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 border-y border-white/5 py-4 scroll-section-content" style={{ 
        animation: "fade-in-up 1.5s ease-out 0.3s both" 
      }}>
        <div className="text-center">
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Total Records</div>
          <div className="text-2xl font-display text-primary">{files?.length || 0}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Locked Files</div>
          <div className="text-2xl font-display text-foreground">{files?.filter(f => f.isLocked).length || 0}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Omega Level</div>
          <div className="text-2xl font-display text-destructive">{files?.filter(f => f.severity === 'OMEGA').length || 0}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">System Status</div>
          <div className="text-xl font-display text-green-500 animate-pulse">ONLINE</div>
        </div>
      </div>

      {/* Category Filter - Gentle entrance */}
      <div className="flex gap-2 mb-8 flex-wrap scroll-section-content" style={{ 
        animation: "fade-in-up 1.5s ease-out 0.5s both" 
      }}>
        {["ALL", "ANOMALY", "ENVIRONMENTAL", "DISCOVERY"].map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category as any)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border rounded-md transition-colors ${
              categoryFilter === category
                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                : "border-primary/30 text-primary/70 hover:border-primary/50 hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid - Files appear with staggered animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-section-content" style={{ 
        animation: "fade-in-up 1.5s ease-out 0.7s both" 
      }}>
        {sortedFiles
          .filter(file => categoryFilter === "ALL" || file.fileType === categoryFilter)
          .map((file, idx) => (
            <FileCard key={file.id} file={file} index={idx} />
          ))}
        
        {sortedFiles.filter(file => categoryFilter === "ALL" || file.fileType === categoryFilter).length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-lg">
            <p className="text-muted-foreground font-mono tracking-widest">NO RECORDS FOUND IN THIS CATEGORY</p>
          </div>
        )}
      </div>

      {/* Oblivion Reach Lore Section - Dreamlike reveal */}
      <div className="mt-24 pt-12 border-t border-primary/30 scroll-section-content" style={{ 
        animation: "fade-in-up 1.5s ease-out 1s both" 
      }}>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-primary tracking-tighter mb-2 glow-heading">
          <GlitchText text="OBLIVION REACH" />
        </h2>
        <p className="text-muted-foreground font-mono text-xs tracking-widest mb-12 text-primary/60">
          CLASSIFIED WORLDLORE // CONTEXTUAL ARCHIVES
        </p>

        <div className="space-y-12">
          {/* The Land - Gentle floating entrance */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="border-l-2 border-primary/50 pl-6 py-4 relative drift-slow"
            style={{ animationPlayState: "paused" }}
          >
            <h3 className="text-2xl font-display text-primary tracking-widest mb-4">THE LAND</h3>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed">
              Oblivion Reach is a place where the natural world has turned against itself. Mountains jut from the earth like broken teeth, forests grow in impossible spirals, and swamps release mists that cling to your skin. The land shifts without warning, paths vanish, and cliffs crumble as if to swallow the unwary. Time here feels distorted; nights stretch long, and shadows move in ways that defy logic.
            </p>
          </motion.div>

          {/* The Creatures - Subtle delay */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="border-l-2 border-primary/50 pl-6 py-4"
          >
            <h3 className="text-2xl font-display text-primary tracking-widest mb-4">THE CREATURES</h3>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed">
              The monsters of Oblivion Reach are varied and vicious, each adapted to hunt in this cursed wilderness. Some stalk silently through dense fog, others leap from the trees with jagged claws and teeth. Eyes glow where you expect none. Many are unseen, but their presence is felt—a low growl, the snap of a branch, or a whisper in the wind. Few dare study them, for curiosity is often fatal.
            </p>
          </motion.div>

          {/* Survival - Measured reveal */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="border-l-2 border-primary/50 pl-6 py-4"
          >
            <h3 className="text-2xl font-display text-primary tracking-widest mb-4">SURVIVAL</h3>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed">
              In Oblivion Reach, survival is a constant struggle. Travelers must move carefully, trust no one, and always watch the shadows. Simple mistakes can turn deadly: a misstep on a cliff, a pause in a clearing, or an ill-timed glance at the wrong creature can end a life in seconds. The only law is to endure, adapt, or perish.
            </p>
          </motion.div>

          {/* History & Mystery - Deeper reveal */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="border-l-2 border-primary/50 pl-6 py-4"
          >
            <h3 className="text-2xl font-display text-primary tracking-widest mb-4">HISTORY & MYSTERY</h3>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed">
              Legends say Oblivion Reach was once a thriving land, but something ancient and cruel reshaped it into its current nightmare form. Ruined structures and forgotten altars dot the landscape, whispering of a civilization that vanished without a trace. Those brave—or foolish—enough to explore may uncover artifacts or knowledge, but many who do are never seen again.
            </p>
          </motion.div>

          {/* Whispers - Final unsettling reveal */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="border-l-2 border-destructive/50 pl-6 py-4 bg-destructive/5 px-6 pulse-glow"
          >
            <h3 className="text-2xl font-display text-destructive tracking-widest mb-4">WHISPERS</h3>
            <p className="text-destructive/80 font-mono text-sm leading-relaxed italic">
              Sometimes, when the wind dies, you can hear it: whispers of the lost, echoes of screams, and unintelligible voices carried across the jagged cliffs. It is unclear if these are warnings, taunts, or the very land itself speaking.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Commissions Section */}
      <div className="mt-32 pt-12 border-t border-primary/30 scroll-section-content" style={{ 
        animation: "fade-in-up 1.5s ease-out 1.3s both" 
      }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="border border-primary/30 p-8 md:p-12 bg-black/40 backdrop-blur-sm relative"
        >
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />

          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary tracking-tighter mb-2 glow-heading">
            COMMISSIONS
          </h2>
          <p className="text-muted-foreground font-mono text-xs tracking-widest mb-8 text-primary/60">
            CUSTOM MONSTER & ENVIRONMENT CREATION SERVICE
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Commission Types */}
            <div className="border-l-2 border-primary/50 pl-6">
              <h3 className="text-lg font-display text-primary tracking-widest mb-3">MONSTER COMMISSION</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4">
                Have us catalog a monster from your imagination. Describe its appearance, behavior, habitat, and weaknesses—we'll add it to The Vault's archives.
              </p>
              <p className="font-mono text-sm text-primary font-bold">$10.00</p>
            </div>

            <div className="border-l-2 border-primary/50 pl-6">
              <h3 className="text-lg font-display text-primary tracking-widest mb-3">ENVIRONMENT COMMISSION</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4">
                Commission a custom location or environment for the archives. We'll document its geography, hazards, atmosphere, and unique characteristics.
              </p>
              <p className="font-mono text-sm text-primary font-bold">$10.00</p>
            </div>
          </div>

          {/* Discord Contact Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={() => window.open("https://discord.com/users/vrbuzzhoney", "_blank")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest uppercase text-sm shadow-[0_0_15px_rgba(255,0,0,0.2)] flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Message on Discord
            </Button>
            <span className="text-muted-foreground font-mono text-xs">
              dm @vrbuzzhoney on Discord • include your commission details
            </span>
          </div>

          <p className="text-muted-foreground font-mono text-xs mt-6 italic">
            Turnaround: 3-7 days depending on complexity. Custom artwork and lore included.
          </p>
        </motion.div>
      </div>

      <footer className="mt-24 text-center text-xs text-white/20 font-mono tracking-widest scroll-section-content" style={{ 
        animation: "fade-in-up 1.5s ease-out 1.4s both" 
      }}>
        PROPERTY OF THE FOUNDATION. DO NOT DISTRIBUTE.
      </footer>
      
      {/* Background CRT Scanline Effect */}
      <div className="crt-scanline" />
    </div>
    </div>
  );
}
