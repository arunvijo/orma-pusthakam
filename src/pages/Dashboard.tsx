import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MOCK_MESSAGES, type MockMessage } from "@/lib/mockData";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Copy, BookOpen, LogOut, Link2, ChevronRight, ChevronLeft, LayoutGrid, BookTemplate } from "lucide-react";
// @ts-ignore - react-pageflip doesn't have official TS types
import HTMLFlipBook from "react-pageflip";
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

// The Page Component needed by react-pageflip
const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; number?: number; isCover?: boolean }>(
  ({ children, number, isCover }, ref) => {
    return (
      <div 
        className={`page bg-[#FDFBF7] shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] overflow-hidden relative ${isCover ? 'border-4 border-[#111] bg-yellow-100' : 'border-r border-[#e5e5e5]'}`} 
        ref={ref}
      >
        <div className="p-4 md:p-8 h-full flex flex-col">
          {children}
        </div>
        {number && (
          <div className="absolute bottom-4 left-0 right-0 text-center font-typewriter text-sm text-gray-500">
            - {number} -
          </div>
        )}
      </div>
    );
  }
);
Page.displayName = "Page";

const Dashboard = () => {
  const [profile, setProfile] = useState<{ username: string; full_name: string } | null>(null);
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [isFlipbookMode, setIsFlipbookMode] = useState(false); // Toggle state
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookRef = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

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

  const playPageTurnSound = () => {
    const audio = new Audio('/page-turn.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FDFBF7]" style={{ borderBottom: '3px solid #111' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-foreground" strokeWidth={2} />
            <span className="font-marker text-lg md:text-2xl font-bold text-foreground">
              My Autograph Book
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFlipbookMode(!isFlipbookMode)} 
              className="font-marker font-bold border-2 border-[#111] bg-yellow-200 hover:bg-yellow-300"
            >
              {isFlipbookMode ? (
                <><LayoutGrid className="w-4 h-4 mr-1.5" /> <span className="hidden sm:inline">Grid View</span></>
              ) : (
                <><BookTemplate className="w-4 h-4 mr-1.5" /> <span className="hidden sm:inline">Read as Book</span></>
              )}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleLogout} className="font-marker font-bold hover:bg-gray-200">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-6 md:py-12 px-2 md:px-4 overflow-hidden relative w-full">
        
        {!isFlipbookMode ? (
          /* =========================================
             GRID VIEW (DEFAULT)
             ========================================= */
          <div className="w-full max-w-6xl mx-auto">
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
              <div 
                className="absolute -top-4 left-1/4 w-24 h-6 rounded-sm"
                style={{ 
                  background: 'var(--washi-yellow, rgba(252, 211, 77, 0.7))',
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

            {/* Messages grid */}
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
                      imageUrl={(msg as any).image_url}
                      index={i}
                    />
                  </div>
                ))}
              </div>
            </div>

            {messages.length === 0 && !useMock && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-marker text-xl text-muted-foreground">
                  Your book is empty
                </p>
                <p className="font-typewriter text-sm text-muted-foreground mt-2">
                  Share your link and start collecting autographs!
                </p>
              </div>
            )}
          </div>
        ) : (
          /* =========================================
             FLIPBOOK VIEW 
             ========================================= */
          <>
            <div className="relative w-full max-w-4xl mx-auto flex justify-center drop-shadow-[10px_10px_15px_rgba(0,0,0,0.3)]">
              <HTMLFlipBook
                width={400}
                height={600}
                size="stretch"
                minWidth={300}
                maxWidth={500}
                minHeight={400}
                maxHeight={700}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={playPageTurnSound}
                className="scrapbook-flipbook"
                ref={bookRef}
              >
                {/* PAGE 1: Front Cover */}
                <Page isCover={true}>
                  <div className="h-full flex flex-col items-center justify-center text-center relative">
                    <HandDrawnCircle className="absolute top-10 left-5 w-24 h-24 opacity-40" />
                    <h1 className="font-marker text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
                      {profile?.full_name}'s<br/>Memories
                    </h1>
                    <p className="font-typewriter text-lg font-bold border-2 border-[#111] px-4 py-2 bg-white transform -rotate-2">
                      Class of 2026
                    </p>
                    <div className="absolute bottom-10 font-marker text-sm animate-pulse flex items-center">
                      Swipe or click corner to open <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Page>

                {/* PAGE 2: Inside Cover (Share Link) */}
                <Page>
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="bg-white p-6 text-center relative w-full" style={{ border: '3px solid #111', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}>
                      <div className="absolute -top-4 left-1/4 w-20 h-6 bg-blue-200/70 rotate-3 shadow-sm" />
                      <h2 className="font-marker text-2xl mb-4">Share Your Book!</h2>
                      <p className="font-typewriter text-sm mb-4">Send this link to your friends so they can sign your book:</p>
                      <div className="bg-gray-100 p-2 text-xs md:text-sm font-typewriter break-all border-2 border-[#111] mb-4">
                        {window.location.origin}/sign/{profile?.username}
                      </div>
                      <Button onClick={copyLink} className="w-full font-marker font-bold bg-yellow-300 text-black border-2 border-[#111] hover:bg-yellow-400 hover:-translate-y-1 transition-transform">
                        <Copy className="w-4 h-4 mr-2" /> Copy Link
                      </Button>
                      {useMock && (
                        <p className="mt-4 font-caveat text-red-600 font-bold text-lg leading-tight">
                          *These are currently sample messages. Share the link to get real ones!
                        </p>
                      )}
                    </div>
                  </div>
                </Page>

                {/* PAGES 3 to N: The Messages */}
                {messages.map((msg, i) => (
                  <Page key={msg.id} number={i + 1}>
                    <div className="h-full flex items-center justify-center">
                      <div className="transform scale-[0.85] md:scale-100 w-full">
                        <MessageCard
                          senderName={msg.sender_name}
                          messageContent={msg.message_content}
                          inkColor={msg.ink_color}
                          fontStyle={msg.font_style}
                          createdAt={msg.created_at}
                          imageUrl={(msg as any).image_url}
                          index={i}
                        />
                      </div>
                    </div>
                  </Page>
                ))}

                {/* Blank page to keep back cover on outside if necessary */}
                {...(messages.length % 2 === 0 ? [
                  <Page key="blank-filler">
                    <div className="h-full flex items-center justify-center opacity-30">
                      <HandDrawnCircle className="w-32 h-32" />
                    </div>
                  </Page>
                ] : [])}

                {/* FINAL PAGE: Back Cover */}
                <Page isCover={true}>
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-16 h-16 text-[#111] opacity-50 mb-4" />
                    <p className="font-marker text-xl opacity-50">The End.</p>
                  </div>
                </Page>
                
              </HTMLFlipBook>
            </div>

            {/* Desktop Book Navigation Controls */}
            <div className="hidden md:flex gap-4 mt-8">
              <Button variant="outline" className="font-marker border-2 border-[#111]" onClick={() => bookRef.current?.pageFlip()?.flipPrev()}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Prev Page
              </Button>
              <Button variant="outline" className="font-marker border-2 border-[#111]" onClick={() => bookRef.current?.pageFlip()?.flipNext()}>
                Next Page <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;