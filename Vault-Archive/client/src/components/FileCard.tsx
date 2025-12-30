import { motion } from "framer-motion";
import { Lock, Unlock, FileWarning } from "lucide-react";
import { Link } from "wouter";
import type { File } from "@shared/schema";
import { cn } from "@/lib/utils";

interface FileCardProps {
  file: File;
  index: number;
}

export function FileCard({ file, index }: FileCardProps) {
  const handleClick = () => {
    // Track which files have been opened
    const openedFiles = JSON.parse(localStorage.getItem("vaultOpenedFiles") || "[]");
    if (!openedFiles.includes(file.id)) {
      openedFiles.push(file.id);
      localStorage.setItem("vaultOpenedFiles", JSON.stringify(openedFiles));
    }
  };

  return (
    <Link href={`/file/${file.id}`} className="block group" onClick={handleClick}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className={cn(
          "relative h-48 p-6 border border-border bg-black/40 backdrop-blur-sm overflow-hidden transition-all duration-300",
          "hover:border-primary/60 hover:shadow-[0_0_20px_rgba(255,0,0,0.15)]",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-transparent before:to-primary/5 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity"
        )}
      >
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50 group-hover:w-full group-hover:h-full transition-all duration-500 opacity-50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50 group-hover:w-full group-hover:h-full transition-all duration-500 opacity-50" />

        <div className="flex justify-between items-start mb-4">
          <span className="font-mono text-xs text-muted-foreground tracking-widest border border-border px-2 py-0.5 rounded-sm group-hover:border-primary/40 group-hover:text-primary transition-colors">
            {file.fileNumber}
          </span>
          {file.isLocked ? (
            <Lock className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <Unlock className="w-4 h-4 text-green-500/70" />
          )}
        </div>

        <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors tracking-wide">
          {file.isLocked ? "████████" : file.title}
        </h3>

        <div className="mt-4 flex items-center gap-2">
          <div className={cn(
            "text-[10px] font-bold px-2 py-0.5 border inline-block uppercase tracking-widest",
            file.severity === 'CRITICAL' || file.severity === 'OMEGA' 
              ? "border-destructive text-destructive bg-destructive/10 animate-pulse" 
              : "border-muted-foreground text-muted-foreground"
          )}>
            SEVERITY: {file.severity}
          </div>
        </div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />
      </motion.div>
    </Link>
  );
}
