import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Timeline themed variants
        neutral: "bg-neutral-600 text-white hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600",
        anima: "bg-anima-600 text-white hover:bg-anima-700 dark:bg-anima-700 dark:hover:bg-anima-600",
        eros: "bg-eros-600 text-white hover:bg-eros-700 dark:bg-eros-700 dark:hover:bg-eros-600",
        bloom: "bg-bloom-600 text-white hover:bg-bloom-700 dark:bg-bloom-700 dark:hover:bg-bloom-600",
        // Timeline outline variants
        "neutral-outline": "border-2 border-neutral-600 text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-950",
        "anima-outline": "border-2 border-anima-600 text-anima-700 hover:bg-anima-50 dark:text-anima-300 dark:hover:bg-anima-950",
        "eros-outline": "border-2 border-eros-600 text-eros-700 hover:bg-eros-50 dark:text-eros-300 dark:hover:bg-eros-950",
        "bloom-outline": "border-2 border-bloom-600 text-bloom-700 hover:bg-bloom-50 dark:text-bloom-300 dark:hover:bg-bloom-950",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
