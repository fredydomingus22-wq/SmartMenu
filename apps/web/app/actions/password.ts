'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
        return redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
    }

    return redirect('/forgot-password?message=Verifique seu email para redefinir a senha')
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
        return redirect('/reset-password?error=As senhas não coincidem')
    }

    if (password.length < 6) {
        return redirect('/reset-password?error=A senha deve ter pelo menos 6 caracteres')
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        return redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
    }

    return redirect('/login?message=Senha redefinida com sucesso! Faça login.')
}

export async function resendConfirmationEmail(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        }
    })

    if (error) {
        return redirect(`/confirm-email?error=${encodeURIComponent(error.message)}`)
    }

    return redirect('/confirm-email?message=Email reenviado! Verifique sua caixa de entrada.')
}
