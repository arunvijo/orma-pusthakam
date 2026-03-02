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
  "Shadows Into Light": "font-shadows",
  Kalam: "font-kalam",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation - 3 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
      className="relative"
    >
      {/* Tape strip */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-tape/70 rounded-sm z-10 shadow-sm" />

      <div
        className="paper-texture torn-edge message-shadow rounded-sm p-6 pt-8 pb-5 min-h-[180px] flex flex-col justify-between cursor-default"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <p
          className={`${fontClass} text-lg md:text-xl leading-relaxed mb-4`}
          style={{ color: inkColor }}
        >
          "{messageContent}"
        </p>

        <div className="flex items-end justify-between mt-auto">
          <span
            className={`${fontClass} text-base font-semibold`}
            style={{ color: inkColor }}
          >
            — {senderName}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            {format(new Date(createdAt), "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageCard;
