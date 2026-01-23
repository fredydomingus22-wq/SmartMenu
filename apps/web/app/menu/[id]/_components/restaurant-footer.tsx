"use client";

import { Instagram, Facebook, Globe, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TenantBranding, FooterConfig } from "../_types";

interface FooterProps {
    branding?: TenantBranding;
    footerConfig?: FooterConfig;
}

export function RestaurantFooter({ branding, footerConfig }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const socials = footerConfig?.socials || {};
    const contact = footerConfig?.contactInfo || {};

    return (
        <footer className="bg-muted/30 border-t mt-20">
            <div className="w-full px-4 sm:px-8 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
                    {/* Brand Info */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {branding?.logoUrl && (
                                <div className="relative h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={branding.logoUrl}
                                        alt={branding.tenantName || "Logo"}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <h2 className="text-xl font-black tracking-tight uppercase">
                                {branding?.tenantName || "SmartMenu"}
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            {branding?.tenantName ? `Bem-vindo ao ${branding.tenantName}. Experiência gastronómica de excelência.` : "Experiência gastronómica premium impulsionada por tecnologia."}
                        </p>
                    </div>

                    {/* Contact & Location */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Contacto</h3>
                        <ul className="space-y-3">
                            {contact.phone && (
                                <li className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                    <Phone className="h-4 w-4" />
                                    <a
                                        href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Contactar por WhatsApp: ${contact.phone}`}
                                    >
                                        {contact.phone}
                                    </a>
                                </li>
                            )}
                            {contact.email && (
                                <li className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                    <Mail className="h-4 w-4" />
                                    <a
                                        href={`mailto:${contact.email}`}
                                        aria-label={`Enviar email para ${contact.email}`}
                                    >
                                        {contact.email}
                                    </a>
                                </li>
                            )}
                            {contact.address && (
                                <li className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                    <MapPin className="h-4 w-4 mt-0.5" />
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`} target="_blank" rel="noopener noreferrer">
                                        {contact.address}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Socials & Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Redes Sociais</h3>
                        <div className="flex gap-4">
                            {socials.instagram && (
                                <a
                                    href={socials.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-background border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                    aria-label="Siga-nos no Instagram"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {socials.facebook && (
                                <a
                                    href={socials.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-background border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                    aria-label="Curta nossa página no Facebook"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-background border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                aria-label="Visite nosso site"
                            >
                                <Globe className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t flex flex-col sm:row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                    <p>© {currentYear} {branding?.tenantName}. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <Link href={`/menu/${branding?.tenantId}/about`} className="hover:text-primary transition-colors">Sobre Nós</Link>
                        <Link href={`/menu/${branding?.tenantId}/allergens`} className="hover:text-primary transition-colors">Alergénicos</Link>
                        <Link href={`/menu/${branding?.tenantId}/privacy`} className="hover:text-primary transition-colors">Privacidade</Link>
                        <Link href={`/menu/${branding?.tenantId}/terms`} className="hover:text-primary transition-colors">Termos</Link>
                        <span className="flex items-center gap-1.5 grayscale opacity-70">
                            Powered by <span className="text-foreground font-black">SmartMenu</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
