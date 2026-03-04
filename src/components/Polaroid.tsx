import { ReactNode } from "react";

interface PolaroidProps {
  children: ReactNode;
  rotate?: number;
}

export const Polaroid = ({ children, rotate = -2 }: PolaroidProps) => {
  return (
    <div 
      className="polaroid relative w-full max-w-sm mx-auto pt-24 pb-12"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="masking-tape" />
      <div className="aspect-square bg-white flex items-center justify-center">
        {children}
      </div>
      <div className="h-20 bg-white flex items-center px-4">
        <p className="font-kalam text-sm text-muted-foreground">
          memories matter
        </p>
      </div>
    </div>
  );
};
