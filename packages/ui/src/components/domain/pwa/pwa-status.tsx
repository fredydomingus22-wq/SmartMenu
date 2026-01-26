"use client";

import React from 'react';
import { usePWA } from '../../../hooks/use-pwa';
import { useServiceWorker } from '../../../hooks/use-service-worker';

interface PWAStatusProps {
    className?: string;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({ className = '' }) => {
    const { isInstallable, isOffline, isInstalled, installPWA } = usePWA();
    const { isRegistered, updateAvailable, updateServiceWorker } = useServiceWorker();

    const handleInstall = async () => {
        const success = await installPWA();
        if (success) {
            // Show success message
            console.log('PWA installed successfully!');
        }
    };

    const handleUpdate = () => {
        updateServiceWorker();
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Offline Status */}
            {isOffline && (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span>Offline</span>
                </div>
            )}

            {/* Service Worker Update */}
            {updateAvailable && (
                <button
                    onClick={handleUpdate}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                </button>
            )}

            {/* Install Button */}
            {isInstallable && !isInstalled && (
                <button
                    onClick={handleInstall}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Instalar App
                </button>
            )}

            {/* Installed Status */}
            {isInstalled && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>App Instalado</span>
                </div>
            )}

            {/* Service Worker Status */}
            {isRegistered && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>PWA</span>
                </div>
            )}
        </div>
    );
};
