import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { File } from "@shared/schema";

interface FileDetailTabsProps {
  file: File;
}

export function FileDetailTabs({ file }: FileDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "habitat" | "behavior" | "weaknesses">("overview");

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "habitat", label: "HABITAT", content: file.habitat },
    { id: "behavior", label: "BEHAVIOR", content: file.behavior },
    { id: "weaknesses", label: "WEAKNESSES", content: file.weaknesses },
  ];

  const availableTabs = tabs.filter(tab => tab.id === "overview" || tab.content);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap border-b border-primary/20 pb-4">
        {availableTabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            variant="ghost"
            className={cn(
              "font-mono text-xs uppercase tracking-widest px-4 py-2 border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary bg-primary/10"
                : "border-transparent text-primary/50 hover:text-primary"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {activeTab === "overview" && (
          <div>
            {file.recoveredLogs && (
              <div className="mb-6 p-4 border border-primary/20 bg-primary/5">
                <h3 className="text-primary font-display font-bold tracking-widest mb-3 uppercase text-sm">Recovered Logs</h3>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {file.recoveredLogs}
                </p>
              </div>
            )}
            <div className="font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {file.content}
            </div>
          </div>
        )}

        {activeTab === "habitat" && file.habitat && (
          <div className="font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {file.habitat}
          </div>
        )}

        {activeTab === "behavior" && file.behavior && (
          <div className="font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {file.behavior}
          </div>
        )}

        {activeTab === "weaknesses" && file.weaknesses && (
          <div className={cn(
            "font-mono text-sm leading-relaxed whitespace-pre-wrap p-4 border",
            file.isLocked 
              ? "text-yellow-500/50 border-yellow-500/30 bg-yellow-500/5" 
              : "text-destructive/80 border-destructive/30 bg-destructive/5"
          )}>
            {file.isLocked ? (
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                <span className="uppercase text-xs tracking-widest">[CONTENT REDACTED]</span>
              </div>
            ) : null}
            {!file.isLocked && file.weaknesses}
          </div>
        )}
      </motion.div>
    </div>
  );
}
