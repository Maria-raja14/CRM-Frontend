import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import CodeBlock from "@tiptap/extension-code-block";
import { Node, mergeAttributes } from "@tiptap/core";

/* ===== IMAGE TOOLBAR BUTTON ===== */
const ImgBtn = ({ onClick, title, active, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
    title={title}
    style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: 6,
      border: active ? "1.5px solid #6366f1" : "1.5px solid transparent",
      background: active ? "#eef2ff" : "rgba(255,255,255,0.15)",
      color: active ? "#4f46e5" : "#e2e8f0",
      fontSize: 13, cursor: "pointer", flexShrink: 0, transition: "all 0.12s",
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.28)"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
  >
    {children}
  </button>
);

const ISep = () => (
  <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.18)", margin: "0 2px", flexShrink: 0 }} />
);

/* ===== RESIZABLE IMAGE NODE VIEW ===== */
const ResizableImageView = ({ node, updateAttributes, selected }) => {
  const { src, alt, width, align, marginTop, marginLeft } = node.attrs;
  const [showToolbar, setShowToolbar] = useState(false);
  const wrapperRef = useRef(null);

  const containerStyle = {
    position: "relative", display: "block",
    textAlign: align || "left",
    marginTop: marginTop ?? 8, marginBottom: 8,
    marginLeft: align === "center" ? "auto" : (marginLeft ?? 0),
    marginRight: align === "center" ? "auto" : 0,
    outline: selected ? "2px solid #6366f1" : "none",
    borderRadius: 10, userSelect: "none",
  };

  const imgStyle = {
    width: width || "auto", height: "auto", maxWidth: "100%", borderRadius: 8,
    boxShadow: selected
      ? "0 0 0 3px rgba(99,102,241,0.35), 0 4px 16px rgba(0,0,0,0.12)"
      : showToolbar ? "0 0 0 2px rgba(99,102,241,0.25)" : "0 2px 10px rgba(0,0,0,0.08)",
    display: "inline-block", verticalAlign: "bottom",
    cursor: "pointer", transition: "box-shadow 0.15s",
  };

  const changeSize  = (d) => { const c = parseInt(width) || 400; updateAttributes({ width: Math.max(60, Math.min(1200, c + d)), height: "auto" }); };
  const changeAlign = (a) => updateAttributes({ align: a });
  const changeMargin = (dir, d) => {
    if (dir === "up")    updateAttributes({ marginTop:  Math.max(0, (node.attrs.marginTop  ?? 8) - d) });
    if (dir === "down")  updateAttributes({ marginTop:  Math.max(0, (node.attrs.marginTop  ?? 8) + d) });
    if (dir === "left")  updateAttributes({ marginLeft: Math.max(0, (node.attrs.marginLeft ?? 0) - d) });
    if (dir === "right") updateAttributes({ marginLeft: Math.max(0, (node.attrs.marginLeft ?? 0) + d) });
  };
  const setCorner = (c) => {
    if (c === "top-left")     updateAttributes({ marginTop: 0,  marginLeft: 0,      align: "left"  });
    if (c === "top-right")    updateAttributes({ marginTop: 0,  marginLeft: "auto", align: "right" });
    if (c === "bottom-left")  updateAttributes({ marginTop: 16, marginLeft: 0,      align: "left"  });
    if (c === "bottom-right") updateAttributes({ marginTop: 16, marginLeft: "auto", align: "right" });
  };

  useEffect(() => {
    if (!showToolbar) return;
    const hide = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowToolbar(false); };
    document.addEventListener("mousedown", hide);
    return () => document.removeEventListener("mousedown", hide);
  }, [showToolbar]);

  return (
    <NodeViewWrapper style={containerStyle} ref={wrapperRef} tabIndex={0}>
      {showToolbar && (
        <div
          contentEditable={false}
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            marginTop: 8, zIndex: 200, display: "flex", alignItems: "center", gap: 3,
            padding: "5px 8px", background: "rgba(15,23,42,0.96)", borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)", backdropFilter: "blur(12px)",
            whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <ImgBtn onClick={() => changeAlign("left")}   title="Align left"   active={align === "left"}  ><span>⇤</span></ImgBtn>
          <ImgBtn onClick={() => changeAlign("center")} title="Align center" active={align === "center"}><span>↔</span></ImgBtn>
          <ImgBtn onClick={() => changeAlign("right")}  title="Align right"  active={align === "right"} ><span>⇥</span></ImgBtn>
          <ISep />
          <ImgBtn onClick={() => changeSize(-40)} title="Shrink"><span style={{ fontSize: 16 }}>−</span></ImgBtn>
          <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", minWidth: 44, textAlign: "center" }}>{parseInt(width) || "auto"}px</span>
          <ImgBtn onClick={() => changeSize(40)}  title="Grow"  ><span style={{ fontSize: 16 }}>+</span></ImgBtn>
          <ISep />
          <ImgBtn onClick={() => changeMargin("up",    8)} title="Move up"   ><span style={{ color: "#a5b4fc" }}>↑</span></ImgBtn>
          <ImgBtn onClick={() => changeMargin("down",  8)} title="Move down" ><span style={{ color: "#a5b4fc" }}>↓</span></ImgBtn>
          <ImgBtn onClick={() => changeMargin("left",  8)} title="Move left" ><span style={{ color: "#a5b4fc" }}>←</span></ImgBtn>
          <ImgBtn onClick={() => changeMargin("right", 8)} title="Move right"><span style={{ color: "#a5b4fc" }}>→</span></ImgBtn>
          <ISep />
          <ImgBtn onClick={() => setCorner("top-left")}    title="↖ Top-left"    ><span style={{ color: "#fbbf24", fontSize: 11 }}>↖</span></ImgBtn>
          <ImgBtn onClick={() => setCorner("top-right")}   title="↗ Top-right"   ><span style={{ color: "#fbbf24", fontSize: 11 }}>↗</span></ImgBtn>
          <ImgBtn onClick={() => setCorner("bottom-left")} title="↙ Bottom-left" ><span style={{ color: "#fbbf24", fontSize: 11 }}>↙</span></ImgBtn>
          <ImgBtn onClick={() => setCorner("bottom-right")}title="↘ Bottom-right"><span style={{ color: "#fbbf24", fontSize: 11 }}>↘</span></ImgBtn>
          <ISep />
          <ImgBtn onClick={() => updateAttributes({ width: 120,   height: "auto" })} title="Small 120px" ><span style={{ color: "#86efac", fontSize: 10 }}>S</span></ImgBtn>
          <ImgBtn onClick={() => updateAttributes({ width: 300,   height: "auto" })} title="Med 300px"   ><span style={{ color: "#86efac", fontSize: 10 }}>M</span></ImgBtn>
          <ImgBtn onClick={() => updateAttributes({ width: 600,   height: "auto" })} title="Large 600px" ><span style={{ color: "#86efac", fontSize: 10 }}>L</span></ImgBtn>
          <ImgBtn onClick={() => updateAttributes({ width: "100%",height: "auto" })} title="Full width"  ><span style={{ color: "#86efac", fontSize: 10 }}>Full</span></ImgBtn>
          <ISep />
          <ImgBtn onClick={() => setShowToolbar(false)} title="Close toolbar">
            <span style={{ color: "#f87171", fontSize: 13, fontWeight: 700 }}>✕</span>
          </ImgBtn>
        </div>
      )}
      <img
        src={src} alt={alt || ""} style={imgStyle} draggable={false}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowToolbar(p => !p); }}
      />
      {selected && (
        <div
          contentEditable={false}
          onMouseDown={(e) => {
            e.preventDefault();
            const sx = e.clientX, sw = parseInt(width) || 400;
            const onMove = mv => updateAttributes({ width: Math.max(60, Math.min(1200, sw + (mv.clientX - sx))), height: "auto" });
            const onUp   = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
            window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
          }}
          style={{
            position: "absolute", bottom: 4, right: 4, width: 14, height: 14, borderRadius: "50%",
            background: "#6366f1", border: "2px solid #fff", cursor: "se-resize",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)", zIndex: 10,
          }}
          title="Drag to resize"
        />
      )}
    </NodeViewWrapper>
  );
};

/* ===== TIPTAP NODE EXTENSION ===== */
const ResizableImage = Node.create({
  name: "resizableImage", group: "block", atom: true, draggable: true,
  addAttributes() {
    return {
      src: { default: null }, alt: { default: null }, width: { default: 400 }, height: { default: "auto" },
      align: { default: "left" }, marginTop: { default: 8 }, marginBottom: { default: 8 },
      marginLeft: { default: 0 }, marginRight: { default: 0 },
    };
  },
  parseHTML() { return [{ tag: "img[src]" }]; },
  renderHTML({ HTMLAttributes }) {
    const { width, height, align, marginTop, marginBottom, marginLeft, marginRight, ...rest } = HTMLAttributes;
    return ["img", mergeAttributes(rest, {
      style:
        `width:${width}px;height:auto;max-width:100%;border-radius:8px;display:block;` +
        `margin-top:${marginTop}px;margin-bottom:${marginBottom}px;` +
        `margin-left:${align === "center" ? "auto" : `${marginLeft}px`};` +
        `margin-right:${align === "center" ? "auto" : "0"};`,
    })];
  },
  addNodeView() { return ReactNodeViewRenderer(ResizableImageView); },
  addCommands() {
    return { insertResizableImage: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs }) };
  },
});

/* ===== ICONS ===== */
const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  bold:      "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z",
  italic:    "M19 4h-9M14 20H5M15 4L9 20",
  underline: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16",
  strike:    "M17.3 12H6.7M10 7.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5M9.5 16.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5",
  ul:        "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  ol:        "M10 6h11M10 12h11M10 18h11M4 6h.01M4 12h.01M4 18h.01",
  quote:     "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  code:      "M16 18l6-6-6-6M8 6l-6 6 6 6",
  table:     "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  hr:        "M5 12h14",
  undo:      "M3 7v6h6M3 13A9 9 0 1 0 5.27 5.27",
  redo:      "M21 7v6h-6M21 13A9 9 0 1 1 18.73 5.27",
  paperclip: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  trash:     "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  file:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
};

/* ===== TOOLBAR BUTTON ===== */
const ToolBtn = ({ onClick, active = false, title, children, pill = false, danger = false }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 5, height: 30, padding: pill ? "0 10px" : "0 7px", borderRadius: 7,
      border: active ? "1px solid #c7d2fe" : danger ? "1px solid #fecaca" : "1px solid transparent",
      background: active ? "#eef2ff" : danger ? "#fff1f2" : "transparent",
      color: active ? "#4f46e5" : danger ? "#ef4444" : "#64748b",
      fontSize: 12, fontWeight: 500, cursor: "pointer",
      transition: "all 0.13s", whiteSpace: "nowrap", flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      if (!active && !danger) { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#1e293b"; }
      if (danger) e.currentTarget.style.background = "#fee2e2";
    }}
    onMouseLeave={(e) => {
      if (!active && !danger) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }
      if (danger) e.currentTarget.style.background = "#fff1f2";
    }}
  >
    {children}
  </button>
);

const Sep = () => <div style={{ width: 1, height: 20, background: "#e2e8f0", margin: "0 3px", flexShrink: 0 }} />;

/* ===== NEW FILE CHIP (non-image files attached via editor Attach button) ===== */
const NewFileChip = ({ name, size, onRemove }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 4px 3px 8px", background: "#f0f4ff",
    border: "1px solid #c7d2fe", borderRadius: 20,
    fontSize: 12, color: "#4338ca", maxWidth: 270,
  }}>
    <Icon d={ICONS.file} size={12} />
    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130, fontWeight: 500 }}>{name}</span>
    <span style={{ color: "#94a3b8", fontSize: 10, flexShrink: 0 }}>
      {size < 1024 ? `${size}B` : size < 1048576 ? `${(size / 1024).toFixed(1)}KB` : `${(size / 1048576).toFixed(1)}MB`}
    </span>
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
      title="Remove"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 17, height: 17, borderRadius: "50%",
        background: "#e0e7ff", border: "none", cursor: "pointer",
        color: "#6366f1", fontSize: 10, fontWeight: 700, flexShrink: 0,
        transition: "background 0.12s, color 0.12s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#e0e7ff"; e.currentTarget.style.color = "#6366f1"; }}
    >✕</button>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   SUPER EDITOR
   Props:
     value          {string}  — controlled HTML
     setValue       {fn}      — HTML setter
     style          {object}  — wrapper CSS
     onFilesChange  {fn}      — called with File[] of new non-image attachments
   ═══════════════════════════════════════════════════════════════ */
const SuperEditor = ({ value, setValue, style, onFilesChange }) => {
  const [charCount,        setCharCount]        = useState(0);
  const [newFiles,         setNewFiles]         = useState([]);  // File[]
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { if (onFilesChange) onFilesChange(newFiles); }, [newFiles]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      CodeBlock, ResizableImage,
    ],
    content: value || "<p></p>",
    onUpdate({ editor }) {
      setValue(editor.getHTML());
      setCharCount(editor.getText().length);
    },
    editorProps: { attributes: { class: "super-editor-body" } },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = value || "<p></p>";
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, false);
      setCharCount(editor.getText().length);
    }
  }, [value, editor]);

  const insertTable = () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

  const handleFileAttach = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    picked.filter(f => f.type.startsWith("image/")).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        editor.chain().focus().insertResizableImage({ src: ev.target.result, alt: file.name, width: 400 }).run();
      };
      reader.readAsDataURL(file);
    });
    const nonImages = picked.filter(f => !f.type.startsWith("image/"));
    if (nonImages.length) {
      setNewFiles(prev => {
        const names = new Set(prev.map(f => f.name));
        return [...prev, ...nonImages.filter(f => !names.has(f.name))];
      });
    }
    e.target.value = "";
  };

  const removeNewFile = (name) => setNewFiles(prev => prev.filter(f => f.name !== name));

  const clearAll = () => {
    editor.chain().focus().clearContent().run();
    setNewFiles([]);
    setCharCount(0);
    setValue("<p></p>");
    if (onFilesChange) onFilesChange([]);
    setShowClearConfirm(false);
  };

  if (!editor) return null;
  const a = (type, attrs) => editor.isActive(type, attrs);

  return (
    <>
      <style>{`
        .se-wrap{display:flex;flex-direction:column;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(15,23,42,.06)}
        .se-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:2px;padding:8px 10px;background:#f8fafc;border-bottom:1px solid #e2e8f0}
        .se-scroll{flex:1;overflow-y:auto;overflow-x:hidden;background:#fff;cursor:text;position:relative}
        .super-editor-body{min-height:100%;padding:20px 24px;outline:none;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.75;color:#334155;caret-color:#6366f1}
        .super-editor-body p{margin:0 0 .8em}.super-editor-body p:last-child{margin-bottom:0}
        .super-editor-body h1{font-size:2rem;font-weight:700;color:#0f172a;margin:1.2em 0 .45em;letter-spacing:-.02em}
        .super-editor-body h2{font-size:1.45rem;font-weight:700;color:#1e293b;margin:1.1em 0 .4em}
        .super-editor-body h3{font-size:1.15rem;font-weight:600;color:#334155;margin:1em 0 .35em}
        .super-editor-body strong{font-weight:700;color:#0f172a}
        .super-editor-body em{color:#475569;font-style:italic}
        .super-editor-body u{text-decoration:underline;text-decoration-color:#818cf8;text-underline-offset:3px}
        .super-editor-body s{color:#94a3b8}
        .super-editor-body ul{list-style:disc;padding-left:1.6em;margin:.4em 0 .8em}
        .super-editor-body ol{list-style:decimal;padding-left:1.6em;margin:.4em 0 .8em}
        .super-editor-body li{margin:.25em 0}
        .super-editor-body blockquote{border-left:3px solid #818cf8;margin:1em 0;padding:.6em 1.1em;background:#fafafe;color:#64748b;border-radius:0 8px 8px 0;font-style:italic}
        .super-editor-body pre{background:#0f172a;color:#e2e8f0;padding:14px 18px;border-radius:10px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:13px;overflow-x:auto;margin:.8em 0}
        .super-editor-body code{background:#f1f5f9;color:#6366f1;padding:2px 6px;border-radius:5px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.875em;border:1px solid #e2e8f0}
        .super-editor-body pre code{background:none;color:inherit;border:none;padding:0}
        .super-editor-body hr{border:none;border-top:2px solid #e2e8f0;margin:1.5em 0}
        .super-editor-body table{border-collapse:collapse;width:100%;margin:1em 0;font-size:14px}
        .super-editor-body th{background:#f8fafc;font-weight:600;color:#334155;padding:9px 14px;border:1px solid #e2e8f0;text-align:left}
        .super-editor-body td{padding:8px 14px;border:1px solid #e2e8f0;color:#475569}
        .super-editor-body tr:nth-child(even) td{background:#fafbfc}
        .super-editor-body p.is-editor-empty:first-child::before{content:"Start writing…";color:#cbd5e1;pointer-events:none;float:left;height:0}
        .se-img-tip{display:flex;align-items:center;gap:6px;padding:6px 14px;background:linear-gradient(90deg,#eff6ff,#f0fdf4);border-top:1px solid #bfdbfe;font-size:11.5px;color:#1d4ed8;font-family:system-ui,sans-serif}
        .se-file-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:10px 14px;background:#fafbff;border-top:1px solid #e5e9f8}
        .se-footer{display:flex;align-items:center;justify-content:space-between;padding:5px 14px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;font-family:system-ui,sans-serif;flex-shrink:0}
        .se-clear-overlay{position:fixed;inset:0;background:rgba(15,23,42,.4);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px)}
        .se-clear-box{background:#fff;border-radius:16px;padding:30px 36px;box-shadow:0 24px 64px rgba(15,23,42,.18);text-align:center;max-width:360px;width:90%}
      `}</style>

      {showClearConfirm && (
        <div className="se-clear-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="se-clear-box" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>🗑️</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Clear editor content?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.65 }}>
              The written content and newly attached files will be cleared.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button type="button" onClick={() => setShowClearConfirm(false)}
                style={{ padding: "9px 22px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "transparent", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button type="button" onClick={clearAll}
                style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Yes, clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="se-wrap" style={style}>
        {/* Toolbar */}
        <div className="se-toolbar">
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Icon d={ICONS.undo} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Icon d={ICONS.redo} /></ToolBtn>
          <Sep />
          {[1, 2, 3].map(lvl => (
            <ToolBtn key={lvl} onClick={() => editor.chain().focus().toggleHeading({ level: lvl }).run()}
              active={a("heading", { level: lvl })} title={`Heading ${lvl}`} pill>
              <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 12 }}>H{lvl}</span>
            </ToolBtn>
          ))}
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}      active={a("bold")}      title="Bold"         ><Icon d={ICONS.bold}      /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}    active={a("italic")}    title="Italic"       ><Icon d={ICONS.italic}    /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={a("underline")} title="Underline"    ><Icon d={ICONS.underline} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()}    active={a("strike")}    title="Strikethrough"><Icon d={ICONS.strike}    /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()}  active={a("bulletList")}  title="Bullet list"  ><Icon d={ICONS.ul}    /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={a("orderedList")} title="Numbered list"><Icon d={ICONS.ol}    /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={a("blockquote")}  title="Blockquote"   ><Icon d={ICONS.quote} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()}   active={a("codeBlock")}   title="Code block"   ><Icon d={ICONS.code}  /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule" pill>
            <Icon d={ICONS.hr} size={13} /><span>HR</span>
          </ToolBtn>
          <Sep />
          <ToolBtn onClick={() => fileInputRef.current?.click()} title="Attach files (images embed inline, others show as chips)" pill>
            <Icon d={ICONS.paperclip} size={13} /><span>Attach</span>
          </ToolBtn>
          <input ref={fileInputRef} type="file" multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
            style={{ display: "none" }} onChange={handleFileAttach}
          />
          <ToolBtn onClick={insertTable} title="Insert 3×3 table" pill>
            <Icon d={ICONS.table} size={13} /><span>Table</span>
          </ToolBtn>
          <Sep />
          <ToolBtn onClick={() => setShowClearConfirm(true)} title="Clear editor" danger pill>
            <Icon d={ICONS.trash} size={13} /><span>Clear</span>
          </ToolBtn>
        </div>

        {/* Image tip */}
        <div className="se-img-tip">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 5l-5-5L5 20" />
          </svg>
          {/* <span><strong>Images:</strong> click the Image open resize/align toolbar · click again or ✕ to close</span> */}
          <span>
  <strong>Images:</strong> Upload an image using the attachment option. 
  Click the image to access resize and alignment tools. 
  Click the image again or ✕ to close the toolbar.
</span>
        </div>

        {/* Editor body */}
        <div className="se-scroll" onClick={() => editor.chain().focus().run()}>
          <EditorContent editor={editor} style={{ minHeight: "100%" }} />
        </div>

        {/* New (non-image) file chips — only files attached THIS session via Attach button */}
        {newFiles.length > 0 && (
          <div className="se-file-chips">
            <span style={{
              fontSize: 11, color: "#6366f1", fontFamily: "system-ui,sans-serif",
              display: "flex", alignItems: "center", gap: 4, marginRight: 4, flexShrink: 0, fontWeight: 600,
            }}>
              <Icon d={ICONS.paperclip} size={11} />
              {newFiles.length} new file{newFiles.length !== 1 ? "s" : ""}
            </span>
            {newFiles.map(f => (
              <NewFileChip key={f.name} name={f.name} size={f.size} onRemove={() => removeNewFile(f.name)} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="se-footer">
          <span style={{ display: "flex", gap: 8 }}>
            {a("bold")      && <span style={{ fontWeight: 700, color: "#475569" }}>Bold</span>}
            {a("italic")    && <span style={{ fontStyle: "italic", color: "#475569" }}>Italic</span>}
            {a("codeBlock") && <span style={{ fontFamily: "monospace", color: "#6366f1" }}>Code</span>}
            {[1, 2, 3].map(l => a("heading", { level: l }) && <span key={l} style={{ color: "#334155", fontWeight: 600 }}>H{l}</span>)}
          </span>
          <span style={{ display: "flex", gap: 14 }}>
            {newFiles.length > 0 && <span style={{ color: "#6366f1" }}>📎 {newFiles.length}</span>}
            <span>{charCount.toLocaleString()} chars</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default SuperEditor;//all work corrrectly..