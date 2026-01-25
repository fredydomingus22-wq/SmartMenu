"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase-client";
import { Button } from "./button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    disabled?: boolean;
    className?: string;
    bucketName?: string;
    supabaseUrl: string;
    supabaseKey: string;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    disabled,
    className,
    bucketName = "menu-assets", // Default bucket
    supabaseUrl,
    supabaseKey
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient(supabaseUrl, supabaseKey);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            setIsUploading(true);

            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            onChange(data.publicUrl);
            toast.success("Imagem enviada com sucesso!");
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Upload Error:", error);
            toast.error(`Erro no upload: ${error.message || "Tente novamente."}`);
        } finally {
            setIsUploading(false);
        }
    }

    if (value) {
        return (
            <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900", className)}>
                <div className="absolute top-2 right-2 z-10">
                    <Button
                        type="button"
                        onClick={onRemove}
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <Image
                    fill
                    src={value}
                    alt="Image"
                    className="object-cover"
                    unoptimized
                />
            </div>
        );
    }

    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 mb-3 text-zinc-400 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 mb-3 text-zinc-400" />
                        )}
                        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold">Clique para enviar</span> ou arraste
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            (MAX. 4MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onUpload}
                        disabled={disabled || isUploading}
                    />
                </label>
            </div>
        </div>
    );
}
