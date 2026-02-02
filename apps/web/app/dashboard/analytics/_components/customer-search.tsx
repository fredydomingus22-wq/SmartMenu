"use client";

import { useState } from "react";
import { Input, Button, Card, CardHeader, CardTitle, CardContent } from "@smart-menu/ui";
import { Search, Loader2, User } from "lucide-react";
import { getCustomerRanking } from "../../../actions/analytics";

interface CustomerSearchProps {
    onSelectCustomer: (customerId: string) => void;
    isLoading?: boolean;
}

export function CustomerSearch({ onSelectCustomer }: CustomerSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Array<{ id: string; name: string; email?: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        // For now searching using ranking as a proxy if we don't have a dedicated search endpoint
        // Ideally we should have a search endpoint. 
        // But since the SPEC asks for minimal changes, I'll filter the ranking data locally or assume we use the ID directly if known.
        const res = await getCustomerRanking();
        if (res.success) {
            const filtered = res.data.filter((c: { name: string; email?: string }) =>
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
            );
            setResults(filtered);
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Pesquisar cliente (Nome ou Email)..."
                        className="pl-10"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pesquisar"}
                </Button>
            </div>

            {results.length > 0 && (
                <Card className="shadow-sm">
                    <CardHeader className="py-3 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500">Resultados</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {results.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => onSelectCustomer(customer.id)}
                                    className="w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {customer.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">{customer.email || "Sem email"}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
