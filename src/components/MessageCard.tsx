import { motion } from "framer-motion";
import { format } from "date-fns";

interface MessageCardProps {
  senderName: string;
  messageContent: string;
  inkColor: string;
  fontStyle: string;
  createdAt: string;
  index: number;
}

const fontMap: Record<string, string> = {
  Caveat: "font-caveat",
  "Shadows Into Light": "font-script",
  Kalam: "font-hand",
};

const rotations = [-2, 1.5, -1, 2, -1.5, 0.8, -0.5, 1.8];

const MessageCard = ({
  senderName,
  messageContent,
  inkColor,
  fontStyle,
  createdAt,
  index,
}: MessageCardProps) => {
  const rotation = rotations[index % rotations.length];
  const fontClass = fontMap[fontStyle] || "font-caveat";
  const tapeColor = ["var(--washi-yellow)", "var(--washi-blue)", "var(--washi-pink)"][index % 3];

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
        {/* Message content */}
        <p
          className={`${fontClass} text-base md:text-lg leading-relaxed mb-4 text-lg`}
          style={{ color: inkColor || 'var(--marker-black)' }}
        >
          "{messageContent}"
        </p>

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
      </div>
    </motion.div>
  );
};

export default MessageCard;
