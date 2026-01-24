'use server'

import { createClient } from '@/utils/supabase/server'
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

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const restaurantName = formData.get('restaurantName') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                restaurant_name: restaurantName,
                role: 'OWNER',
            },
        }
    })

    if (error) {
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    return redirect('/onboarding')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
}
