'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const tenantId = formData.get('tenantId') as string | null
    const returnTo = formData.get('returnTo') as string | null

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        let errorUrl = `/login?error=${encodeURIComponent(error.message)}`;
        if (tenantId) errorUrl += `&tenantId=${tenantId}`;
        if (returnTo) errorUrl += `&returnTo=${encodeURIComponent(returnTo)}`;
        return redirect(errorUrl);
    }

    if (returnTo) {
        return redirect(returnTo);
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
    const returnTo = formData.get('returnTo') as string | null

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: 'CUSTOMER',
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback${returnTo ? `?next=${encodeURIComponent(returnTo)}` : ''}`
        }
    })

    if (error) {
        let errorUrl = `/login?error=${encodeURIComponent(error.message)}`;
        if (tenantId) errorUrl += `&tenantId=${tenantId}`;
        if (returnTo) errorUrl += `&returnTo=${encodeURIComponent(returnTo)}`;
        return redirect(errorUrl);
    }

    const successMsg = "Conta criada! Verifique o seu email para confirmar.";
    let successUrl = `/login?message=${encodeURIComponent(successMsg)}`;
    if (tenantId) successUrl += `&tenantId=${tenantId}`;
    if (returnTo) successUrl += `&returnTo=${encodeURIComponent(returnTo)}`;

    return redirect(successUrl);
}

export async function signOut(tenantId?: string) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    if (tenantId) {
        return redirect(`/login?tenantId=${tenantId}`);
    }
    return redirect('/login')
}
