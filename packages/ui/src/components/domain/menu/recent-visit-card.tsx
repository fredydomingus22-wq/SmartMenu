"use client";

import { motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import { RecentVisit } from "../../../hooks/use-recent-visits";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

interface RecentVisitCardProps {
    visit: RecentVisit;
    onClick: () => void;
}

export function RecentVisitCard({ visit, onClick }: RecentVisitCardProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group"
        >
            <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-orange-500/10">
                    <AvatarImage src={visit.logoUrl || ''} alt={visit.name} />
                    <AvatarFallback className="bg-orange-50 text-orange-600 font-bold">
                        {visit.name[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="text-left">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{visit.name}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
                        <Clock className="w-3 h-3" />
                        <span>Vistado em {new Date(visit.lastVisited).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center transition-colors group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 text-zinc-300 group-hover:text-orange-500">
                <ChevronRight className="w-4 h-4" />
            </div>
        </motion.button>
    );
}
