'use server'

import { createClient } from '@/utils/supabase/server'

export async function uploadChatImage(formData: FormData) {
    const supabase = await createClient()
    const file = formData.get('image') as File

    if (!file || file.size === 0) return null

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const bucket = 'chat-attachments'

    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

    if (error) {
        console.error('CHAT UPLOAD ERROR:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to upload image: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

    return publicUrl
}
