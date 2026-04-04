"use client"
import React, { useCallback, useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Send, Image as IconImage, Eye, Edit3, Loader2, Upload, Trash2, CheckCircle2, Terminal, Undo, Redo, Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Link as LinkIcon, X } from "lucide-react"
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Placeholder from "@tiptap/extension-placeholder"
import { common, createLowlight } from "lowlight"
import { toast } from "sonner"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { uploadBlogThumbnail, createResource } from "@/lib/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Toggle } from "@/components/ui/toggle"
import { useDropzone } from "react-dropzone"
import { createRoot } from "react-dom/client"
import { JsIcon, TsIcon, ReactIcon, PythonIcon, SpringIcon, HtmlIcon, CssIcon, NextjsIcon, TailwindIcon } from "mmk-icons"
import { FileCode } from "lucide-react"

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
    case "next":
    case "nextjs": return <NextjsIcon className={style} />
    case "tailwind": return <TailwindIcon className={style} />
    default: return <FileCode className={style} />
  }
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null
  return (
    <div className="flex items-center gap-1 p-2 border-b">
      <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive("heading", { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-4" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const input = document.createElement("input")
          input.type = "file"
          input.accept = "image/*"
          input.onchange = async (e: any) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = async () => {
                const base64 = reader.result as string
                toast.promise(uploadBlogThumbnail(base64, file.name), {
                  loading: "Uploading...",
                  success: (url) => {
                    editor.chain().focus().setImage({ src: url }).run()
                    return "Uploaded"
                  },
                  error: "Failed",
                })
              }
              reader.readAsDataURL(file)
            }
          }
          input.click()
        }}
      >
        <IconImage className="h-4 w-4" />
      </Button>
      <Toggle size="sm" pressed={editor.isActive("codeBlock")} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Terminal className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-4" />
      <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

const CodeBlockComponent = ({ node, updateAttributes }: { node: any, updateAttributes: any }) => {
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
          <input
            className="bg-transparent border-none text-xs font-mono w-full focus:ring-0 outline-none"
            placeholder="Filename..."
            value={filename}
            onChange={e => updateAttributes({ filename: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-transparent border-none text-[10px] uppercase font-bold focus:ring-0 outline-none opacity-50 hover:opacity-100 transition-opacity"
            value={language}
            onChange={e => updateAttributes({ language: e.target.value })}
          >
            <option value="auto">Auto</option>
            <option value="javascript">JS</option>
            <option value="typescript">TS</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            {copied ? <CheckCircle2 className="size-3 text-green-500" /> : <Code className="size-3" />}
          </button>
        </div>
      </div>
      <pre className="p-4 bg-zinc-950 text-zinc-100">
        <NodeViewContent className="font-mono text-sm" />
      </pre>
    </NodeViewWrapper>
  )
}

export default function WriteBlog() {
  const { data: session } = authClient.useSession()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private" | "shared">("public")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link,
      Image,
      CodeBlockLowlight.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            filename: {
              default: null,
              parseHTML: element => element.getAttribute('data-filename'),
              renderHTML: attributes => {
                if (!attributes.filename) return {}
                return { 'data-filename': attributes.filename }
              },
            },
          }
        },
        addNodeView() { return ReactNodeViewRenderer(CodeBlockComponent) },
      }).configure({ lowlight }),
      Placeholder.configure({ placeholder: "Write your blog..." }),
    ],
    onUpdate({ editor }) { setContent(editor.getHTML()) },
    editorProps: { attributes: { class: "prose prose-sm dark:prose-invert focus:outline-none max-w-none min-h-[500px]" } },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: files => {
      if (files[0]) {
        setThumbnail(files[0])
        setPreviewUrl(URL.createObjectURL(files[0]))
      }
    },
    accept: { "image/*": [] },
    maxFiles: 1,
  })

  const handlePublish = async () => {
    if (!session?.user?.id) { toast.error("You must be logged in to publish"); return }
    if (!title.trim() || !content.trim()) { toast.error("Title and content required"); return }
    setIsSubmitting(true)
    try {
      let thumbnailUrl = ""
      if (thumbnail) {
        const reader = new FileReader()
        const base64 = await new Promise<string>(r => { reader.onload = () => r(reader.result as string); reader.readAsDataURL(thumbnail) })
        thumbnailUrl = await uploadBlogThumbnail(base64, thumbnail.name)
      }
      const resource = await createResource({
        title, description, category: "blog", visibility, url: thumbnailUrl, content, authorId: session.user.id, tags
      })
      toast.success("Published!")
      router.push(`/resource/${resource.id}`)
    } catch (e) { toast.error("Failed to publish") } finally { setIsSubmitting(false) }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Write Blog</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <div className="flex gap-2">
            <Button className="cursor-pointer" variant="ghost" size="sm" asChild><NextLink href="/home">Cancel</NextLink></Button>
            <Button className="cursor-pointer" size="sm" onClick={handlePublish} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
              Publish
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
          <Tabs defaultValue="edit" className="flex-1 flex flex-col">
            <div className="px-4 border-b">
              <TabsList className="bg-transparent border-b-0 h-12 gap-6 p-0">
                <TabsTrigger value="edit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none">Edit</TabsTrigger>
                <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none">Preview</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="edit" className="flex-1 flex m-0 overflow-hidden">
              <div className="w-80 border-r bg-muted/10 p-6 space-y-6 overflow-y-auto hidden md:block">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Summary</Label>
                    <Input id="desc" value={description} onChange={e => setDescription(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="shared">Friends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (setTags([...tags, tagInput]), setTagInput(""))} />
                      <Button className="cursor-pointer" variant="secondary" size="sm" onClick={() => (setTags([...tags, tagInput]), setTagInput(""))}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {tags.map(t => <Badge key={t} variant="secondary" className="gap-1">{t} <X className="size-3 cursor-pointer" onClick={() => setTags(tags.filter(i => i !== t))} /></Badge>)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Thumbnail</Label>
                    <div {...getRootProps()} className={cn("border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50", isDragActive && "bg-muted")}>
                      <input {...getInputProps()} />
                      {previewUrl ? <img src={previewUrl} className="w-full aspect-video object-cover rounded-sm mb-2" /> : <Upload className="mx-auto h-8 w-8 text-muted-foreground" />}
                      <p className="text-xs text-muted-foreground">{thumbnail ? "Change image" : "Upload cover"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden bg-background">
                <MenuBar editor={editor} />
                <ScrollArea className="flex-1 p-8">
                  <div className="max-w-3xl mx-auto"><EditorContent editor={editor} /></div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0 bg-background overflow-y-auto p-8">
              <article className="max-w-3xl mx-auto space-y-8">
                <header className="space-y-4">
                  <h1 className="text-4xl font-extrabold">{title || "Untitled"}</h1>
                  <p className="text-xl text-muted-foreground">{description}</p>
                </header>
                {previewUrl && <img src={previewUrl} className="w-full aspect-video object-cover rounded-md border" />}
                <Separator />
                <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
              </article>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
