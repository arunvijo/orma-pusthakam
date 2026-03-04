import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MOCK_MESSAGES, type MockMessage } from "@/lib/mockData";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Copy, BookOpen, LogOut, Link2 } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [profile, setProfile] = useState<{ username: string; full_name: string } | null>(null);
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      // Check profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileData) {
        navigate("/claim-username");
        return;
      }

      setProfile(profileData);

      // Fetch messages
      const { data: msgData, error } = await supabase
        .from("messages")
        .select("*")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !msgData || msgData.length === 0) {
        setUseMock(true);
        setMessages(MOCK_MESSAGES);
      } else {
        setMessages(msgData as unknown as MockMessage[]);
      }
      setLoading(false);
    };
    load();
  }, [navigate]);

  const copyLink = () => {
    if (!profile) return;
    const link = `${window.location.origin}/sign/${profile.username}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied! 📋", description: "Share it with your friends!" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-display text-xl text-muted-foreground animate-pulse">
          Opening your book...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-paper/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" strokeWidth={1.5} />
            <span className="font-display text-lg font-semibold text-foreground">
              My Autograph Book
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyLink} className="font-body">
              <Link2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Copy Share Link</span>
              <span className="sm:hidden">Share</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {profile?.full_name}'s Rajagiri Memories
          </h1>
          <p className="font-body text-muted-foreground">
            Class of 2026 Autograph Book
          </p>

          {useMock && (
            <div className="mt-4 inline-flex items-center gap-2 bg-secondary/60 text-secondary-foreground px-4 py-2 rounded-lg font-body text-sm">
              <Copy className="w-4 h-4" />
              These are sample messages — share your link to collect real ones!
            </div>
          )}
        </motion.div>

        {/* Share link card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="paper-texture book-shadow rounded-xl p-6 mb-10 text-center max-w-lg mx-auto"
        >
          <p className="font-body text-sm text-muted-foreground mb-3">
            Share this link with your friends:
          </p>
          <div className="bg-background/60 rounded-lg px-4 py-3 font-body text-sm text-foreground break-all mb-4 border border-border">
            {window.location.origin}/sign/{profile?.username}
          </div>
          <Button onClick={copyLink} className="font-display">
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </motion.div>

        {/* Messages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {messages.map((msg, i) => (
            <MessageCard
              key={msg.id}
              senderName={msg.sender_name}
              messageContent={msg.message_content}
              inkColor={msg.ink_color}
              fontStyle={msg.font_style}
              createdAt={msg.created_at}
              index={i}
            />
          ))}
        </div>

        {messages.length === 0 && !useMock && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foregrounRSETd/30 mx-auto mb-4" />
            <p className="font-display text-xl text-muted-foreground">
              Your book is empty
            </p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Share your link and start collecting autographs!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
