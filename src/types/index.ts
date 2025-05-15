export interface Memory {
  id: string;
  title: string;
  slug: string;
  creator_names?: string;
  short_description?: string;
  content: string; // JSON output from Tiptap editor
  thumbnail_url?: string;
  media_r2_keys?: string[]; // Array of R2 object keys
  spotify_playlist_id?: string;
  password?: string; // Hashed password for protection
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
}

export interface MemoryFormData {
  title: string;
  creator_names?: string;
  short_description?: string;
  content: string;
  spotify_playlist_id?: string;
  password?: string;
  media_files?: File[];
}

export interface RichTextContent {
  type: string;
  content?: RichTextContent[];
  text?: string;
  attrs?: Record<string, any>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
} 