import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import CodeBlock from "@tiptap/extension-code-block";


const SuperEditor = ({ value, setValue }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlock,
    ],
    content: value || "<p></p>",
    onUpdate({ editor }) {
      setValue(editor.getHTML());
    },
  });

  const insertVar = (text) => {
    editor.chain().focus().insertContent(text).run();
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="border rounded-md shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2 p-2 border-b bg-gray-50 rounded-t-md">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded font-bold">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded italic">I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded underline">U</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className="px-2 py-1 border rounded line-through">S</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2 py-1 border rounded">H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">UL</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">OL</button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-2 py-1 border rounded">HR</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="px-2 py-1 border rounded">Quote</button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="px-2 py-1 border rounded">Code</button>
        <button onClick={() => editor.chain().focus().setLink({ href: prompt("Enter URL") || "" }).run()} className="px-2 py-1 border rounded">Link</button>
        <button onClick={addImage} className="px-2 py-1 border rounded">Image</button>
        <button onClick={() => insertVar("{{App_Name}}")} className="px-2 py-1 border rounded bg-blue-500 text-white">App_Name</button>
        <button onClick={() => insertVar("{{App_Logo}}")} className="px-2 py-1 border rounded bg-blue-500 text-white">App_Logo</button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[400px] p-3"
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0 0 0.375rem 0.375rem",
          backgroundColor: "white",
        }}
      />
    </div>
  );
};

export default SuperEditor;
