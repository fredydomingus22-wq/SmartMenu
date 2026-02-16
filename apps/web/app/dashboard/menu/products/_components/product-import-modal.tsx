'use client'

import { useState, useEffect } from "react";
import { Button } from "@smart-menu/ui";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@smart-menu/ui";
import { Input } from "@smart-menu/ui";
import { Label } from "@smart-menu/ui";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { importProductsCSV } from "../../../../actions/menu";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";

export function ProductImportModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    const [fileName, setFileName] = useState<string | null>(null);
    const [result, setResult] = useState<{
        importedCount: number;
        errors: string[];
        success: boolean;
    } | null>(null);

    async function handleSubmit(formData: FormData) {
        const file = formData.get('file') as File;
        if (!file || file.size === 0) {
            toast.error("Por favor, selecione um ficheiro CSV.");
            return;
        }

        setLoading(true);
        try {
            const res = await importProductsCSV(formData);
            if (res.success) {
                setResult({
                    success: true,
                    importedCount: res.importedCount || 0,
                    errors: res.errors || []
                });
                toast.success("Importação concluída!");
                setFileName(null);
            } else {
                toast.error(res.error || "Erro ao importar produtos.");
            }
        } catch (err: unknown) {
            console.error(err);
            toast.error("Erro inesperado ao importar produtos.");
        } finally {
            setLoading(false);
        }
    }

    const reset = () => {
        setOpen(false);
        setResult(null);
        setFileName(null);
    };

    if (!isMounted) {
        return (
            <Button variant="outline" className="border-orange-200 dark:border-orange-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                <Upload className="mr-2 h-4 w-4" />
                Importar CSV
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-orange-200 dark:border-orange-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <Upload className="mr-2 h-4 w-4" />
                    Importar CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Importar Produtos</DialogTitle>
                    <DialogDescription>
                        {result 
                            ? "Resultado da última importação." 
                            : "Carregue um ficheiro CSV para adicionar produtos em massa."
                        }
                    </DialogDescription>
                </DialogHeader>

                {result ? (
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <div>
                                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                                    {result.importedCount} produtos importados com sucesso.
                                </p>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-red-800 dark:text-red-400 uppercase tracking-wider flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Erros encontrados ({result.errors.length}):
                                </h4>
                                <div className="max-h-[150px] overflow-y-auto border border-red-100 dark:border-red-900/30 rounded-lg bg-red-50/50 dark:bg-red-950/10 p-2 text-[11px] text-red-700 dark:text-red-500 font-mono space-y-1">
                                    {result.errors.map((error, idx) => (
                                        <div key={idx} className="border-b border-red-100 dark:border-red-900/20 last:border-0 pb-1 mb-1">
                                            {error}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button onClick={reset} className="w-full">
                            Fechar
                        </Button>
                    </div>
                ) : (
                    <form action={handleSubmit}>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-4">
                                <Label htmlFor="file" className="cursor-pointer">
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-8 hover:border-orange-400 dark:hover:border-orange-600 transition-colors">
                                        {fileName ? (
                                            <>
                                                <FileText className="h-10 w-10 text-orange-500 mb-2" />
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{fileName}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-10 w-10 text-zinc-400 mb-2" />
                                                <span className="text-sm text-zinc-500">Clique para selecionar ou arraste o ficheiro</span>
                                            </>
                                        )}
                                    </div>
                                </Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setFileName(file.name);
                                    }}
                                    required
                                />
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg space-y-2">
                                <h4 className="text-xs font-semibold text-orange-800 dark:text-orange-400 uppercase tracking-wider flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Formato Ideal:
                                </h4>
                                <p className="text-xs text-orange-700 dark:text-orange-500 leading-relaxed">
                                    O CSV deve ter os cabeçalhos: <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">name</code>, <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">price</code>, <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">category</code>.
                                    Campos opcionais: <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">description</code>, <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">image_url</code>.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <SubmitButton 
                                pendingText="A importar produtos..." 
                                loading={loading}
                                className="bg-orange-600 hover:bg-orange-700 w-full shadow-lg shadow-orange-600/20"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Iniciar Importação
                            </SubmitButton>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
