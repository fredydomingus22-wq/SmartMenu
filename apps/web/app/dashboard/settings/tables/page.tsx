import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client-server";
import { redirect } from "next/navigation";
import TablesClientPage from "./client";

export default async function TablesPage() {
    const { user, token, error } = await getAuthorizedClient();

    if (error || !user || !token) {
        return redirect("/login");
    }

    interface Table {
        id: string;
        number: number;
        tenantId: string;
        _count?: {
            orders: number;
        };
    }

    let tables: Table[] = [];
    try {
        const response = await apiClient.get<Table[]>("/tables");
        tables = Array.isArray(response) ? response : [];
    } catch (e) {
        console.error("Error fetching tables:", e);
    }

    return <TablesClientPage initialTables={tables} />;
}
