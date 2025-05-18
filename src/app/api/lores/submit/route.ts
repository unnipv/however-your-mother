import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import * as z from 'zod';

// Schema for validating incoming lore data (matches the form schema)
const loreSchema = z.object({
  content: z.string().min(10).max(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loreSchema.safeParse(body);

    if (!parsed.success) {
      // Extract error messages for a more user-friendly response
      const errorMessages = parsed.error.errors.map(err => `${err.path.join('.')} - ${err.message}`).join(', ');
      return NextResponse.json({ message: `Invalid input: ${errorMessages}` }, { status: 400 });
    }

    const { content } = parsed.data;

    // Insert into Supabase, is_approved will default to FALSE as per table definition
    const { data, error } = await supabase
      .from('lores')
      .insert([{ content: content }]) // No need to specify is_approved or created_at
      .select()
      .single();

    if (error) {
      console.error("Supabase error submitting lore:", error);
      // Check for specific Supabase errors if needed, e.g., RLS issues
      if (error.code === '42501') { // Example: RLS policy violation
         return NextResponse.json({ message: "Submission failed: Permission denied. Please contact support if this persists." }, { status: 403 });
      }
      return NextResponse.json({ message: "Failed to submit lore to the database." }, { status: 500 });
    }

    return NextResponse.json({ message: "Lore submitted successfully! Awaiting approval.", submittedLore: data }, { status: 201 });

  } catch (error) {
    console.error("Error processing lore submission:", error);
    if (error instanceof Error && error.message.includes('JSON Parse error')) {
        return NextResponse.json({ message: "Invalid request format."}, { status: 400});
    }
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
} 