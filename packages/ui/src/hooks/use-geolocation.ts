"use client";

import { useState, useCallback } from 'react';

export interface GeolocationState {
    loading: boolean;
    error: string | null;
    coords: {
        latitude: number;
        longitude: number;
    } | null;
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        loading: false,
        error: null,
        coords: null,
    });

    const getPosition = useCallback(() => {
        if (!navigator.geolocation) {
            setState(s => ({ ...s, error: "Geolocalização não suportada pelo navegador" }));
            return;
        }

        setState(s => ({ ...s, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    loading: false,
                    error: null,
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                });
            },
            (error) => {
                let errorMsg = "Erro ao obter localização";
                if (error.code === error.PERMISSION_DENIED) {
                    errorMsg = "Permissão de localização negada";
                }
                setState({
                    loading: false,
                    error: errorMsg,
                    coords: null,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    }, []);

    return { ...state, getPosition };
}
