import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import argon2 from 'argon2';

// POST to verify a password for a memory
export async function POST(request: Request) {
  try {
    const { memoryId, password: plainTextPassword } = await request.json();

    if (!memoryId || typeof plainTextPassword !== 'string') {
      return NextResponse.json({ message: "Invalid input: memoryId and password are required" }, { status: 400 });
    }

    const { data: memory, error: fetchError } = await supabase
      .from('memories')
      .select('id, password') // Select id for confirmation and password hash
      .eq('id', memoryId)
      .single();

    if (fetchError || !memory) {
      console.error('Error fetching memory or memory not found:', fetchError);
      return NextResponse.json({ verified: false, message: "Memory not found or error fetching data" }, { status: 404 });
    }

    if (!memory.password) {
      // This case means the memory exists but has no password set.
      // Depending on desired behavior, you could allow access or deny.
      // For now, if a password attempt is made on a non-password-protected memory, deny.
      return NextResponse.json({ verified: false, message: "Memory is not password protected" }, { status: 401 });
    }

    const isPasswordCorrect = await argon2.verify(memory.password, plainTextPassword);

    if (isPasswordCorrect) {
      return NextResponse.json({ verified: true, message: "Password verified successfully" });
    } else {
      return NextResponse.json({ verified: false, message: "Incorrect password" }, { status: 401 });
    }

  } catch (error) {
    console.error("Password verification process failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Password verification failed";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
} 