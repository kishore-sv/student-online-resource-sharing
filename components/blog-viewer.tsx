"use client"

import React from "react"
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { JsIcon, TsIcon, ReactIcon, PythonIcon, SpringIcon, HtmlIcon, CssIcon } from "mmk-icons"
import { FileCode, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Markdown } from "tiptap-markdown"

const lowlight = createLowlight(common)

const getIconForFile = (filename: string | null, language: string | null) => {
  const ext = filename?.split(".").pop()?.toLowerCase() || language?.toLowerCase()
  const style = "w-4 h-4"
  switch (ext) {
    case "js":
    case "javascript": return <JsIcon className={style} />
    case "ts":
    case "typescript": return <TsIcon className={style} />
    case "tsx":
    case "jsx": return <ReactIcon className={style} />
    case "py":
    case "python": return <PythonIcon className={style} />
    case "java": return <SpringIcon className={style} />
    case "html": return <HtmlIcon className={style} />
    case "css": return <CssIcon className={style} />
    default: return <FileCode className={style} />
  }
}

const CodeBlockComponent = ({ node }: { node: any }) => {
  const filename = node.attrs.filename || ""
  const language = node.attrs.language || "auto"
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(node.content.textContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Code copied to clipboard")
  }

  return (
    <NodeViewWrapper className="my-6 border rounded-md overflow-hidden bg-muted/40 group/code">
      <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/60">
        <div className="flex-1 flex items-center gap-2">
          {getIconForFile(filename, language)}
          <span className="text-xs font-mono text-muted-foreground">{filename || "code-block"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-muted-foreground opacity-50 mr-2">
            {language !== "auto" ? language : ""}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Copy code"
          >
            {copied ? <CheckCircle2 className="size-3 text-green-500" /> : <Copy className="size-3 text-muted-foreground" />}
          </button>
        </div>
      </div>
      <pre className="p-4 bg-zinc-950 text-zinc-100 overflow-x-auto">
        <NodeViewContent className="font-mono text-sm" />
      </pre>
    </NodeViewWrapper>
  )
}

export function BlogViewer({ content }: { content: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    content,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image,
      Markdown,
      CodeBlockLowlight.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            filename: {
              default: null,
              parseHTML: element => element.getAttribute('data-filename'),
              renderHTML: attributes => ({ 'data-filename': attributes.filename }),
            },
          }
        },
      }).configure({
        lowlight,
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent)
        },
      }),
    ],
  })

  // Update content if it changes
  React.useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!editor) return null

  return (
    <div className="prose dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-code:before:content-none prose-code:after:content-none">
      <EditorContent editor={editor} />
    </div>
  )
}
