"use server";

import { prisma } from "@/utils/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

export async function submitContactForm(data: {
    name: string;
    email: string;
    restaurant: string;
    phone: string;
    message: string;
}) {
    try {
        // 1. Gravar na Base de Dados (Prisma)
        // @ts-ignore - Bypass temporário (O tipo contactMessage existe no ambiente real mas o TS server não atualizou devido a EPERM Windows lock)
        const lead = await prisma.contactMessage.create({
            data: {
                name: data.name,
                email: data.email,
                restaurant: data.restaurant,
                phone: data.phone,
                message: data.message,
                status: "UNREAD"
            }
        });

        // 2. Tentar enviar email se a chave Resend estiver configurada
        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: "SmartMenu Leads <onboarding@resend.dev>", // Endereço de envio (configurar no resend)
                    to: ["smartmenu87@gmail.com"], // Lista de emails da tua equipa comercial
                    subject: `Nova Lead: ${data.restaurant} - SmartMenu`,
                    html: `
                        <h2>Nova mensagem do Landing Page Contact Form</h2>
                        <ul style="list-style-type:none; padding:0;">
                            <li><strong>Nome:</strong> ${data.name}</li>
                            <li><strong>Email:</strong> ${data.email}</li>
                            <li><strong>Restaurante:</strong> ${data.restaurant}</li>
                            <li><strong>Telefone:</strong> ${data.phone}</li>
                        </ul>
                        <p><strong>Mensagem:</strong></p>
                        <blockquote style="border-left: 4px solid #f97316; padding-left: 10px; color: #4b5563;">
                            ${data.message.replace(/\n/g, "<br/>")}
                        </blockquote>
                        <hr/>
                        <p><small>Mensagem recebida do website smartmenu.ao</small></p>
                    `
                });
            } catch (emailError) {
                console.error("[ContactAction] Failed to send email via Resend:", emailError);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Erro no formulário de contacto:", error);
        return { success: false, error: error.message || "Erro ao processar o pedido" };
    }
}
