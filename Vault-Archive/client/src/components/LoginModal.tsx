import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [password, setPassword] = useState("");
  const { mutate, isPending } = useLogin();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(password, {
      onSuccess: () => {
        setPassword("");
        onOpenChange(false);
        toast({
          title: "ACCESS GRANTED",
          description: "Admin credentials verified.",
          className: "bg-black border-primary text-primary font-mono",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "ACCESS DENIED",
          description: "Invalid password.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-primary/50 text-foreground font-mono max-w-md backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-primary tracking-widest flex items-center gap-2">
            <Lock className="w-6 h-6" />
            ADMIN AUTHENTICATION
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="p-4 border border-primary/30 bg-primary/5 rounded-md flex gap-3">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary/80">
              This section requires administrator authentication to modify archive files.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary/80 uppercase text-xs">Admin Password</Label>
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              autoFocus
              className="bg-secondary/30 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div className="flex justify-end pt-4 gap-2">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-primary/20 text-primary/80 hover:bg-primary/5 font-mono uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isPending || !password}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.2)]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                  AUTHENTICATING...
                </>
              ) : (
                "VERIFY CREDENTIALS"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
