"use client";

import { useEffect } from "react";
import { Button } from "@smart-menu/ui";
import { AlertTriangle } from "lucide-react";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Silently log error to an external service without exposing it to the user
    console.error("Marketing route error caught:", error.message);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-3">
        Estamos a enfrentar instabilidade
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Houve um problema temporário ao carregar esta página. A nossa equipa foi notificada e está a trabalhar numa solução. Tente novamente em instantes.
      </p>
      <Button onClick={() => reset()} size="lg" className="rounded-xl font-semibold">
        Tentar novamente
      </Button>
    </div>
  );
}
