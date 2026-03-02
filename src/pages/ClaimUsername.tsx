import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const ClaimUsername = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setAvailable(null);
      return;
    }
    setChecking(true);
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", value.toLowerCase())
      .maybeSingle();
    setAvailable(!data);
    setChecking(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        username: username.toLowerCase().trim(),
        full_name: fullName.trim(),
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Username taken!", description: "Try a different one.", variant: "destructive" });
        } else {
          throw error;
        }
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="paper-texture book-shadow rounded-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-3" strokeWidth={1.5} />
            <h1 className="font-display text-2xl font-bold text-foreground">
              Claim Your Page
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Choose a unique username for your autograph book link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="font-body">Your Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="username" className="font-body">Username</Label>
              <div className="relative mt-1">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                    setUsername(val);
                    checkUsername(val);
                  }}
                  placeholder="johndoe"
                  required
                  minLength={3}
                  maxLength={30}
                />
                {username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checking ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : available ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : available === false ? (
                      <XCircle className="w-4 h-4 text-destructive" />
                    ) : null}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-body">
                Your link: {window.location.origin}/sign/{username.toLowerCase() || "..."}
              </p>
            </div>
            <Button
              type="submit"
              className="w-full font-display text-base"
              disabled={loading || !available || !fullName.trim()}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Claim Username
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ClaimUsername;
