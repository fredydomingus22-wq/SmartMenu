import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Clube de Recompensas | SmartMenu",
    description: "Crie sua conta em 1 minuto e transforme cada pedido em pontos, descontos e pratos grátis.",
    openGraph: {
        title: "Ganhe Recompensas no SmartMenu",
        description: "O jeito mais inteligente de pedir e ganhar.",
        type: "website",
    }
};

export default function LoyaltyWelcomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
