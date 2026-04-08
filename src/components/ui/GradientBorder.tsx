import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  animated?: boolean;
  radius?: string;
}

export function GradientBorder({
  children,
  className,
  borderWidth = 2,
  animated = true,
  radius = "0.75rem",
}: GradientBorderProps) {
  return (
    <div
      className={cn("relative p-0", className)}
      style={{ borderRadius: radius }}
    >
      {/* Animated gradient border layer */}
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit]",
          animated ? "animate-gradient-border" : "",
        )}
        style={{
          padding: borderWidth,
          background: animated
            ? undefined
            : "linear-gradient(135deg, oklch(0.65 0.25 300), oklch(0.75 0.18 55), oklch(0.6 0.18 150))",
          borderRadius: radius,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          backgroundSize: animated ? "400% 100%" : undefined,
          animation: animated
            ? "gradient-rotate 3s linear infinite"
            : undefined,
          backgroundImage: animated
            ? "linear-gradient(90deg, oklch(0.65 0.25 300) 0%, oklch(0.7 0.2 0) 20%, oklch(0.6 0.18 150) 40%, oklch(0.75 0.18 55) 60%, oklch(0.65 0.22 240) 80%, oklch(0.65 0.25 300) 100%)"
            : undefined,
        }}
        aria-hidden="true"
      />
      <div
        className="relative z-10 rounded-[inherit]"
        style={{ borderRadius: `calc(${radius} - ${borderWidth}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
