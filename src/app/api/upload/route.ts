import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Import createClient directly
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client with Service Role Key for server-side operations
// Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // This check is crucial for server-side only; normally you'd throw an error or handle it.
  // For this API route, if these are not set, it simply won't work.
  console.error('Supabase URL or Service Role Key is missing in environment variables for /api/upload');
  // We will let it proceed and fail at supabaseAdmin.storage if keys are missing,
  // as throwing here would prevent the function from being defined.
  // A more robust setup might have a global check or a different way to handle this.
}

// Create a new Supabase client instance for admin operations
// Note: This client should only be used in server-side code (like API routes)
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client is not configured. Check server logs.' }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, {
        status: 400,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    // Generate a unique file name to prevent overwrites and ensure clean URLs
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${fileName}`; // In Supabase, path is relative to the bucket root

    const { error: uploadError } = await supabaseAdmin.storage
      .from('memory-media') // Ensure this is your bucket name
      .upload(filePath, file, {
        cacheControl: '3600', // Optional: cache control for the stored file itself
        upsert: false, // Do not overwrite if file with same name exists (uuid should prevent this)
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, {
        status: 500,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    // Construct the public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('memory-media')
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error('Failed to get public URL for:', filePath);
      // Note: Even if public URL generation fails, the file is uploaded.
      // Consider if you need to delete it or handle this case differently.
      return NextResponse.json({ error: 'File uploaded but failed to retrieve public URL.' }, {
        status: 500, // Or a partial success status
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }
    
    return NextResponse.json({ publicUrl: publicUrlData.publicUrl }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });

  } catch (err) {
    console.error('Unexpected error in POST /api/upload:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during file upload.';
    return NextResponse.json({ error: errorMessage }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
} 