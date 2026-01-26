"use client";

import { useState, useEffect, useCallback } from 'react';

export interface RecentVisit {
    id: string;
    name: string;
    logoUrl?: string | null;
    lastVisited: string;
}

const STORAGE_KEY = 'sm_recent_visits';
const MAX_VISITS = 10;

export function useRecentVisits() {
    const [visits, setVisits] = useState<RecentVisit[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setVisits(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse recent visits', e);
            }
        }
    }, []);

    const addVisit = useCallback((visit: RecentVisit) => {
        setVisits(current => {
            // Remove if already exists to move to top
            const filtered = current.filter(v => v.id !== visit.id);
            const updated = [visit, ...filtered].slice(0, MAX_VISITS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearVisits = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setVisits([]);
    }, []);

    return { visits, addVisit, clearVisits };
}
