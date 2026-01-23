import { createClient } from './apps/web/utils/supabase/server.ts'

async function checkStorage() {
    try {
        const supabase = await createClient()
        const { data: buckets, error } = await supabase.storage.listBuckets()

        if (error) {
            console.error('Error listing buckets:', error)
            return
        }

        console.log('Available buckets:', buckets.map(b => b.name))

        const galleryExists = buckets.some(b => b.name === 'product-gallery')
        if (!galleryExists) {
            console.log('Creating product-gallery bucket...')
            const { error: createError } = await supabase.storage.createBucket('product-gallery', {
                public: true
            })
            if (createError) console.error('Error creating bucket:', createError)
            else console.log('Bucket created successfully')
        }
    } catch (err) {
        console.error('Diagnostic failed:', err)
    }
}

checkStorage()
