import { ReactNode } from "react";

interface DemoMessageCardProps {
  message: string;
  sender: string;
  rotate?: number;
  color?: "cream" | "blue" | "pink";
  children?: ReactNode;
}

const colorMap = {
  cream: "bg-yellow-50 border-amber-200",
  blue: "bg-blue-50 border-blue-200",
  pink: "bg-pink-50 border-pink-200",
};

export const DemoMessageCard = ({
  message,
  sender,
  rotate = 1,
  color = "cream",
}: DemoMessageCardProps) => {
  return (
    <div
      className={`${colorMap[color]} rounded-lg p-6 message-shadow border-2 max-w-xs`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <p className="font-kalam text-lg text-foreground mb-4 leading-relaxed">
        {message}
      </p>
      <p className="font-caveat text-sm text-muted-foreground text-right">
        — {sender}
      </p>
    </div>
  );
};
