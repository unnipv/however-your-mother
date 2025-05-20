import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import heic2any from 'heic2any';

export interface CustomImageOptions {
  HTMLAttributes: Record<string, string | number | boolean>;
  uploadImage: (file: File) => Promise<string>;
}

// Master function to process (convert HEIC if needed) and upload the file
async function processAndUploadFile(file: File): Promise<string> {
  let fileToUpload: File | Blob = file;
  let fileName = file.name;
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || fileName.toLowerCase().endsWith('.heic') || fileName.toLowerCase().endsWith('.heif');

  if (isHeic) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8,
      });
      const resultingBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      fileName = fileName.substring(0, fileName.lastIndexOf('.') || fileName.length) + '.jpeg';
      fileToUpload = new File([resultingBlob], fileName, {
          type: 'image/jpeg',
          lastModified: new Date().getTime(),
      });
      console.log('HEIC converted to JPEG for Tiptap upload:', fileName);
    } catch (conversionError) {
      console.error('Error converting HEIC to JPEG in Tiptap:', conversionError);
      throw new Error('Failed to convert HEIC image. Please try a different format.');
    }
  }

  const formData = new FormData();
  formData.append('file', fileToUpload, fileName);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Image upload failed in Tiptap');
  }

  const result = await response.json();
  if (!result.publicUrl) {
    throw new Error('Image URL not found in API response for Tiptap');
  }
  return result.publicUrl;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
    };
  }
}

export const CustomImageExtension = Node.create<CustomImageOptions>({
  name: 'customImage',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      uploadImage: processAndUploadFile, // Ensure this assignment is correct
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('customImageHandler'),
        props: {
          handlePaste: (view, event, slice) => {
            const items = Array.from(event.clipboardData?.items || []);
            let imageFile: File | null = null;

            items.forEach(item => {
              if (item.type.indexOf('image') === 0) {
                const file = item.getAsFile();
                if (file) imageFile = file;
              }
            });
            
            if (!imageFile) { 
                slice.content.forEach(node => {
                    if (node.type.name === 'text' && node.text) {
                        const urlRegex = /https?:\/\/\S+\.(?:jpg|jpeg|gif|png|webp|bmp|svg)(?:\?\S*)?/gi;
                        const matches = [...node.text.matchAll(urlRegex)];
                        if (matches.length > 0) {
                            const imageUrl = matches[0][0];
                            const { schema } = view.state;
                            const imageNode = schema.nodes.customImage.create({ src: imageUrl });
                            const transaction = view.state.tr.replaceSelectionWith(imageNode);
                            view.dispatch(transaction);
                            event.preventDefault(); 
                            return true; 
                        }
                    }
                });
                return false; 
            }

            if (imageFile) {
              event.preventDefault();
              this.options.uploadImage(imageFile) // Ensure this calls the correct function
                .then(src => {
                  const { schema } = view.state;
                  const node = schema.nodes.customImage.create({ src });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                })
                .catch(error => {
                  console.error('Error uploading pasted image:', error);
                });
              return true; 
            }
            return false; 
          },
          handleDrop: (view, event, slice, moved) => {
            if (moved || !event.dataTransfer) {
              return false;
            }
            const files = Array.from(event.dataTransfer.files);
            const imageFile = files.find(file => file.type.startsWith('image/'));

            if (imageFile) {
              event.preventDefault();
              this.options.uploadImage(imageFile) // Ensure this calls the correct function
                .then(src => {
                  const { state } = view;
                  const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  if (!coordinates) return;
                  const node = state.schema.nodes.customImage.create({ src });
                  const transaction = state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                })
                .catch(error => {
                  console.error('Error uploading dropped image:', error);
                });
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
}); 