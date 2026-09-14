'use client';

import { useEffect } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Markdown } from '@tiptap/markdown';
import {
  Bold,
  Code,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react';

type MarkdownEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
};

type FormatButtonProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function FormatButton({ label, active = false, onClick, children }: FormatButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid size-8 place-items-center rounded-md transition-colors ${
        active ? 'bg-[#4FA1AF] text-white' : 'text-[#4a4a4a] hover:bg-[#edf6f7] hover:text-[#1a1a1a]'
      }`}
    >
      {children}
    </button>
  );
}

export function MarkdownEditor({ value, onChange, readOnly = false }: MarkdownEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Markdown,
    ],
    content: value,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        class: readOnly
          ? 'min-h-52 px-5 py-4 outline-none relative'
          : 'min-h-96 px-5 py-4 outline-none relative',
      },
    },
    onUpdate: ({ editor: updatedEditor }) => onChange?.(updatedEditor.getMarkdown()),
  });

  useEffect(() => {
    if (editor && editor.getMarkdown() !== value) {
      editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="h-96 animate-pulse rounded-xl" />;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Paste a link', previousUrl ?? '');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const isEmpty = editor.getMarkdown().trim() === '';

  return (
    <div className="obsidian-editor overflow-hidden rounded-xl">
      {!readOnly && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ from, to }) => from !== to}
          options={{ placement: 'top', offset: 10 }}
          className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-xl"
        >
          <FormatButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="size-4" />
          </FormatButton>
          <FormatButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="size-4" />
          </FormatButton>
          <FormatButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="size-4" />
          </FormatButton>
          <FormatButton label="Link" active={editor.isActive('link')} onClick={setLink}>
            <LinkIcon className="size-4" />
          </FormatButton>
          <span className="mx-1 h-5 w-px bg-gray-200" />
          <FormatButton label="Heading" active={editor.isActive('heading')} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="size-4" />
          </FormatButton>
          <FormatButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="size-4" />
          </FormatButton>
          <FormatButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="size-4" />
          </FormatButton>
          <FormatButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="size-4" />
          </FormatButton>
          <FormatButton label="Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Code className="size-4" />
          </FormatButton>
        </BubbleMenu>
      )}
      <div className="relative">
        <EditorContent editor={editor} />
        {!readOnly && isEmpty && (
          <div className="absolute top-4 left-5 text-gray-400 pointer-events-none text-base">
            Start typing...
          </div>
        )}
      </div>
    </div>
  );
}
