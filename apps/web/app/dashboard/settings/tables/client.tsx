"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTable, deleteTable } from "@/app/actions/tables";
import { useRouter } from "next/navigation";

interface Table {
    id: string;
    number: number;
    tenantId: string;
    _count?: {
        orders: number;
    };
}

export default function TablesClientPage({ initialTables }: { initialTables: Table[] }) {
    const [tables, setTables] = useState<Table[]>(initialTables);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newTableNumber, setNewTableNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreateTable = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await createTable({
                number: parseInt(newTableNumber),
            });

            if (result.success && result.data) {
                setTables([...tables, result.data as Table].sort((a, b) => a.number - b.number));
                setNewTableNumber("");
                setIsDialogOpen(false);
                router.refresh();
            } else {
                alert(result.error || "Erro ao criar mesa.");
            }
        } catch (error) {
            console.error("Failed to create table:", error);
            alert("Erro ao criar mesa.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTable = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover esta mesa?")) return;

        try {
            const result = await deleteTable(id);
            if (result.success) {
                setTables(tables.filter(t => t.id !== id));
                router.refresh();
            } else {
                alert(result.error || "Erro ao excluir mesa.");
            }
        } catch (error) {
            console.error("Failed to delete table:", error);
            alert("Erro ao excluir mesa.");
        }
    };

    const downloadQR = (tableNumber: number) => {
        const canvas = document.getElementById(`qr-code-${tableNumber}`) as HTMLCanvasElement;
        if (!canvas) return; // Note: QRCodeSVG renders an SVG, we might need a different approach for download or just print
        // Logic for SVG download or Print
        const svg = document.getElementById(`qr-svg-${tableNumber}`);
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `mesa-${tableNumber}-qr.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Gestão de Mesas</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Crie mesas e gere códigos QR para pedidos.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Mesa
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Nova Mesa</DialogTitle>
                            <DialogDescription>
                                Digite o número da mesa para identificação.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateTable}>
                            <ScrollArea className="max-h-[60vh] py-4">
                                <div className="grid gap-4 pr-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="number" className="text-right">
                                            Número
                                        </Label>
                                        <Input
                                            id="number"
                                            type="number"
                                            value={newTableNumber}
                                            onChange={(e) => setNewTableNumber(e.target.value)}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                </div>
                            </ScrollArea>
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? "Criando..." : "Salvar Mesa"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tables.map((table) => {
                    const qrUrl = `${window.location.origin}/q/${table.tenantId}/${table.id}`; // Construct Client-Side URL
                    return (
                        <div key={table.id} className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col items-center space-y-4">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Mesa {table.number}</h3>
                                <p className="text-sm text-zinc-500">{table._count?.orders || 0} pedidos ativos</p>
                            </div>

                            <div className="bg-white p-2 rounded-lg border">
                                <QRCodeSVG
                                    id={`qr-svg-${table.number}`}
                                    value={qrUrl}
                                    size={150}
                                    level="H"
                                    includeMargin
                                />
                            </div>

                            <div className="flex w-full gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => downloadQR(table.number)}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Baixar
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteTable(table.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {tables.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-12 dark:border-zinc-700">
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Nenhuma mesa cadastrada.</p>
                </div>
            )}
        </div>
    );
}
