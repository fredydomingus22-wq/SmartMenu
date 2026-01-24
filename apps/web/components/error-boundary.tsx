'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-600 mb-6">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-2 uppercase italic">Ops! Algo deu errado.</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 font-medium">
                        Ocorreu um erro inesperado ao carregar este conteúdo. Pode tentar recarregar a página ou contactar o suporte.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold px-8 py-6 rounded-2xl h-auto group transition-all"
                    >
                        <RefreshCcw className="mr-2 h-5 w-5 transition-transform group-hover:rotate-180 duration-500" />
                        Recarregar Página
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
