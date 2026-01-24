import { Button } from "@smart-menu/ui";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-zinc-50">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">
                Smart<span className="text-orange-600">Menu</span>
            </h1>
            <p className="text-lg text-zinc-600 mb-8 max-w-sm">
                Escaneie o código QR na sua mesa para explorar o menu e fazer o seu pedido.
            </p>
            <div className="flex gap-4">
                <Button className="bg-orange-600 hover:bg-orange-700">Ver Menu</Button>
            </div>
        </div>
    );
}
