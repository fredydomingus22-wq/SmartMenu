"use client";

import { Instagram, Facebook, Globe, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TenantBranding, FooterConfig } from "../_types";
import { useTranslation } from "@/hooks/use-translation";

interface FooterProps {
    branding?: TenantBranding;
    footerConfig?: FooterConfig;
}

export function RestaurantFooter({ branding, footerConfig }: FooterProps) {
    const currentYear = new Date().getFullYear();
    const { t } = useTranslation();

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
                            {branding?.tenantName
                                ? t('footer.welcome', { name: branding.tenantName })
                                : t('footer.default_desc')}
                        </p>
                    </div>

                    {/* Contact & Location */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">{t('footer.contact')}</h3>
                        <ul className="space-y-3">
                            {contact.phone && (
                                <li className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                    <Phone className="h-4 w-4" />
                                    <a
                                        href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={t('footer.contact') + ': ' + contact.phone}
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
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">{t('footer.socials')}</h3>
                        <div className="flex flex-wrap gap-4">
                            {socials.whatsapp && (
                                <a
                                    href={`https://wa.me/${socials.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-background border flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                    aria-label="WhatsApp"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                </a>
                            )}
                            {socials.instagram && (
                                <a
                                    href={socials.instagram.startsWith('http') ? socials.instagram : `https://instagram.com/${socials.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-background border flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-600 hover:text-white transition-all shadow-sm"
                                    aria-label={t('footer.instagram_aria')}
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {socials.facebook && (
                                <a
                                    href={socials.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-background border flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    aria-label={t('footer.facebook_aria')}
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {socials.website && (
                                <a
                                    href={socials.website.startsWith('http') ? socials.website : `https://${socials.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-background border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                    aria-label={t('footer.website_aria')}
                                >
                                    <Globe className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                    <p>{t('footer.rights', { year: currentYear, name: branding?.tenantName || 'SmartMenu' })}</p>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
                        <Link href={`/menu/${branding?.tenantId}/about`} className="hover:text-primary transition-colors">{t('footer.about')}</Link>
                        <Link href={`/menu/${branding?.tenantId}/allergens`} className="hover:text-primary transition-colors">{t('footer.allergens')}</Link>
                        <Link href={`/menu/${branding?.tenantId}/privacy`} className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
                        <Link href={`/menu/${branding?.tenantId}/terms`} className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
                        <span className="flex items-center gap-1.5 grayscale opacity-70">
                            Powered by <span className="text-foreground font-black">SmartMenu</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
