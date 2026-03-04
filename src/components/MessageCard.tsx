import { motion } from "framer-motion";
import { format } from "date-fns";

interface MessageCardProps {
  senderName: string;
  messageContent: string;
  inkColor: string;
  fontStyle: string;
  createdAt: string;
  imageUrl?: string | null;
  spotifyUrl?: string | null; // Added Spotify URL prop
  audioUrl?: string | null; // <-- ADD THIS
  index: number;
}

const fontMap: Record<string, string> = {
  Caveat: "font-caveat",
  "Shadows Into Light": "font-script",
  Kalam: "font-hand",
};

const rotations = [-2, 1.5, -1, 2, -1.5, 0.8, -0.5, 1.8];

// Helper to convert a standard Spotify share link into an embeddable widget link
const getSpotifyEmbedUrl = (url: string) => {
  if (!url) return null;
  try {
    if (url.includes('spotify.com/')) {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname; // e.g., /track/123456
      return `https://open.spotify.com/embed${pathname}?utm_source=generator`;
    }
  } catch (e) {
    return null;
  }
  return null;
};

const MessageCard = ({
  senderName,
  messageContent,
  inkColor,
  fontStyle,
  createdAt,
  imageUrl,
  spotifyUrl, // Destructured
  audioUrl, // <-- ADD THIS
  index,
}: MessageCardProps) => {
  const rotation = rotations[index % rotations.length];
  const fontClass = fontMap[fontStyle] || "font-caveat";
  const tapeColor = ["var(--washi-yellow)", "var(--washi-blue)", "var(--washi-pink)"][index % 3];

  const embedUrl = spotifyUrl ? getSpotifyEmbedUrl(spotifyUrl) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation - 3 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotate: rotation, zIndex: 10 }}
      className="relative cursor-default"
    >
      {/* Washi Tape */}
      <div 
        className="absolute -top-4 left-1/4 w-20 h-8 rounded-sm shadow-md z-20"
        style={{ 
          background: tapeColor,
          transform: 'rotate(-15deg)'
        }} 
      />
      <div 
        className="absolute -top-3 right-1/4 w-20 h-8 rounded-sm shadow-md z-20"
        style={{ 
          background: tapeColor,
          transform: 'rotate(12deg)',
          opacity: 0.8
        }} 
      />

      {/* Polaroid-style card with hand-drawn border */}
      <div
        className="bg-white p-4 pt-6 min-h-[200px] flex flex-col justify-between cursor-default relative"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          border: '2px solid #111',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.25), 2px 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        {/* Polaroid Image Render */}
        {imageUrl && (
          <div 
            className="mb-4 bg-white p-2 pb-6 self-center w-full max-w-[240px] relative"
            style={{ 
              border: '2px solid #111', 
              transform: 'rotate(-2deg)',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.25)'
            }}
          >
            <img 
              src={imageUrl} 
              alt={`From ${senderName}`} 
              className="w-full h-auto object-cover aspect-square border-2 border-[#111]"
              loading="lazy"
            />
            {/* Mini tape for the inner photo */}
            <div 
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 shadow-sm z-10" 
              style={{ background: tapeColor, opacity: 0.7, transform: 'rotate(4deg)' }}
            />
          </div>
        )}

        {/* Message content */}
        <p
          className={`${fontClass} text-base md:text-lg leading-relaxed mb-4 text-lg`}
          style={{ color: inkColor || 'var(--marker-black)' }}
        >
          "{messageContent}"
        </p>

        {/* Voice Autograph Player */}
        {audioUrl && (
          <div className="mt-2 mb-4 bg-yellow-50 border-2 border-[#111] p-2 transform rotate-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-md no-print">
            <p className="font-marker text-xs mb-1 ml-1 text-[#111]">🔊 Voice Note from {senderName}</p>
            <audio 
              controls 
              src={audioUrl} 
              className="w-full h-8"
              // Filter out default styling to fit the scrapbook theme better
              style={{ filter: 'sepia(20%) hue-rotate(10deg) saturate(150%)' }}
            />
          </div>
        )}
        

        {/* Signature and date */}
        <div className="mt-auto">
          <p
            className={`${fontClass} font-bold text-base`}
            style={{ color: inkColor || 'var(--marker-black)' }}
          >
            — {senderName}
          </p>
          <span className="text-xs font-typewriter text-muted-foreground">
            {format(new Date(createdAt), "MMM d, yyyy")}
          </span>
        </div>

        {/* Spotify Mini Player */}
        {embedUrl && (
          <div className="mt-4 pt-4 relative no-print" style={{ borderTop: '2px dashed #111' }}>
            {/* Tape holding the player */}
            <div 
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 z-10" 
              style={{ background: 'var(--washi-pink, rgba(244, 114, 182, 0.7))', transform: 'rotate(2deg)' }} 
            />
            <iframe 
              style={{ borderRadius: '12px', border: '2px solid #111' }} 
              src={embedUrl} 
              width="100%" 
              height="80" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        )}

        

      </div>
    </motion.div>
  );
};

export default MessageCard;