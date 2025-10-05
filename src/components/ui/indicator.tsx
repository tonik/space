import { cn } from "@/lib/utils";

export function Indicator({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "border-destructive bg-destructive shadow-destructive h-2 w-2 animate-pulse rounded-full border",
        className
      )}
      {...props}
    />
  );
}