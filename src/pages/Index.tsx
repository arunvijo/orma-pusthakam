import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Link as LinkIcon, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Polaroid } from "@/components/Polaroid";
import { DemoMessageCard } from "@/components/DemoMessageCard";

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
    <div className="min-h-screen bg-background pb-32 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute inset-0 paper-texture opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-16"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
              Never Lose Your{" "}
              <span className="text-primary">Memories</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
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
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          See The Vibe
        </h2>
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
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          How It Works
        </h2>
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
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 message-shadow">
                  <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm">
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
          <Button size="lg" className="font-display text-lg px-8 py-6">
            <Heart className="w-5 h-5 mr-2" />
            Create Your Book
          </Button>
        </Link>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="sticky-cta">
        <Link to="/auth" className="block">
          <Button size="lg" className="w-full font-display text-lg py-6">
            <Heart className="w-5 h-5 mr-2" />
            Create Your Book
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-border mt-12 md:mt-16">
        <p className="font-body text-sm text-muted-foreground">
          Made with{" "}
          <Heart className="inline w-4 h-4 text-primary" /> for the memories
          that matter
        </p>
      </footer>
    </div>
  );
};

export default Index;
