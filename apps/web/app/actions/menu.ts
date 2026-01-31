'use server'

import { apiClient } from '@/utils/api-client-server'
import { revalidatePath, revalidateTag } from 'next/cache'

// --- Categories ---

export async function createCategory(formData: FormData) {
    try {
        const name = formData.get('name') as string
        console.log('Action: createCategory', { name })

        await apiClient.post("/categories", { name });

        console.log('Action: createCategory success')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('categories', 'max' as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('menu', 'max' as any)
    } catch (error) {
        console.error('Action Exception (createCategory):', error)
        throw error
    }
}

export async function deleteCategory(id: string) {
    try {
        console.log('Action: deleteCategory', { id })
        await apiClient.delete(`/categories/${id}`);

        console.log('Action: deleteCategory success')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('categories', 'max' as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('menu', 'max' as any)
    } catch (error) {
        console.error('Action Exception (deleteCategory):', error)
        throw error
    }
}

// --- Products ---

export async function createProduct(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const categoryId = formData.get('categoryId') as string
        const isAvailable = formData.get('isAvailable') === 'true'
        const isFeatured = formData.get('isFeatured') === 'true'
        const isNew = formData.get('isNew') === 'true'
        const isBestSeller = formData.get('isBestSeller') === 'true'

        console.log('Action: createProduct', { name, categoryId })

        // Main Image
        const imageFile = formData.get('image') as File
        let imageUrl = ''

        const { uploadProductImage, uploadProductImages } = await import('./storage')

        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadProductImage(formData) || ''
        }

        // Gallery Images
        const galleryFiles = formData.getAll('gallery') as File[]
        let images: string[] = []
        if (galleryFiles.length > 0) {
            // Upload without productId for new products
            images = await uploadProductImages(galleryFiles, 'temp')
        }

        // Options
        const optionsStr = formData.get('options') as string
        const options = optionsStr ? JSON.parse(optionsStr) : []

        // Marketing
        const upsellsStr = formData.get('upsells') as string
        const upsells = upsellsStr ? JSON.parse(upsellsStr) : undefined
        const recommendationsStr = formData.get('recommendations') as string
        const recommendations = recommendationsStr ? JSON.parse(recommendationsStr) : undefined

        // Metadata (customizations like removals)
        const metadataStr = formData.get('metadata') as string
        const metadata = metadataStr ? JSON.parse(metadataStr) : undefined

        await apiClient.post("/products", {
            name,
            description,
            price,
            categoryId,
            isAvailable,
            imageUrl,
            images,
            options,
            upsells,
            recommendations,
            isFeatured,
            isNew,
            isBestSeller,
            metadata
        });

        console.log('Action: createProduct success')
        revalidatePath('/dashboard/menu/products')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('products', 'max' as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('menu', 'max' as any)
    } catch (error) {
        console.error('Action Exception (createProduct):', error)
        throw error
    }
}

export async function deleteProduct(id: string) {
    try {
        console.log('Action: deleteProduct', { id })
        await apiClient.delete(`/products/${id}`);

        console.log('Action: deleteProduct success')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('products', 'max' as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('menu', 'max' as any)
    } catch (error) {
        console.error('Action Exception (deleteProduct):', error)
    }
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const categoryId = formData.get('categoryId') as string
        const isAvailable = formData.get('isAvailable') === 'true'
        const isFeatured = formData.get('isFeatured') === 'true'
        const isNew = formData.get('isNew') === 'true'
        const isBestSeller = formData.get('isBestSeller') === 'true'

        console.log('Action: updateProduct', { id, name })

        const { uploadProductImage, uploadProductImages } = await import('./storage')

        // Main Image
        const imageFile = formData.get('image') as File
        let imageUrl = formData.get('existingImageUrl') as string

        if (imageFile && imageFile.size > 0) {
            const newUrl = await uploadProductImage(formData)
            if (newUrl) imageUrl = newUrl
        }

        // Gallery Images
        const galleryFiles = formData.getAll('gallery') as File[]
        const existingGalleryUrls = formData.getAll('existingGalleryUrls') as string[]

        let newGalleryUrls: string[] = []
        if (galleryFiles.length > 0) {
            newGalleryUrls = await uploadProductImages(galleryFiles, id)
        }

        const finalImages = [...existingGalleryUrls, ...newGalleryUrls]

        // Options
        const optionsStr = formData.get('options') as string
        const options = optionsStr ? JSON.parse(optionsStr) : undefined

        // Marketing
        const upsellsStr = formData.get('upsells') as string
        const upsells = upsellsStr ? JSON.parse(upsellsStr) : undefined
        const recommendationsStr = formData.get('recommendations') as string
        const recommendations = recommendationsStr ? JSON.parse(recommendationsStr) : undefined

        // Metadata (customizations like removals)
        const metadataStr = formData.get('metadata') as string
        const metadata = metadataStr ? JSON.parse(metadataStr) : undefined

        await apiClient.patch(`/products/${id}`, {
            name,
            description,
            price,
            categoryId,
            isAvailable,
            imageUrl,
            images: finalImages,
            options,
            upsells,
            recommendations,
            isFeatured,
            isNew,
            isBestSeller,
            metadata
        });

        console.log('Action: updateProduct success')
        revalidatePath('/dashboard/menu/products')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('products', 'max' as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        revalidateTag('menu', 'max' as any)
    } catch (error) {
        console.error('Action Exception (updateProduct):', error)
        throw error
    }
}
