import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, PenLine, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 paper-texture opacity-50" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <BookOpen className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Never Lose Your <br />
              <span className="text-primary italic">College Memories</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Create your digital autograph book. Share a link with friends,
              collect heartfelt messages in beautiful handwriting, and treasure
              them forever.
            </p>
            <Link to="/auth">
              <Button size="lg" className="font-display text-lg px-8 py-6 rounded-lg">
                <PenLine className="w-5 h-5 mr-2" />
                Create Your Book
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: PenLine,
              title: "Share Your Link",
              desc: "Get a unique link. Send it to friends on WhatsApp, Instagram, or anywhere.",
            },
            {
              icon: Heart,
              title: "Collect Messages",
              desc: "Friends write heartfelt notes with custom handwriting styles and ink colors.",
            },
            {
              icon: Share2,
              title: "Treasure Forever",
              desc: "Your digital autograph book — always accessible, never lost, always beautiful.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-border">
        <p className="font-body text-sm text-muted-foreground">
          Made with <Heart className="inline w-4 h-4 text-accent" /> for the memories that matter
        </p>
      </footer>
    </div>
  );
};

export default Index;
