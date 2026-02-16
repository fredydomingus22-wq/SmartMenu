'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@smart-menu/ui';

type ButtonProps = React.ComponentProps<typeof Button>;
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps extends ButtonProps {
  pendingText?: string;
  loading?: boolean;
}

export function SubmitButton({ 
  children, 
  pendingText, 
  loading: manualLoading, 
  className, 
  disabled, 
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = pending || manualLoading;

  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      className={cn("relative transition-all active:scale-[0.98]", className)}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingText || children}
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
