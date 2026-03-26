import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-linear-[135deg] from-primary/50 to-accent/50",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
