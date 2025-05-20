import { Node, nodeInputRule } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/react";
import { Plugin } from "prosemirror-state";
import { Editor } from '@tiptap/core';

// Define the type for the upload function
export type UploadFn = (image: File) => Promise<string>;

// The actual upload function that calls our API
const performUpload: UploadFn = async (image: File) => {
  const formData = new FormData();
  formData.append("file", image);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Image upload failed");
    }

    const result = await response.json();
    if (!result.publicUrl) {
      throw new Error("Image public URL not found in API response");
    }
    return result.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    // Consider how to notify the user. For now, rethrow.
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during upload.");
  }
};

interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, string>;
  uploadFn: UploadFn;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType;
    };
  }
}

const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const CustomImageExtension = Node.create<ImageOptions>({
  name: "customImage",

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
          style: 'border-radius: 0.5rem; box-shadow: 2px 2px 0px rgba(0,0,0,0.1); margin: 1rem 0; max-width: 100%; height: auto;',
      },
      uploadFn: performUpload,
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => {
          if (!attributes.src) {
            return {};
          }
          return { src: attributes.src };
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => {
          if (!attributes.alt) {
            return {};
          }
          return { alt: attributes.alt };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }
          return { title: attributes.title };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? "img[src]"
          : 'img[src]:not([src^="data:"])',
        getAttrs: (dom) => {
          if (typeof dom === "string") return {};
          const element = dom as HTMLImageElement;
          const obj = {
            src: element.getAttribute("src"),
            title: element.getAttribute("title"),
            alt: element.getAttribute("alt"),
          };
          return obj;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.type.name,
            attrs: options,
          });
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: IMAGE_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, alt, src, title] = match;
          return { src, alt, title };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    const upload = this.options.uploadFn;

    const isImageUrl = (url: string): boolean => {
      if (!url) return false;
      try {
        const parsedUrl = new URL(url);
        return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(parsedUrl.pathname);
      } catch {
        // Not a valid URL if new URL() throws, and we don't need the error object
        return false;
      }
    };

    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const pastedText = event.clipboardData?.getData('text/plain');

            if (pastedText && isImageUrl(pastedText)) {
              event.preventDefault();
              const { schema } = view.state;
              const node = schema.nodes[this.name].create({ src: pastedText });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
              return true; // We handled it: plain text was an image URL
            }

            // If not a text image URL, proceed to check for file pastes
            const items = Array.from(event.clipboardData?.items || []);
            let filePastedSuccessfully = false; // To track if any file paste was successfully initiated
            
            items.forEach((item) => {
              const imageFile = item.getAsFile();

              if (item.type.indexOf("image") === 0 && imageFile) {
                event.preventDefault(); // Prevent default paste for this image file item
                // Upload logic (ensure 'upload' is defined and accessible, as it is from outer scope)
                upload(imageFile)
                  .then((src) => {
                    const { schema } = view.state; // Re-access schema and view if needed in async
                    const node = schema.nodes[this.name].create({ src });
                    // Need to get current selection at the time of insertion
                    const transaction = view.state.tr.replaceSelectionWith(node);
                    // If the view is still active and editor not destroyed
                    if (view.editable) {
                      view.dispatch(transaction);
                    }
                  })
                  .catch((error) => {
                    console.error("Paste image file upload error:", error);
                    if (typeof window !== 'undefined' && error instanceof Error) {
                      window.alert('Error uploading pasted image: ' + error.message);
                    } else if (typeof window !== 'undefined') {
                      window.alert('An unknown error occurred during pasted image upload.');
                    }
                  });
                filePastedSuccessfully = true; // Mark that we initiated an upload for a file
              }
            });

            if (filePastedSuccessfully) {
              return true; // We handled it: an image file paste was processed
            }
            
            return false; // Let other handlers (like default text paste, link plugin) run
          },
          handleDrop: (view, event: Event) => {
            const dragEvent = event as DragEvent;
            const hasFiles = dragEvent.dataTransfer?.files?.length;

            if (!hasFiles) {
              return false;
            }

            const images = Array.from(
              dragEvent.dataTransfer!.files
            ).filter((file) => /image/i.test(file.type));

            if (images.length === 0) {
              return false;
            }

            event.preventDefault();

            const { schema } = view.state;
            const coordinates = view.posAtCoords({
              left: dragEvent.clientX,
              top: dragEvent.clientY,
            });
            if (!coordinates) return false;

            images.forEach(async (imageFile) => {
              try {
                const src = await upload(imageFile);
                const node = schema.nodes[this.name].create({ src });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              } catch (error) {
                console.error("Drop upload error:", error);
                // Optionally, display an error to the user
                if (typeof window !== 'undefined' && error instanceof Error) {
                  window.alert('Error uploading image: ' + error.message);
                } else if (typeof window !== 'undefined') {
                  window.alert('An unknown error occurred during image upload.');
                }
              }
            });
            return true; // Indicating that the drop event is handled
          },
        },
      }),
    ];
  },
});

export default CustomImageExtension;

// Helper function to be used in the RichTextEditor component for the toolbar button
export const triggerImageUpload = (editor: Editor | null, uploadFnToUse?: UploadFn) => {
  if (!editor) return;
  const upload = uploadFnToUse || performUpload;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      try {
        // Optional: Display a loading indicator here
        const src = await upload(file);
        editor.chain().focus().setImage({ src }).run();
      } catch (error) {
        console.error("Toolbar upload error:", error);
         if (typeof window !== 'undefined' && error instanceof Error) {
            window.alert('Error uploading image: ' + error.message);
          } else if (typeof window !== 'undefined') {
            window.alert('An unknown error occurred during image upload.');
          }
        // Optional: Hide loading indicator and show error message
      }
    }
  };
  input.click();
}; 