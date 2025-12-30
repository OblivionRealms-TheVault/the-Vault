import { useState } from "react";
import { useCreateFile } from "@/hooks/use-files";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function CreateFileModal() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateFile();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    mutate({
      fileNumber: formData.get("fileNumber") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      fileType: formData.get("fileType") as string || "ANOMALY",
      imageUrl: formData.get("imageUrl") as string || undefined,
      recoveredLogs: (formData.get("recoveredLogs") as string) || undefined,
      habitat: (formData.get("habitat") as string) || undefined,
      behavior: (formData.get("behavior") as string) || undefined,
      weaknesses: (formData.get("weaknesses") as string) || undefined,
      severity: formData.get("severity") as string,
      isLocked: formData.get("isLocked") === "on",
    }, {
      onSuccess: () => {
        setOpen(false);
        toast({
          title: "FILE ENCRYPTED & UPLOADED",
          description: "The archive has been updated successfully.",
          className: "bg-black border-primary text-primary font-mono",
        });
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "UPLOAD FAILED",
          description: err.message,
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-mono uppercase tracking-widest border border-primary shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,0,0,0.5)] transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" /> New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-primary/50 text-foreground font-mono max-w-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-primary tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            CREATE CLASSIFIED ENTRY
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fileNumber" className="text-primary/80 uppercase text-xs">File Index ID</Label>
              <Input 
                id="fileNumber" 
                name="fileNumber" 
                placeholder="FILE-XXX" 
                required 
                pattern="FILE-\d{3}"
                title="Format: FILE-XXX (e.g., FILE-042)"
                className="bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fileType" className="text-primary/80 uppercase text-xs">File Category</Label>
              <Select name="fileType" defaultValue="ANOMALY">
                <SelectTrigger className="bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30 text-foreground">
                  <SelectItem value="ANOMALY" className="font-mono">ANOMALY</SelectItem>
                  <SelectItem value="ENVIRONMENTAL" className="font-mono">ENVIRONMENTAL</SelectItem>
                  <SelectItem value="DISCOVERY" className="font-mono">DISCOVERY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-primary/80 uppercase text-xs">Subject / Title</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Enter subject name..." 
                required 
                className="bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity" className="text-primary/80 uppercase text-xs">Threat Severity</Label>
              <Select name="severity" defaultValue="LOW">
                <SelectTrigger className="bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30 text-foreground">
                  <SelectItem value="LOW" className="font-mono">LOW</SelectItem>
                  <SelectItem value="MEDIUM" className="font-mono">MEDIUM</SelectItem>
                  <SelectItem value="CRITICAL" className="font-mono text-primary">CRITICAL</SelectItem>
                  <SelectItem value="OMEGA" className="font-mono text-destructive font-bold">OMEGA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-primary/80 uppercase text-xs">Image URL</Label>
            <Input 
              id="imageUrl" 
              name="imageUrl" 
              type="url"
              placeholder="https://example.com/image.jpg" 
              className="bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-primary/80 uppercase text-xs">Overview / Observation Log</Label>
            <Textarea 
              id="content" 
              name="content" 
              placeholder="Enter classified observations..." 
              required 
              className="min-h-[120px] bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recoveredLogs" className="text-primary/80 uppercase text-xs">Recovered Logs (Optional)</Label>
            <Textarea 
              id="recoveredLogs" 
              name="recoveredLogs" 
              placeholder="Field reports, final messages, damaged transmissions..." 
              className="min-h-[100px] bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="habitat" className="text-primary/80 uppercase text-xs">Habitat (Optional)</Label>
            <Textarea 
              id="habitat" 
              name="habitat" 
              placeholder="Where is this found? Living fog, cursed rivers, forests that rearrange..." 
              className="min-h-[80px] bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="behavior" className="text-primary/80 uppercase text-xs">Behavior (Optional)</Label>
            <Textarea 
              id="behavior" 
              name="behavior" 
              placeholder="How does it act? What does it do?" 
              className="min-h-[80px] bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weaknesses" className="text-primary/80 uppercase text-xs">Weaknesses (Optional)</Label>
            <Textarea 
              id="weaknesses" 
              name="weaknesses" 
              placeholder="Vulnerabilities, countermeasures, or [REDACTED]..." 
              className="min-h-[80px] bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center space-x-2 border border-primary/20 p-4 rounded-md bg-secondary/10">
            <Checkbox id="isLocked" name="isLocked" className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            <Label htmlFor="isLocked" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-primary/80">
              ENCRYPT FILE (Lock Access)
            </Label>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest uppercase w-full sm:w-auto shadow-[0_0_15px_rgba(255,0,0,0.2)]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                  ENCRYPTING...
                </>
              ) : (
                "UPLOAD TO ARCHIVE"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
