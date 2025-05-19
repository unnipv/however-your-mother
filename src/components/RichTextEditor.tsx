'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import YoutubeExtension from '@tiptap/extension-youtube';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import CustomImageExtension, { triggerImageUpload } from '@/lib/tiptapExtensions/customImageExtension';
import styles from './RichTextEditor.module.css'; // Import the CSS module

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string; // Add className prop
}

export default function RichTextEditor({ content, onChange, className }: RichTextEditorProps) {
  let initialContent;
  try {
    initialContent = content ? JSON.parse(content) : undefined;
  } catch {
    initialContent = undefined;
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      CustomImageExtension.configure({
        // We can rely on the default uploadFn defined in the extension itself,
        // or pass a specific one if needed: uploadFn: yourUploadFunction
        // Default HTMLAttributes are also in the extension, but can be overridden here.
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          // Keeping these inline for now as they are content-specific
          style: 'color: var(--vintage-blue); text-decoration: underline; cursor: pointer;',
        },
      }),
      YoutubeExtension.configure({
        HTMLAttributes: {
          // Keeping these inline for now as they are content-specific
          style: 'width: 100%; aspect-ratio: 16 / 9; margin: 1rem 0; border-radius: 0.5rem; overflow: hidden;',
        },
      }),
      PlaceholderExtension.configure({
        placeholder: 'Share your detailed memory here... add images, videos, and links!',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      onChange(JSON.stringify(jsonContent));
    },
    editorProps: {
      attributes: {
        // Directly set outline to none on the ProseMirror element
        style: 'outline: none !important;', 
        // Other attributes that were here previously for min-height, padding, font, etc., 
        // are now handled by .richTextEditorWrapper .ProseMirror in editor.module.css
        // or by .editorContentArea .ProseMirror in RichTextEditor.module.css as fallbacks.
      },
    },
    immediatelyRender: false,
  });

  const ToolbarButton = ({ onClick, title, children, isActive }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      // Combine base button style with active style if isActive is true
      className={`${styles.toolbarButton} ${isActive ? styles.toolbarButtonActive : ''}`}
      title={title}
    >
      {children}
    </button>
  );

  const addLink = () => {
    const url = window.prompt('Enter the URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    triggerImageUpload(editor);
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter the YouTube video URL');
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  if (!editor) return null;

  // Combine the component's own wrapper class with any passed-in className
  const wrapperClassName = `${styles.editorWrapper} ${className || ''}`.trim();

  return (
    <div className={wrapperClassName}>
      <div className={styles.toolbar}>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="H1">H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="H2">H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="H3">H3</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">B</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">I</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">• List</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">1. List</ToolbarButton>
        <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Link">Link</ToolbarButton>
        <ToolbarButton onClick={addImage} title="Image">Image</ToolbarButton>
        <ToolbarButton onClick={addYoutubeVideo} title="YouTube">YouTube</ToolbarButton>
      </div>
      {/* Apply a class to the EditorContent if needed for specific targeting of ProseMirror parent */}
      <EditorContent editor={editor} className={styles.editorContentArea} />
    </div>
  );
}