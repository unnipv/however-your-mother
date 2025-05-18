import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Memory } from '@/types';

export async function GET() {
  try {
    const today = new Date();
    const currentMonth = today.getUTCMonth() + 1; // Use UTC month
    const currentDay = today.getUTCDate(); // Use UTC day

    // Phase 1: Try to find a memory with a matching memory_date (month and day)
    const { data: memories, error: memoryDateError } = await supabase
      .from('memories')
      .select('*')
      .filter('memory_date', 'not.is', null)
      // Supabase doesn't directly support extracting month/day from a date column in a filter.
      // This will require a more complex query or fetching more data and filtering in code.
      // For simplicity in this step, let's fetch recent memories and filter,
      // or acknowledge this limitation and proceed with a less precise match for now.
      // A proper solution would involve a database function or view.

      // Temporary approach: fetch all non-null memory_date memories and filter in code.
      // This is NOT performant for large datasets.
      .order('created_at', { ascending: false }); // Order to potentially get a recent one if many match

    if (memoryDateError) {
        console.error("Error fetching memories by memory_date:", memoryDateError);
        // Don't throw yet, try fallback
    }

    let onThisDayMemory: Memory | null = null;
    const matchingMemories: Memory[] = [];

    if (memories && memories.length > 0) {
      for (const memory of memories) {
        if (memory.memory_date) {
          const memoryDate = new Date(memory.memory_date);
          // Adjust for potential timezone issues if memory_date is stored as date string without timezone
          // For "YYYY-MM-DD" strings, new Date() can interpret them as UTC.
          // To ensure local timezone interpretation for comparison, it's safer to parse manually or use a library.
          // For this example, assuming dates are generally comparable after new Date()
          const memoryMonth = memoryDate.getUTCMonth() + 1; 
          const memoryDay = memoryDate.getUTCDate();
          if (memoryMonth === currentMonth && memoryDay === currentDay) {
            matchingMemories.push(memory);
          }
        }
      }
    }
    
    if (matchingMemories.length > 0) {
      onThisDayMemory = matchingMemories[Math.floor(Math.random() * matchingMemories.length)];
    }

    // Phase 2: If no memory found with matching memory_date, fallback to created_at
    if (!onThisDayMemory) {
      const { data: createdAtMemories, error: createdAtError } = await supabase
        .from('memories')
        .select('*')
        // Again, direct month/day extraction in filter is tricky.
        // Fetch recent and filter in code.
        .order('created_at', { ascending: false });
        // .limit(100); // Consider limiting if dataset is large

      if (createdAtError) {
        console.error("Error fetching memories by created_at for fallback:", createdAtError);
        // If both queries fail, then we throw an error
        if (memoryDateError && createdAtError) {
            // Propagate the error, ensuring cache headers are set in the catch block
            throw createdAtError; 
        }
      }

      const matchingCreatedAtMemories: Memory[] = [];
      if (createdAtMemories && createdAtMemories.length > 0) {
        for (const memory of createdAtMemories) {
          const createdAtDate = new Date(memory.created_at);
           // Using UTC functions for consistency, assuming created_at is a timestamp
          const createdAtMonth = createdAtDate.getUTCMonth() + 1;
          const createdAtDay = createdAtDate.getUTCDate();

          if (createdAtMonth === currentMonth && createdAtDay === currentDay) {
            matchingCreatedAtMemories.push(memory);
          }
        }
      }
      if (matchingCreatedAtMemories.length > 0) {
        onThisDayMemory = matchingCreatedAtMemories[Math.floor(Math.random() * matchingCreatedAtMemories.length)];
      }
    }

    if (onThisDayMemory) {
      return NextResponse.json(onThisDayMemory, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } else {
      return NextResponse.json({ message: "No memory found for this day in previous years." }, {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

  } catch (error) {
    console.error("Failed to fetch 'On This Day' memory:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch 'On This Day' memory";
    return NextResponse.json({ message: errorMessage }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
} 