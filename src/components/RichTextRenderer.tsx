'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { JSONContent } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image'; // Remove old Image extension
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import CustomImageExtension from '@/lib/tiptapExtensions/customImageExtension'; // Import CustomImageExtension
import React from 'react';

interface RichTextRendererProps {
  content: string;
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // Image, // Remove old Image extension from here
      CustomImageExtension, // Add CustomImageExtension here
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
    // Content will be set by useEffect or a direct update later
    editable: false,
    immediatelyRender: false,
  });

  const { parsedContent, parseError } = React.useMemo(() => {
    try {
      if (content && content.trim() !== "") { // Ensure content is not empty or just whitespace
        return { parsedContent: JSON.parse(content) as JSONContent, parseError: false };
      }
      // Handle empty or whitespace-only content as valid empty content for the editor
      return { parsedContent: null, parseError: false }; 
    } catch (error) {
      console.error('Failed to parse rich text content:', error);
      return { parsedContent: null, parseError: true };
    }
  }, [content]);

  // Update editor content when `parsedContent` or `parseError` changes
  React.useEffect(() => {
    if (editor) {
      if (parseError) {
        editor.commands.clearContent();
        editor.commands.setContent('<p>Error: Could not display content due to parsing error.</p>');
      } else if (parsedContent) {
        // Check if current editor content is different from the new parsedContent
        // This is a basic check; Tiptap might have a more robust way (e.g., editor.state.doc.eq(...))
        // but editor.getJSON() can be expensive to call on every effect run if not careful.
        // For now, direct setContent might be okay if useMemo correctly limits this effect.
        editor.commands.setContent(parsedContent);
      } else {
        // Content is null or empty string, but no parse error (e.g. initial empty memory)
        editor.commands.clearContent(); 
      }
    }
  }, [editor, parsedContent, parseError]);

  // Initial loading state for the editor, or if content parsing resulted in an error state that isn't rendered in editor
  // This specific error div might be redundant if parseError sets content in editor
  if (!editor && parseError) { // if editor hasn't initialized AND there's a parse error
    return <div className="text-vintage-red">Error: Could not display content due to parsing error.</div>;
  }

  if (!editor) {
    return <div className="text-ink/50">Loading editor...</div>; // Or some other placeholder
  }

  return (
    <div className="rich-text-content font-vintage text-ink leading-relaxed">
      <EditorContent editor={editor} />
    </div>
  );
} 