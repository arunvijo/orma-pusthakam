import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Link as LinkIcon, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Polaroid } from "@/components/Polaroid";
import { DemoMessageCard } from "@/components/DemoMessageCard";

// Decorative SVG components for 90s aesthetic
const HandDrawnBox = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="130" height="130" stroke="#111" strokeWidth="3" fill="none" 
          pathLength="100" strokeDasharray="5,3" />
    <circle cx="40" cy="40" r="8" fill="#111" />
    <circle cx="130" cy="40" r="8" fill="#111" />
  </svg>
);

const MarkerUnderline = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 300 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 10 15 Q 75 5, 150 15 Q 225 25, 290 15" stroke="#111" strokeWidth="3" fill="none" 
          strokeLinecap="round" />
  </svg>
);

const ConfettiDots = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="30" r="4" fill="#FCD34D" />
    <circle cx="50" cy="15" r="3.5" fill="#93C5FD" />
    <circle cx="75" cy="40" r="4" fill="#F9A8D4" />
    <circle cx="35" cy="70" r="3" fill="#FCD34D" />
    <circle cx="65" cy="80" r="3.5" fill="#F9A8D4" />
    <circle cx="85" cy="20" r="3" fill="#93C5FD" />
  </svg>
);

const Index = () => {
  const demoMessages = [
    {
      message: "Best friend forever! Never forget the late-night talks in the dorm.",
      sender: "Sarah Chen",
      rotate: 2,
      color: "cream" as const,
    },
    {
      message: "You made college unforgettable. Keep being awesome!",
      sender: "Mike Johnson",
      rotate: -2,
      color: "blue" as const,
    },
    {
      message: "To late-night study sessions and coffee breaks! 💕",
      sender: "Emma Davis",
      rotate: 1,
      color: "pink" as const,
    },
  ];

  const steps = [
    { icon: LinkIcon, title: "Claim your unique link", desc: "Get your personal autograph book URL" },
    { icon: Send, title: "Share it with friends", desc: "Send on WhatsApp, Instagram, or anywhere" },
    { icon: Heart, title: "Collect memories forever", desc: "Friends add notes and photos instantly" },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-0 relative">
      {/* Background decorations */}
      <ConfettiDots className="absolute top-20 right-10 w-32 h-32 opacity-40" />
      <HandDrawnBox className="absolute bottom-40 left-5 w-40 h-40 opacity-30 hidden md:block" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-16"
          >
            <h1 className="font-marker text-5xl md:text-7xl font-bold text-foreground leading-tight mb-4" 
                style={{ letterSpacing: '2px' }}>
              NEVER LOSE YOUR{" "}
              <span className="inline-block" style={{ color: '#8b5a2b', transform: 'rotate(-3deg)' }}>MEMORIES</span>
            </h1>
            
            <MarkerUnderline className="w-full max-w-md mx-auto mb-6" />
            
            <p className="font-typewriter text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Create a digital autograph book, share your link, and let friends
              leave handwritten notes and photos.
            </p>
          </motion.div>

          {/* Polaroid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <Polaroid rotate={-2}>
              <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center p-4">
                <div className="text-center">
                  <Heart className="w-16 h-16 text-primary mx-auto mb-2 opacity-80" />
                  <p className="font-caveat text-2xl text-foreground">Memories</p>
                </div>
              </div>
            </Polaroid>
          </motion.div>
        </div>
      </section>

      {/* The Vibe Demo Section */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 relative">
        <h2 className="font-marker text-3xl md:text-4xl font-bold text-foreground text-center mb-4" 
            style={{ letterSpacing: '1px' }}>
          See The Vibe
        </h2>
        <MarkerUnderline className="w-32 mx-auto mb-12" />
        <div className="flex overflow-x-auto md:overflow-visible md:grid md:grid-cols-3 gap-6 md:gap-8 pb-4 md:pb-0">
          {demoMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 md:flex-shrink"
            >
              <DemoMessageCard
                message={msg.message}
                sender={msg.sender}
                rotate={msg.rotate}
                color={msg.color}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="font-marker text-3xl md:text-4xl font-bold text-foreground text-center mb-4" 
            style={{ letterSpacing: '1px' }}>
          How It Works
        </h2>
        <MarkerUnderline className="w-40 mx-auto mb-12" />
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ 
                    background: '#FCD34D',
                    border: '3px solid #111',
                    boxShadow: '3px 3px 0px #111'
                  }}
                >
                  <Icon className="w-10 h-10 text-foreground" strokeWidth={2} />
                </div>
                <h3 className="font-marker text-xl font-bold text-foreground mb-2"
                    style={{ letterSpacing: '0.5px' }}>
                  {step.title}
                </h3>
                <p className="font-typewriter text-muted-foreground text-sm">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Desktop CTA Section */}
      <section className="hidden md:block max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
        <Link to="/auth">
          <button 
            className="font-marker font-bold uppercase text-lg px-10 py-4 text-foreground"
            style={{
              background: '#FCD34D',
              border: '3px solid #111',
              boxShadow: '5px 5px 0px #111',
              cursor: 'pointer',
              transition: 'all 0.1s'
            }}
            onMouseDown={(e) => e.currentTarget.style.boxShadow = '2px 2px 0px #111'}
            onMouseUp={(e) => e.currentTarget.style.boxShadow = '5px 5px 0px #111'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '5px 5px 0px #111'}
          >
            <Heart className="w-5 h-5 mr-2 inline" />
            Create Your Book
          </button>
        </Link>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t-4 border-foreground p-4 z-50"
           style={{ boxShadow: '0 -4px 0px #111' }}>
        <Link to="/auth" className="block">
          <button 
            className="w-full font-marker font-bold uppercase text-lg py-4 text-foreground"
            style={{
              background: '#FCD34D',
              border: '3px solid #111',
              boxShadow: '4px 4px 0px #111',
              cursor: 'pointer'
            }}
          >
            <Heart className="w-5 h-5 mr-2 inline" />
            Create Your Book
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center py-10 mt-12 md:mt-16" style={{ borderTop: '3px solid #111' }}>
        <p className="font-typewriter text-sm text-foreground">
          Made with{" "}
          <Heart className="inline w-4 h-4" /> for the memories that matter
        </p>
      </footer>
    </div>
  );
};

export default Index;
