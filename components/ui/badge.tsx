import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Timeline themed variants
        neutral: "border-transparent bg-neutral-600 text-white [a&]:hover:bg-neutral-700",
        anima: "border-transparent bg-anima-600 text-white [a&]:hover:bg-anima-700",
        eros: "border-transparent bg-eros-600 text-white [a&]:hover:bg-eros-700",
        bloom: "border-transparent bg-bloom-600 text-white [a&]:hover:bg-bloom-700",
        // Timeline outline variants
        "neutral-outline": "border-neutral-600 text-neutral-700 dark:text-neutral-300 [a&]:hover:bg-neutral-50 dark:[a&]:hover:bg-neutral-950",
        "anima-outline": "border-anima-600 text-anima-700 dark:text-anima-300 [a&]:hover:bg-anima-50 dark:[a&]:hover:bg-anima-950",
        "eros-outline": "border-eros-600 text-eros-700 dark:text-eros-300 [a&]:hover:bg-eros-50 dark:[a&]:hover:bg-eros-950",
        "bloom-outline": "border-bloom-600 text-bloom-700 dark:text-bloom-300 [a&]:hover:bg-bloom-50 dark:[a&]:hover:bg-bloom-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
