'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    return redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = (formData.get('email') as string)?.toLowerCase()
    const password = formData.get('password') as string
    const restaurantName = formData.get('restaurantName') as string

    console.log('[AuthAction] Starting signup for:', { email, restaurantName });

    // 1. Check if email already exists in our UserProfile (via Prisma)
    const existingUser = await prisma.userProfile.findUnique({
        where: { email }
    });

    if (existingUser) {
        console.log('[AuthAction] Signup failed: Email already exists');
        return redirect(`/login?error=${encodeURIComponent('Este e-mail já está registado. Por favor, faça login.')}`)
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                restaurant_name: restaurantName,
                role: 'OWNER',
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/onboarding`,
        }
    })

    if (error) {
        console.error('[AuthAction] Signup error:', error);
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    console.log('[AuthAction] Signup successful, redirecting to onboarding. User ID:', data.user?.id);
    return redirect('/onboarding')
}


export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
}
