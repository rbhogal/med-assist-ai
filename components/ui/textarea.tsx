import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none text-gray-800 max-w-3xl w-full border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground dark:aria-invalid:ring-destructive/40 dark:bg-input/30 flex field-sizing-content min-h-16 rounded-md bg-transparent px-3 py-2 text-base  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
