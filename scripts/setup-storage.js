const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ykjkdyesejssidyqwqpc.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
    const bucketName = 'product-gallery'

    console.log(`Checking bucket: ${bucketName}`)
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
        console.error('Error listing buckets:', listError)
        return
    }

    const exists = buckets.some(b => b.name === bucketName)
    if (!exists) {
        console.log(`Creating bucket: ${bucketName}`)
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/*']
        })
        if (createError) console.error('Error creating bucket:', createError)
        else console.log('Bucket created successfully')
    } else {
        console.log('Bucket already exists')
    }

    // Now, let's ensure RLS policies are set for anonymous/authenticated access if needed
    // However, createBucket with public: true should handle public READ. 
    // For UPLOAD, we need policies. Since we are using an API key (service role) in this script, it might bypass RLS,
    // but the APP uses the user session.
}

setupStorage()
