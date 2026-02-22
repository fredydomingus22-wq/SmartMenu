"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    Button,
    Input,
    Label,
    toast,
} from "@smart-menu/ui";
import { ArrowLeft, Plus, MapPin, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
}

export default function AddressesPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ label: "", street: "", city: "" });

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push('/login'); return; }
            const saved = session.user.user_metadata?.addresses || [];
            setAddresses(saved);
            setLoading(false);
        };
        load();
    }, [supabase, router]);

    const addAddress = async () => {
        const newAddr: Address = { id: Date.now().toString(), ...form };
        const updated = [...addresses, newAddr];
        setAddresses(updated);
        const { error } = await supabase.auth.updateUser({ data: { addresses: updated } });
        if (error) {
            toast.error("Erro ao adicionar endereço", { description: error.message });
        } else {
            toast.success("Endereço adicionado!");
        }
        setForm({ label: "", street: "", city: "" });
        setShowForm(false);
    };

    const removeAddress = async (id: string) => {
        const updated = addresses.filter(a => a.id !== id);
        setAddresses(updated);
        const { error } = await supabase.auth.updateUser({ data: { addresses: updated } });
        if (error) {
            toast.error("Erro ao remover endereço", { description: error.message });
        } else {
            toast.success("Endereço removido.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
    );

    return (
        <AppShell className="bg-zinc-50 dark:bg-black min-h-screen">
            <PageContainer size="sm" className="pt-12 pb-24 space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/account')}
                        className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-black italic tracking-tighter">
                        Meus <span className="text-orange-700 dark:text-orange-400">Endereços</span>
                    </h1>
                </div>

                {addresses.length === 0 && !showForm && (
                    <div className="text-center py-16 space-y-4">
                        <MapPin className="w-12 h-12 mx-auto text-zinc-300" />
                        <p className="text-zinc-400 font-medium">Nenhum endereço guardado.</p>
                    </div>
                )}

                <div className="space-y-3">
                    {addresses.map((addr, idx) => (
                        <motion.div key={addr.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-orange-700 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{addr.label}</h4>
                                    <p className="text-xs text-zinc-400">{addr.street}, {addr.city}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeAddress(addr.id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {showForm && (
                    <div className="space-y-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Nome (ex: Casa, Trabalho)</Label>
                            <Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                                className="h-12 rounded-xl" placeholder="Casa" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Rua / Bairro</Label>
                            <Input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })}
                                className="h-12 rounded-xl" placeholder="Rua do Comércio, Bairro Azul" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Cidade</Label>
                            <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                                className="h-12 rounded-xl" placeholder="Luanda" />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1 h-12 rounded-xl">
                                Cancelar
                            </Button>
                            <Button onClick={addAddress} disabled={!form.label || !form.street}
                                className="flex-1 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold">
                                Guardar
                            </Button>
                        </div>
                    </div>
                )}

                <Button onClick={() => setShowForm(true)}
                    className="w-full h-14 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10 bg-transparent text-zinc-500 hover:text-orange-700 hover:border-orange-200 font-bold gap-2">
                    <Plus className="w-5 h-5" /> Adicionar Endereço
                </Button>
            </PageContainer>
        </AppShell>
    );
}
