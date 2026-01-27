// import React from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
// import { Table } from "@tiptap/extension-table";
// import { TableRow } from "@tiptap/extension-table-row";
// import { TableCell } from "@tiptap/extension-table-cell";
// import { TableHeader } from "@tiptap/extension-table-header";
// import CodeBlock from "@tiptap/extension-code-block";


// const SuperEditor = ({ value, setValue, style }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link,
//       Image,
//       Table.configure({ resizable: true }),
//       TableRow,
//       TableHeader,
//       TableCell,
//       CodeBlock,
//     ],
//     content: value || "<p></p>",
//     onUpdate({ editor }) {
//       setValue(editor.getHTML());
//     },
//   });

//   const insertVar = (text) => {
//     editor.chain().focus().insertContent(text).run();
//   };

//   const addImage = () => {
//     const url = prompt("Enter image URL");
//     if (url) editor.chain().focus().setImage({ src: url }).run();
//   };
  
  

//   if (!editor) return null;

//   return (
//     <div
//       className="border rounded-md shadow-sm flex flex-col"
//       style={style} // { height: "500px", width: "100%" }
//     >
//       {/* Toolbar */}
//       <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50 rounded-t-md">
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className="px-2 py-1 border rounded font-bold"
//         >
//           B
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className="px-2 py-1 border rounded italic"
//         >
//           I
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className="px-2 py-1 border rounded underline"
//         >
//           U
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className="px-2 py-1 border rounded line-through"
//         >
//           S
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 1 }).run()
//           }
//           className="px-2 py-1 border rounded"
//         >
//           H1
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 2 }).run()
//           }
//           className="px-2 py-1 border rounded"
//         >
//           H2
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className="px-2 py-1 border rounded"
//         >
//           UL
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className="px-2 py-1 border rounded"
//         >
//           OL
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setHorizontalRule().run()}
//           className="px-2 py-1 border rounded"
//         >
//           HR
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           className="px-2 py-1 border rounded"
//         >
//           Quote
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           className="px-2 py-1 border rounded"
//         >
//           Code
//         </button>
//         <button
//           onClick={() =>
//             editor
//               .chain()
//               .focus()
//               .setLink({ href: prompt("Enter URL") || "" })
//               .run()
//           }
//           className="px-2 py-1 border rounded"
//         >
//           Link
//         </button>
//         <button onClick={addImage} className="px-2 py-1 border rounded">
//           Image
//         </button>
//         <button
//           onClick={() => insertVar("{{App_Name}}")}
//           className="px-2 py-1 border rounded bg-blue-500 text-white"
//         >
//           App_Name
//         </button>
//         <button
//           onClick={() => insertVar("{{App_Logo}}")}
//           className="px-2 py-1 border rounded bg-blue-500 text-white"
//         >
//           App_Logo
//         </button>
//       </div>

//       {/* Editor Content */}
//       <EditorContent
//         editor={editor}
//         className="flex-1 p-3 w-full overflow-auto"
//         style={{
//           border: "1px solid #e5e7eb",
//           borderRadius: "0 0 0.375rem 0.375rem",
//           backgroundColor: "white",
//           height: "100%", // 🔥 fill parent
//           minHeight: "0", // 🔥 allow flex grow to work
//         }}
//       />
//     </div>
//   );
// };

// export default SuperEditor;

// import React from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
// import { Table } from "@tiptap/extension-table";
// import { TableRow } from "@tiptap/extension-table-row";
// import { TableCell } from "@tiptap/extension-table-cell";
// import { TableHeader } from "@tiptap/extension-table-header";
// import CodeBlock from "@tiptap/extension-code-block";

// const SuperEditor = ({ value, setValue, style }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link,
//       Image,
//       Table.configure({ resizable: true }),
//       TableRow,
//       TableHeader,
//       TableCell,
//       CodeBlock,
//     ],
//     content: value || "<p></p>",
//     onUpdate({ editor }) {
//       setValue(editor.getHTML());
//     },
//   });

//   if (!editor) {
//     return null;
//   }

//   const insertVar = (text) => {
//     editor.chain().focus().insertContent(text).run();
//   };

//   const addImage = () => {
//     const url = prompt("Enter image URL");
//     if (url) editor.chain().focus().setImage({ src: url }).run();
//   };

//   return (
//     <div style={style}>
//       {/* Toolbar */}
//       <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50 rounded-t-md">
//         {/* Bold */}
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={`px-2 py-1 border rounded font-bold transition ${
//             editor.isActive("bold")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           B
//         </button>

//         {/* Italic */}
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={`px-2 py-1 border rounded italic transition ${
//             editor.isActive("italic")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           I
//         </button>

//         {/* Underline */}
//         <button
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className={`px-2 py-1 border rounded underline transition ${
//             editor.isActive("underline")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           U
//         </button>

//         {/* Strike */}
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={`px-2 py-1 border rounded line-through transition ${
//             editor.isActive("strike")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           S
//         </button>

//         {/* H1 */}
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 1 }).run()
//           }
//           className={`px-2 py-1 border rounded transition ${
//             editor.isActive("heading", { level: 1 })
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           H1
//         </button>

//         {/* H2 */}
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 2 }).run()
//           }
//           className={`px-2 py-1 border rounded transition ${
//             editor.isActive("heading", { level: 2 })
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           H2
//         </button>

//         {/* Bullet List */}
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={`px-2 py-1 border rounded transition ${
//             editor.isActive("bulletList")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           UL
//         </button>

//         {/* Ordered List */}
//         <button
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={`px-2 py-1 border rounded transition ${
//             editor.isActive("orderedList")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           OL
//         </button>

//         {/* Blockquote */}
//         <button
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           className={`px-2 py-1 border rounded transition ${
//             editor.isActive("blockquote")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           Quote
//         </button>

//         {/* Code Block */}
//         <button
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           className={`px-2 py-1 border rounded transition ${
//             editor.isActive("codeBlock")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           Code
//         </button>

//         {/* Link */}
//         <button
//           onClick={() => {
//             const url = prompt("Enter URL");
//             if (url) editor.chain().focus().setLink({ href: url }).run();
//           }}
//           className={`px-2 py-1 border rounded transition ${
//             editor.isActive("link")
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           Link
//         </button>

//         {/* Image */}
//         <button
//           onClick={addImage}
//           className="px-2 py-1 border rounded bg-white hover:bg-gray-100 transition"
//         >
//           Image
//         </button>

//         {/* Variables */}
//         <button
//           onClick={() => insertVar("{{App_Name}}")}
//           className="px-2 py-1 border rounded bg-blue-500 text-white"
//         >
//           App_Name
//         </button>

//         <button
//           onClick={() => insertVar("{{App_Logo}}")}
//           className="px-2 py-1 border rounded bg-blue-500 text-white"
//         >
//           App_Logo
//         </button>
//       </div>

//       {/* Editor */}
//       <EditorContent
//         editor={editor}
//         className="p-3 border rounded-b-md min-h-[180px]"
//       />
//     </div>
//   );
// };

// export default SuperEditor;

import React, { useState } from "react";
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

const SuperEditor = ({ value, setValue, style }) => {
  // ✅ UI STATE (ONLY FOR BUTTON ON/OFF COLOR)
  const [activeButtons, setActiveButtons] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  });

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

  if (!editor) return null;

  const toggleButton = (key, action) => {
    editor.chain().focus()[action]().run();
    setActiveButtons((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const insertVar = (text) => {
    editor.chain().focus().insertContent(text).run();
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const btnClass = (isActive) =>
    `px-2 py-1 border rounded transition ${
      isActive
        ? "bg-blue-500 text-white"
        : "bg-white hover:bg-gray-100"
    }`;

  return (
    <div style={style}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50 rounded-t-md">
        {/* Bold */}
        <button
          onClick={() => toggleButton("bold", "toggleBold")}
          className={btnClass(activeButtons.bold)}
        >
          <b>B</b>
        </button>

        {/* Italic */}
        <button
          onClick={() => toggleButton("italic", "toggleItalic")}
          className={btnClass(activeButtons.italic)}
        >
          <i>I</i>
        </button>

        {/* Underline */}
        <button
          onClick={() => toggleButton("underline", "toggleUnderline")}
          className={btnClass(activeButtons.underline)}
        >
          <u>U</u>
        </button>

        {/* Strike */}
        <button
          onClick={() => toggleButton("strike", "toggleStrike")}
          className={btnClass(activeButtons.strike)}
        >
          <s>S</s>
        </button>

        {/* H1 */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={btnClass(editor.isActive("heading", { level: 1 }))}
        >
          H1
        </button>

        {/* H2 */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btnClass(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>

        {/* UL */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
        >
          UL
        </button>

        {/* ✅ OL (ADDED) */}
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
        >
          OL
        </button>

        {/* ✅ HR (ADDED) */}
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnClass(false)}
        >
          HR
        </button>

        {/* ✅ Quote (ADDED) */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive("blockquote"))}
        >
          Quote
        </button>

        {/* Code Block */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btnClass(editor.isActive("codeBlock"))}
        >
          Code
        </button>

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={btnClass(editor.isActive("link"))}
        >
          Link
        </button>

        {/* Image */}
        <button onClick={addImage} className={btnClass(false)}>
          Image
        </button>

        {/* Variables */}
        <button
          onClick={() => insertVar("{{App_Name}}")}
          className="px-2 py-1 border rounded bg-blue-500 text-white"
        >
          App_Name
        </button>

        <button
          onClick={() => insertVar("{{App_Logo}}")}
          className="px-2 py-1 border rounded bg-blue-500 text-white"
        >
          App_Logo
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-3 border rounded-b-md min-h-[180px]"
      />
    </div>
  );
};

export default SuperEditor;
