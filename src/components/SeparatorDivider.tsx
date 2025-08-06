import { cn } from "@/lib/utils";

interface SeparatorDividerProps {
  variant?: "default" | "light";
  className?: string;
}

export const SeparatorDivider = ({ variant = "default", className }: SeparatorDividerProps) => {
  return (
    <div 
      className={cn(
        "my-12 md:my-16",
        variant === "light" ? "separator-light" : "separator-gradient",
        className
      )}
    />
  );
};