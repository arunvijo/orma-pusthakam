import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MOCK_MESSAGES, type MockMessage } from "@/lib/mockData";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Copy, BookOpen, LogOut, Link2 } from "lucide-react";
import { motion } from "framer-motion";

// Decorative SVG components
const SquigglyArrow = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 5 20 Q 25 10, 45 20 T 85 20" stroke="#111" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M 85 20 L 78 15 M 85 20 L 78 25" stroke="#111" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const HandDrawnCircle = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="#111" strokeWidth="2.5" strokeDasharray="5,3" />
  </svg>
);

const SpeechBubble = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="130" height="65" rx="10" stroke="#111" strokeWidth="2.5" fill="#fff" />
    <path d="M 30 75 L 20 95 L 40 75 Z" stroke="#111" strokeWidth="2.5" fill="#fff" />
  </svg>
);

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
      {/* Header with scrapbook style */}
      <header className="sticky top-0 z-20 bg-white" style={{ borderBottom: '3px solid #111' }}>
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-foreground" strokeWidth={2} />
            <span className="font-marker text-2xl font-bold text-foreground">
              My Autograph Book
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyLink} 
              className="font-marker font-bold border-2 border-foreground hover:bg-secondary"
            >
              <Link2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Copy Share Link</span>
              <span className="sm:hidden">Share</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="font-marker font-bold hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative">
        {/* Decorative SVG accents */}
        <SquigglyArrow className="absolute top-10 right-10 w-32 h-12 opacity-60 hidden md:block" />
        <HandDrawnCircle className="absolute top-40 left-5 w-24 h-24 opacity-40 hidden lg:block" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative z-10"
        >
          <h1 className="font-marker text-4xl md:text-5xl font-bold text-foreground mb-2" style={{ letterSpacing: '1px' }}>
            {profile?.full_name}'s Memories
          </h1>
          <p className="font-typewriter text-lg text-foreground mb-4">
            ✦ Class of 2026 Autograph Book ✦
          </p>

          {useMock && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-200 text-foreground px-4 py-2 font-typewriter text-sm border-2 border-foreground">
              <Copy className="w-4 h-4" />
              These are sample messages — share your link to collect real ones!
            </div>
          )}
        </motion.div>

        {/* Share link card with scrapbook style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-6 mb-10 text-center max-w-lg mx-auto relative"
          style={{ 
            border: '3px solid #111',
            boxShadow: '5px 5px 0px rgba(0,0,0,0.2)'
          }}
        >
          {/* Washi tape decoration */}
          <div 
            className="absolute -top-4 left-1/4 w-24 h-6 rounded-sm"
            style={{ 
              background: 'var(--washi-yellow)',
              transform: 'rotate(-10deg)',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }} 
          />

          <p className="font-marker text-lg font-bold text-foreground mb-4">
            Share with Friends:
          </p>
          <div className="bg-gray-50 px-4 py-3 font-typewriter text-sm text-foreground break-all mb-4 border-2 border-foreground">
            {window.location.origin}/sign/{profile?.username}
          </div>
          <Button 
            onClick={copyLink} 
            className="font-marker font-bold border-2 border-foreground bg-yellow-200 text-foreground hover:bg-yellow-300"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </motion.div>

        {/* Messages grid - messy layout for scrapbook feel */}
        <div className="relative" style={{ minHeight: '400px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-max">
            {messages.map((msg, i) => (
              <div 
                key={msg.id}
                style={{
                  transform: i % 2 === 0 ? 'translateY(-10px)' : 'translateY(10px)'
                }}
              >
                <MessageCard
                  senderName={msg.sender_name}
                  messageContent={msg.message_content}
                  inkColor={msg.ink_color}
                  fontStyle={msg.font_style}
                  createdAt={msg.created_at}
                  index={i}
                />
              </div>
            ))}
          </div>
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
