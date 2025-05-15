'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  // Parse initial content if it exists
  let initialContent;
  try {
    initialContent = content ? JSON.parse(content) : null;
  } catch (error) {
    initialContent = null;
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-lg shadow-vintage my-4 max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-vintage-blue underline',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video my-4 rounded-lg overflow-hidden',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your memory here...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  // Utility functions to handle editor commands
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleHeading = (level: 1 | 2 | 3) => 
    editor?.chain().focus().toggleHeading({ level }).run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const addLink = () => {
    const url = window.prompt('Enter the URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };
  const removeLink = () => editor?.chain().focus().unsetLink().run();

  // Add image from URL
  const addImage = () => {
    const url = window.prompt('Enter the image URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  // Add YouTube video
  const addYoutubeVideo = () => {
    const url = window.prompt('Enter the YouTube video URL');
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className="rich-text-editor border border-sepia-300 rounded-lg overflow-hidden">
      <div className="toolbar bg-sepia-100 border-b border-sepia-200 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggleHeading(1)}
          className={`toolbar-btn p-1 rounded hover:bg-sepia-200 ${
            editor?.isActive('heading', { level: 1 }) ? 'bg-sepia-200' : ''
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => toggleHeading(2)}
          className={`toolbar-btn p-1 rounded hover:bg-sepia-200 ${
            editor?.isActive('heading', { level: 2 }) ? 'bg-sepia-200' : ''
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => toggleHeading(3)}
          className={`toolbar-btn p-1 rounded hover:bg-sepia-200 ${
            editor?.isActive('heading', { level: 3 }) ? 'bg-sepia-200' : ''
          }`}
          title="Heading 3"
        >
          H3
        </button>
        <div className="h-5 w-px bg-sepia-300 mx-1"></div>
        <button
          type="button"
          onClick={toggleBold}
          className={`toolbar-btn p-1 rounded hover:bg-sepia-200 ${
            editor?.isActive('bold') ? 'bg-sepia-200' : ''
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`toolbar-btn p-1 rounded hover:bg-sepia-200 ${
            editor?.isActive('italic') ? 'bg-sepia-200' : ''
          }`}
          title="Italic"
        >
          I
        </button>
        <div className="h-5 w-px bg-sepia-300 mx-1"></div>
        <button
          type="button"
          onClick={toggleBulletList}
          className={`toolbar-btn p-1 rounded hover:bg-sepia-200 ${
            editor?.isActive('bulletList') ? 'bg-sepia-200' : ''
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`toolbar-btn p-1 rounded hover:bg-sepia-200 ${
            editor?.isActive('orderedList') ? 'bg-sepia-200' : ''
          }`}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="h-5 w-px bg-sepia-300 mx-1"></div>
        <button
          type="button"
          onClick={addLink}
          className={`toolbar-btn p-1 rounded hover:bg-sepia-200 ${
            editor?.isActive('link') ? 'bg-sepia-200' : ''
          }`}
          title="Add Link"
        >
          Link
        </button>
        {editor?.isActive('link') && (
          <button
            type="button"
            onClick={removeLink}
            className="toolbar-btn p-1 rounded hover:bg-sepia-200"
            title="Remove Link"
          >
            Unlink
          </button>
        )}
        <div className="h-5 w-px bg-sepia-300 mx-1"></div>
        <button
          type="button"
          onClick={addImage}
          className="toolbar-btn p-1 rounded hover:bg-sepia-200"
          title="Add Image"
        >
          Image
        </button>
        <button
          type="button"
          onClick={addYoutubeVideo}
          className="toolbar-btn p-1 rounded hover:bg-sepia-200"
          title="Add YouTube Video"
        >
          YouTube
        </button>
      </div>
      
      <div className="p-4 bg-white min-h-[300px]">
        <EditorContent editor={editor} className="prose max-w-none h-full" />
      </div>
    </div>
  );
} 