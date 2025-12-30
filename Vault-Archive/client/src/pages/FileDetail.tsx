import { useFile } from "@/hooks/use-files";
import { useAuthStatus } from "@/hooks/use-auth";
import { Link, useRoute } from "wouter";
import { Loader2, ArrowLeft, ShieldAlert, Lock, Hash, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GlitchText } from "@/components/GlitchText";
import { EditFileModal } from "@/components/EditFileModal";
import { FileDetailTabs } from "@/components/FileDetailTabs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function FileDetail() {
  const [, params] = useRoute("/file/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: file, isLoading, error } = useFile(id);
  const { data: authStatus } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-primary gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs">LOADING</div>
        </div>
        <div className="font-mono tracking-[0.3em] animate-pulse">DECRYPTING FILE DATA...</div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-destructive bg-destructive/5 p-8 text-center backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10" />
          <ShieldAlert className="w-20 h-20 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold text-destructive mb-2 tracking-widest">ACCESS DENIED</h1>
          <p className="font-mono text-destructive/80 mb-8 text-sm">
            The requested file does not exist or your security clearance is insufficient. This incident has been logged.
          </p>
          <Link href="/">
            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-black font-mono tracking-widest uppercase">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Safety
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOmega = file.severity === 'OMEGA';

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 lg:p-12 relative overflow-hidden text-foreground">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="w-full h-full bg-[linear-gradient(rgba(20,20,20,0.8)_2px,transparent_2px),linear-gradient(90deg,rgba(20,20,20,0.8)_2px,transparent_2px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary pl-0 hover:bg-transparent transition-colors group font-mono tracking-widest text-xs">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              RETURN TO ARCHIVE
            </Button>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "bg-zinc-950 border relative p-8 md:p-12 shadow-2xl overflow-hidden",
            isOmega ? "border-destructive/60 shadow-destructive/10" : "border-primary/30 shadow-primary/5"
          )}
        >
          {/* Document Header Stamps */}
          <div className="absolute top-6 right-6 md:top-10 md:right-10 flex flex-col items-end gap-2 opacity-80 pointer-events-none select-none rotate-[-5deg]">
            <div className={cn(
              "border-4 font-display font-bold text-2xl md:text-4xl px-4 py-1 uppercase tracking-widest",
              isOmega ? "border-destructive text-destructive" : "border-primary text-primary"
            )}>
              {file.isLocked ? "TOP SECRET" : "CONFIDENTIAL"}
            </div>
          </div>

          {/* Header Info */}
          <div className="border-b border-dashed border-white/20 pb-8 mb-8 space-y-6">
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <Hash className="w-3 h-3" />
                ID: {file.fileNumber}
              </span>
              <span className="w-px h-3 bg-white/20" />
              <span className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {file.createdAt ? format(new Date(file.createdAt), 'dd MMM yyyy').toUpperCase() : 'UNKNOWN'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground uppercase tracking-tight max-w-2xl leading-none">
              {file.isLocked ? (
                <span className="bg-foreground text-background px-1">REDACTED SUBJECT</span>
              ) : (
                <GlitchText text={file.title} />
              )}
            </h1>

            <div className="flex items-center gap-2 flex-wrap">
               <div className={cn(
                 "inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold border uppercase tracking-widest",
                 isOmega 
                   ? "bg-destructive text-white border-destructive shadow-[0_0_10px_rgba(255,0,0,0.5)] animate-pulse" 
                   : "bg-primary/10 text-primary border-primary/40"
               )}>
                 <AlertTriangle className="w-3 h-3" />
                 SEVERITY: {file.severity}
               </div>
               
               {file.isLocked && (
                 <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold border border-yellow-500/50 text-yellow-500 uppercase tracking-widest bg-yellow-500/5">
                   <Lock className="w-3 h-3" />
                   ENCRYPTED
                 </div>
               )}

               {authStatus?.authenticated && <EditFileModal file={file} />}
            </div>
          </div>

          {/* File Type Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold border border-primary/30 text-primary/70 uppercase tracking-widest bg-primary/5 mb-6">
            {file.fileType || "ANOMALY"}
          </div>

          {/* Creature Image Section */}
          {file.imageUrl && !file.isLocked && (
            <div className="mb-8 overflow-hidden border border-primary/30 rounded-md shadow-[0_0_20px_rgba(255,0,0,0.1)]">
              <img 
                src={file.imageUrl} 
                alt={file.title}
                className="w-full h-auto object-cover max-h-96 bg-black"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content Area with Tabs */}
          <div className="font-mono text-sm md:text-base leading-relaxed text-muted-foreground min-h-[300px] relative">
            {file.isLocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm border border-white/10">
                <Lock className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-white/40 tracking-widest uppercase text-xs mb-6">Content Encrypted</p>
                <div className="w-64 space-y-2">
                  <div className="h-2 bg-white/10 rounded overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      animate={{ width: ["0%", "40%", "40%", "42%", "60%", "90%", "90%"] }}
                      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-primary/60 font-mono">
                    <span>DECRYPTION ATTEMPT</span>
                    <span className="animate-pulse">FAILING...</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className={cn("space-y-4", file.isLocked && "blur-sm select-none opacity-30")}>
              <FileDetailTabs file={file} />
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8" />
              
              <p className="text-xs text-primary/40 italic">
                // END OF RECORD. FURTHER OBSERVATION REQUIRED.
              </p>
            </div>
          </div>

          {/* Footer Bar of the "Paper" */}
          <div className="mt-12 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-widest">
             <span>ARCHIVE TERMINAL 004</span>
             <span>AUTH: ADMIN_OVERRIDE</span>
          </div>
        </motion.div>
      </div>

      <div className="crt-scanline" />
    </div>
  );
}
