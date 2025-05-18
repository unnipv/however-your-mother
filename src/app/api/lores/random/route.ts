import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch 2 random approved lore entries
    // Using a view or function for true randomness can be more performant on large datasets,
    // but for moderate size, ORDER BY random() is often acceptable.
    const { data, error } = await supabase
      .from('lores')
      .select('id, content, created_at') // Only select necessary fields
      .eq('is_approved', true) // Only fetch approved lores
      // .order('random()') // This syntax might not be directly supported or optimal
      // .limit(2);

    // Alternative for fetching random rows if .order('random()') is problematic:
    // 1. Get all approved lore IDs.
    // 2. Pick 2 random IDs in JS.
    // 3. Fetch those specific lores.
    // This is more complex and might be overkill for now.

    // A simpler approach for now: Fetch all, then pick random in JS. 
    // WARNING: Not performant for very large numbers of lores.
    // Consider a database function for better performance with large tables.
    let allApprovedLores;
    if (!error && data) {
      allApprovedLores = data;
    } else {
      const { data: allData, error: allError } = await supabase
        .from('lores')
        .select('id, content, created_at')
        .eq('is_approved', true);
      if (allError) throw allError;
      allApprovedLores = allData;
    }
    
    if (!allApprovedLores || allApprovedLores.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty if no approved lores
    }

    const randomLores = allApprovedLores.sort(() => 0.5 - Math.random()).slice(0, 2);

    return NextResponse.json(randomLores);
  } catch (error) {
    console.error("Failed to fetch random lores:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch random lores";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
} 