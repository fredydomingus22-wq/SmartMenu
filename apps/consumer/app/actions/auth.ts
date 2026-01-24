'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const tenantId = formData.get('tenantId') as string | null

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        const errorUrl = tenantId
            ? `/login?tenantId=${tenantId}&error=${encodeURIComponent(error.message)}`
            : `/login?error=${encodeURIComponent(error.message)}`;
        return redirect(errorUrl);
    }

    if (tenantId) {
        return redirect(`/menu/${tenantId}`);
    }

    return redirect('/');
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const tenantId = formData.get('tenantId') as string | null

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: 'CUSTOMER',
            },
        }
    })

    if (error) {
        const errorUrl = tenantId
            ? `/login?tenantId=${tenantId}&error=${encodeURIComponent(error.message)}`
            : `/login?error=${encodeURIComponent(error.message)}`;
        return redirect(errorUrl);
    }

    if (tenantId) {
        return redirect(`/menu/${tenantId}?message=${encodeURIComponent("Conta criada com sucesso! Verifique o seu email.")}`);
    }

    return redirect(`/login?message=${encodeURIComponent("Conta criada com sucesso! Verifique o seu email.")}`);
}

export async function signOut(tenantId?: string) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    if (tenantId) {
        return redirect(`/login?tenantId=${tenantId}`);
    }
    return redirect('/login')
}
