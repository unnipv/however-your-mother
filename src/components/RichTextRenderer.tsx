'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';

interface RichTextRendererProps {
  content: string;
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  // Parse the JSON content
  let parsedContent;
  try {
    parsedContent = JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse rich text content:', error);
    return <div className="text-vintage-red">Error displaying content</div>;
  }

  // Create a read-only editor with the parsed content
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-vintage-blue underline',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video my-4 rounded-lg overflow-hidden',
        },
      }),
    ],
    content: parsedContent,
    editable: false,
  });

  return (
    <div className="rich-text-content font-vintage text-ink leading-relaxed">
      {editor && <EditorContent editor={editor} />}
    </div>
  );
} 