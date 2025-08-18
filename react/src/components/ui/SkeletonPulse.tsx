import { cn } from "@/lib/utils";

interface SkeletonPulseProps {
  className?: string;
  width?: string;
  height?: string;
}

export function SkeletonPulse({ 
  className,
  width = "100%",
  height = "1rem"
}: SkeletonPulseProps) {
  return (
    <div
      className={cn(
        "bg-muted animate-pulse rounded-md",
        className
      )}
      style={{
        width,
        height
      }}
    />
  );
}