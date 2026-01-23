import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client";
import { redirect } from "next/navigation";
import TablesClientPage from "./client";

export default async function TablesPage() {
    const { user, token, error } = await getAuthorizedClient();

    if (error || !user || !token) {
        return redirect("/login");
    }

    let tables: any[] = [];
    try {
        tables = await apiClient.get<any[]>("/tables", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!tables) tables = [];
    } catch (e) {
        console.error("Error fetching tables:", e);
    }

    return <TablesClientPage initialTables={tables} />;
}
