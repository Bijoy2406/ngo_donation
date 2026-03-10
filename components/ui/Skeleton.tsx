import { cn } from "@/lib/utils"; // Assuming a utility like this exists, else replacing with tailwind-merge directly
import React from "react";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-sage-200/50", className)}
      {...props}
    />
  );
}
