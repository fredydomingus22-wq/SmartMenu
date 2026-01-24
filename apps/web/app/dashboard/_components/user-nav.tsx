"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function UserNav({ user }: { user: User }) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const initials = user.email
        ?.substring(0, 2)
        .toUpperCase() || "SM";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Minha Conta</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
