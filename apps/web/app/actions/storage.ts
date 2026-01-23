'use server'

import { createClient } from '@/utils/supabase/server'

export async function uploadProductImage(formData: FormData, productId?: string) {
    const supabase = await createClient()
    const file = formData.get('image') as File

    if (!file || file.size === 0) return null

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    // If productId is provided, organize by folder, otherwise simpler structure for now or temp
    const filePath = productId ? `${productId}/${fileName}` : `${fileName}`

    // Use product-gallery if migration is complete, otherwise fallback to product-images?
    // User requested product-gallery usage in task.
    // Assuming product-gallery is the new standard.
    const bucket = 'product-gallery'

    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

    if (error) {
        console.error('UPLOAD ERROR:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to upload image: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

    return publicUrl
}

export async function uploadProductImages(files: File[], productId: string): Promise<string[]> {
    const supabase = await createClient()
    const uploadedUrls: string[] = []
    const bucket = 'product-gallery'

    for (const file of files) {
        if (!file || file.size === 0) continue

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${productId}/${fileName}`

        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file)

        if (error) {
            console.error('GALLERY UPLOAD ERROR:', JSON.stringify(error, null, 2))
            continue // Skip failed uploads but try others
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
}
