export interface Memory {
  id: string;
  title: string;
  slug: string;
  creator_names?: string | null;
  short_description?: string | null;
  content: RichTextContent | string; // Can be JSON object or stringified JSON
  thumbnail_url?: string | null;
  media_r2_keys?: string[]; // Array of R2 object keys
  spotify_playlist_id?: string | null;
  password?: string | null; // This would be the hashed password
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  memory_date?: string | null; // Optional: ISO date string for the actual memory event
}

export interface MemoryFormData {
  title: string;
  creator_names?: string;
  short_description?: string;
  content: string; // Tiptap content as JSON string
  thumbnail_url?: string;
  spotify_playlist_id?: string;
  password?: string;
  memory_date?: string; // Date of the memory event, YYYY-MM-DD
}

export interface RichTextNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
  text?: string;
  marks?: Mark[];
}

export interface Mark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface RichTextContent {
  type: string;
  content?: RichTextContent[];
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
} 