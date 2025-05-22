"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Heading1,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TiptapEditor({ value, onChange, disabled }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const formatButton = (
    label: string,
    isActive: boolean,
    onClick: () => void,
    icon?: React.ReactNode
  ) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className="px-2"
    >
      {icon || label}
    </Button>
  );

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border p-2 rounded-md bg-gray-100">
        {formatButton(
          "Bold",
          editor.isActive("bold"),
          () => editor.chain().focus().toggleBold().run(),
          <Bold size={16} />
        )}
        {formatButton(
          "Italic",
          editor.isActive("italic"),
          () => editor.chain().focus().toggleItalic().run(),
          <Italic size={16} />
        )}
        {formatButton(
          "Heading",
          editor.isActive("heading", { level: 1 }),
          () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          <Heading1 size={16} />
        )}
        {formatButton(
          "Bullet List",
          editor.isActive("bulletList"),
          () => editor.chain().focus().toggleBulletList().run(),
          <List size={16} />
        )}
        {formatButton(
          "Ordered List",
          editor.isActive("orderedList"),
          () => editor.chain().focus().toggleOrderedList().run(),
          <ListOrdered size={16} />
        )}
        {formatButton(
          "Undo",
          false,
          () => editor.chain().focus().undo().run(),
          <Undo size={16} />
        )}
        {formatButton(
          "Redo",
          false,
          () => editor.chain().focus().redo().run(),
          <Redo size={16} />
        )}
      </div>

      {/* Editor Content */}
      <div className="border border-gray-300 rounded-md bg-white">
        <EditorContent
          editor={editor}
          className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
        />
      </div>
    </div>
  );
}
