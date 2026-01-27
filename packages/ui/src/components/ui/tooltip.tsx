import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import React from "react";
import { cn } from "../../lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = "top", className }) => {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {/* Wrap children in a span or div if they are strings, but asChild expects a single ReactElement. 
               If children triggers hydration mismatch or ref errors, we might need a wrapper. 
               For now, assuming children is a valid interactive element (since it was a group before). 
               However, the previous implementation wrapped {children} in a <div className="group relative">.
               Radix Trigger expects to pass Ref. safe to use a span wrapper if we aren't sure.
               Actually, let's try to pass it directly first but if it's text it will fail.
               Given the previous code: <div className="relative group">{children}...</div>
               The previous code WRAPPED children. 
           */}
          <span className="cursor-default">{children}</span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className={cn(
              "z-portal overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className
            )}
            sideOffset={4}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-popover" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};