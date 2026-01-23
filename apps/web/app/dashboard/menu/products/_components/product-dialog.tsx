'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Image as ImageIcon } from "lucide-react";
import { createProduct } from '../../../../actions/menu';
import { toast } from "sonner";
import Image from "next/image";

export function ProductDialog({ categories }: { categories: { id: string; name: string }[] }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            await createProduct(formData);
            setOpen(false);
            setPreview(null);
            toast.success("Produto criado com sucesso!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao criar produto.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Produto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Produto</DialogTitle>
                    <DialogDescription>
                        Crie um novo item para o seu menu. Preencha todos os campos obrigatórios.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome do Produto</Label>
                            <Input id="name" name="name" placeholder="Picanha na Brasa" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="categoryId">Categoria</Label>
                            <Select name="categoryId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Preço (AOA)</Label>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="5500.00" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" name="description" placeholder="Acompanha arroz, feijão e farofa..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Imagem do Produto</Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setPreview(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Previsão"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <ImageIcon className="h-10 w-10 text-zinc-400" />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="isAvailable" name="isAvailable" value="true" defaultChecked />
                            <Label htmlFor="isAvailable">Disponível para pedido</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 w-full">
                            {loading ? "A criar..." : "Criar Produto"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
