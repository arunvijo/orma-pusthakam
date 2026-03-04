import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Link as LinkIcon, Send, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Polaroid } from "@/components/Polaroid";
import { DemoMessageCard } from "@/components/DemoMessageCard";

// Decorative SVG components for 90s aesthetic
const HandDrawnBox = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="130" height="130" stroke="#111" strokeWidth="3" fill="none" 
          pathLength="100" strokeDasharray="5,8" />
    <circle cx="40" cy="40" r="4" fill="#111" />
    <circle cx="130" cy="40" r="4" fill="#111" />
  </svg>
);

const MarkerUnderline = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 300 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 10 15 Q 75 5, 150 15 Q 225 25, 290 15" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 20 22 Q 100 12, 180 20" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const DrawnArrow = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 10 80 Q 40 10 90 45" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 70 30 L 93 47 L 65 60" stroke="#111" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const ScribbleStar = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50 10 L 60 40 L 90 50 L 60 60 L 50 90 L 40 60 L 10 50 L 40 40 Z" stroke="#FCD34D" strokeWidth="4" fill="#FCD34D" strokeLinejoin="round" />
    <path d="M 50 10 L 60 40 L 90 50 L 60 60 L 50 90 L 40 60 L 10 50 L 40 40 Z" stroke="#111" strokeWidth="2" fill="none" strokeLinejoin="round" transform="translate(2, 2)" />
  </svg>
);

const Index = () => {
  const demoMessages = [
    {
      message: "Bro, those late-night debugging sessions in the lab were legendary! 🚀",
      sender: "Alen",
      rotate: 2,
      color: "cream" as const,
    },
    {
      message: "You always had the best notes. Thanks for saving me during exams! 💙",
      sender: "Alphy",
      rotate: -3,
      color: "blue" as const,
    },
    {
      message: "We didn't win the hackathon, but the memories were worth it. Stay curious! ✨",
      sender: "Adithya",
      rotate: 1,
      color: "pink" as const,
    },
  ];

  const steps = [
    { icon: LinkIcon, title: "Claim a Link", desc: "Get your personal URL." },
    { icon: Send, title: "Share It", desc: "Send it to your batchmates." },
    { icon: Heart, title: "Keep Forever", desc: "Read them years from now." },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32 md:pb-0 relative overflow-hidden">
      {/* Background decorations */}
      <HandDrawnBox className="absolute top-20 right-[-20px] w-64 h-64 opacity-20 rotate-12" />
      <HandDrawnBox className="absolute bottom-40 left-[-20px] w-40 h-40 opacity-20 -rotate-6 hidden md:block" />

      {/* Hero Section - Two Column Layout */}
      <section className="relative pt-12 md:pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left relative z-10"
          >
            <ScribbleStar className="absolute -top-8 -left-4 w-12 h-12 animate-pulse hidden md:block" />
            
            <h1 className="font-marker text-5xl md:text-7xl font-bold text-[#111] leading-tight mb-2 uppercase">
              Never Lose Your <br className="hidden md:block"/>
              <span className="inline-block relative mt-2">
                <span className="relative z-10 text-[#8b1a1a] transform -rotate-2 inline-block">MEMORIES</span>
                <div className="absolute inset-0 bg-yellow-200 transform rotate-1 -z-10 scale-110 border-2 border-[#111]"></div>
              </span>
            </h1>
            
            <MarkerUnderline className="w-full max-w-sm mx-auto md:mx-0 mt-4 mb-6" />
            
            <p className="font-typewriter text-lg md:text-xl text-gray-800 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
              Create a digital autograph book. Share your link, collect handwritten notes, polaroids, and voice memos from your college friends.
            </p>

            {/* Desktop CTA (Hidden on Mobile, replaced by sticky bar) */}
            <div className="hidden md:block relative">
              <Link to="/auth">
                <button 
                  className="font-marker font-bold uppercase text-xl px-8 py-4 text-[#111] relative group"
                  style={{
                    background: '#FCD34D',
                    border: '3px solid #111',
                    boxShadow: '6px 6px 0px #111',
                    transition: 'all 0.1s'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.boxShadow = '2px 2px 0px #111'}
                  onMouseUp={(e) => e.currentTarget.style.boxShadow = '6px 6px 0px #111'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '6px 6px 0px #111'}
                >
                  <Star className="w-6 h-6 mr-2 inline fill-current" />
                  Start Your Book
                </button>
              </Link>
              
              {/* Arrow pointing to the polaroid */}
              <DrawnArrow className="absolute top-2 left-64 w-24 h-24 hidden lg:block" />
            </div>
          </motion.div>

          {/* Right Column: Visual Placeholder (The "Memories Square") */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center md:justify-end pr-0 md:pr-8"
          >
            {/* Background messy square */}
            <div className="absolute inset-0 bg-blue-100 border-4 border-[#111] transform rotate-6 w-full max-w-[320px] mx-auto shadow-lg"></div>
            
            {/* The Polaroid */}
            <div className="relative bg-white p-4 pb-12 border-4 border-[#111] transform -rotate-3 w-full max-w-[320px] shadow-[8px_8px_0px_rgba(0,0,0,1)] z-10">
              {/* Tape */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-24 h-8 bg-pink-200 opacity-90 rotate-2 border-2 border-[#111]"></div>
              
              {/* Actual Image Placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop" 
                alt="Friends hanging out" 
                className="w-full aspect-square object-cover border-2 border-[#111] filter sepia-[20%] contrast-125"
              />
              
              {/* Marker text under image */}
              <p className="font-marker text-center text-2xl mt-4 text-[#111] transform rotate-1">Class of '26 📸</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* How It Works Section - Tape & Dash layout */}
      <section className="bg-yellow-50 border-y-4 border-[#111] py-16 relative">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-marker text-3xl md:text-4xl font-bold text-[#111] text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Dashed line connecting steps (desktop only) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0 border-t-4 border-dashed border-[#111] z-[-1] mt-2"></div>

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center bg-white p-6 border-4 border-[#111] shadow-[4px_4px_0px_#111] transform hover:-translate-y-2 transition-transform"
                  style={{ rotate: `${i % 2 === 0 ? 2 : -2}deg` }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-blue-200 border-2 border-[#111]">
                    <Icon className="w-8 h-8 text-[#111]" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-marker text-xl font-bold text-[#111] mb-2">{step.title}</h3>
                  <p className="font-typewriter text-gray-700 text-sm">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Vibe Demo Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative">
        <h2 className="font-marker text-3xl md:text-4xl font-bold text-[#111] text-center mb-4">
          See The Vibe
        </h2>
        <MarkerUnderline className="w-32 mx-auto mb-12" />
        
        <div className="flex overflow-x-auto md:overflow-visible md:grid md:grid-cols-3 gap-8 pb-8 md:pb-0 px-2">
          {demoMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[280px] md:w-auto md:flex-shrink"
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

      {/* Bottom CTA (Desktop) */}
      <section className="hidden md:block max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="bg-pink-100 border-4 border-[#111] p-12 relative shadow-[8px_8px_0px_#111]">
          <div className="absolute -top-4 right-10 w-20 h-8 bg-yellow-200 rotate-6 border-2 border-[#111]"></div>
          <h2 className="font-marker text-4xl mb-6 text-[#111]">Ready to make memories?</h2>
          <Link to="/auth">
            <button className="font-marker font-bold uppercase text-xl px-10 py-4 bg-white border-4 border-[#111] shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition-all text-[#111]">
              Create Your Book
            </button>
          </Link>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t-4 border-[#111] p-4 z-50 shadow-[0_-4px_0px_rgba(0,0,0,1)]">
        <Link to="/auth" className="block">
          <button 
            className="w-full font-marker font-bold uppercase text-xl py-4 text-[#111] flex items-center justify-center"
            style={{ background: '#FCD34D', border: '3px solid #111', boxShadow: '4px 4px 0px #111' }}
          >
            <Star className="w-5 h-5 mr-2 fill-current" />
            Start Your Book
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t-4 border-[#111] bg-white">
        <p className="font-typewriter text-sm text-[#111] font-bold">
          Made with <Heart className="inline w-4 h-4 fill-current text-red-500" /> for the memories that matter.
        </p>
      </footer>
    </div>
  );
};

export default Index;