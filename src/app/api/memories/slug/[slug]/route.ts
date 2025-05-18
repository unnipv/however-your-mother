import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request, // request is not used, but needs to be first param for route handlers
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json({ message: 'Slug parameter is required' }, { status: 400 });
    }

    const { data: memory, error } = await supabase
      .from('memories')
      .select('*')
      .eq('slug', slug)
      .single(); // Expects a single record or null

    if (error) {
      // If error is due to no rows found, Supabase single() returns an error
      // PGRST116: "JSON object requested, but multiple rows returned"
      // PGRST116: "JSON object requested, but 0 rows returned"
      // We want to treat "0 rows returned" as a 404, not a 500.
      if (error.code === 'PGRST116' && error.message.includes('0 rows returned')) {
        return NextResponse.json({ message: 'Memory not found' }, { status: 404 });
      }
      console.error(`Error fetching memory by slug ${slug}:`, error);
      throw error; // Let default error handling take over for other errors
    }

    if (!memory) {
      return NextResponse.json({ message: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json(memory);
  } catch (error) {
    console.error("Failed to fetch memory by slug:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch memory by slug";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
} 