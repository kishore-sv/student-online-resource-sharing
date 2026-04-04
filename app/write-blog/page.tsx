"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send, Image as IconImage, Eye, Edit3, Loader2, Upload, Trash2, CheckCircle2, Terminal, Copy, Check } from "lucide-react";
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";
import { toast } from "sonner";
import NextLink from "next/link";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    JsIcon, TsIcon, PythonIcon,
    ReactIcon, NextjsIcon, HtmlIcon,
    CssIcon, TailwindIcon, SpringIcon
} from "mmk-icons";
import { FileCode, Terminal as TerminalIcon } from "lucide-react";

import { createRoot } from "react-dom/client";

const getIconForFile = (filename: string | null, language: string | null) => {
    const ext = filename?.split('.').pop()?.toLowerCase() || language?.toLowerCase();
    const style = "w-4 h-4";

    switch (ext) {
        case 'js':
        case 'javascript': return <JsIcon className={style} />;
        case 'ts':
        case 'typescript': return <TsIcon className={style} />;
        case 'tsx':
        case 'jsx': return <ReactIcon className={style} />;
        case 'py':
        case 'python': return <PythonIcon className={style} />;
        case 'java': return <SpringIcon className={style} />; // Using Spring for Java
        case 'html': return <HtmlIcon className={style} />;
        case 'css': return <CssIcon className={style} />;
        case 'next':
        case 'nextjs': return <NextjsIcon className={style} />;
        case 'tailwind': return <TailwindIcon className={style} />;
        default: return <FileCode className={style} />;
    }
};

// Custom Toolbar Component
import { Toggle } from "@/components/ui/toggle";
import {
    Bold, Italic, Strikethrough, Code,
    List, ListOrdered, Quote, Heading1,
    Heading2, Heading3, Undo, Redo,
    Link as LinkIcon
} from "lucide-react";
import { useDropzone } from "react-dropzone";

const lowlight = createLowlight(common);

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-1 p-1 mb-2 border-b border-border/50 sticky top-0 bg-background z-10 overflow-x-auto no-scrollbar max-w-full">
            <div className="flex items-center gap-1 min-w-max">
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("strike")}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("code")}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("codeBlock")}
                    onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <Terminal className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-4 self-center mx-1" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="h-4 self-center mx-1" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("blockquote")}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
                <div className="ml-2 flex items-center gap-1 border-l pl-2">
                    <Button variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const BlogContentRenderer = ({ content }: { content: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rootsRef = useRef<any[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up old roots in a microtask to avoid flushSync warnings
        const oldRoots = [...rootsRef.current];
        rootsRef.current = [];

        const setupHeaders = () => {
            // Unmount old roots first
            oldRoots.forEach(root => {
                try { root.unmount(); } catch (e) { }
            });

            const preBlocks = containerRef.current?.querySelectorAll('pre');
            preBlocks?.forEach((pre) => {
                // Remove existing injected elements to avoid duplicates
                pre.querySelectorAll('.code-header, .copy-btn').forEach(el => el.remove());

                const filename = pre.getAttribute('data-filename');
                const code = pre.querySelector('code');
                const language = code?.className.split(' ').find(c => c.startsWith('language-'))?.replace('language-', '') || null;

                pre.classList.add('relative', 'group', 'mt-10', 'mb-12', 'rounded-xl', 'overflow-hidden', 'bg-[#0d1117]', 'border', 'border-[#30363d]', 'shadow-2xl');
                pre.style.paddingTop = '3.5rem'; // pt-14
                pre.classList.remove('p-5');
                pre.classList.add('px-5', 'pb-5');

                // Header Container
                const header = document.createElement('div');
                header.className = "code-header absolute top-0 left-0 right-0 h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 rounded-t-xl z-20 pointer-events-none";
                pre.prepend(header);

                const root = createRoot(header);
                root.render(
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center">
                                {getIconForFile(filename, language)}
                            </div>
                            <span className="text-[10px] font-mono text-[#8b949e] font-bold tracking-widest uppercase italic">
                                {filename || (language ? `${language} snippet` : "untitled-resource")}
                            </span>
                        </div>
                    </div>
                );
                rootsRef.current.push(root);

                // Copy Button logic
                const btn = document.createElement('button');
                btn.className = "copy-btn absolute top-2 right-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white/40 hover:text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-white/10 shadow-lg z-30 hidden md:flex items-center justify-center outline-none";
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const copyCode = code?.innerText || pre.innerText;
                    navigator.clipboard.writeText(copyCode);
                    toast.success("Copied to clipboard!");
                    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-400"><path d="M20 6 9 17l-5-5"/></svg>';
                    setTimeout(() => {
                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                    }, 2000);
                };
                pre.appendChild(btn);
            });
        };

        // Defer execution to avoid React rendering conflicts
        const timeoutId = setTimeout(setupHeaders, 0);

        return () => {
            clearTimeout(timeoutId);
            rootsRef.current.forEach(root => {
                try { root.unmount(); } catch (e) { }
            });
        };
    }, [content]);

    return (
        <div ref={containerRef} className="relative group/article w-full">
            <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: content || "<div class='py-20 flex flex-col items-center justify-center text-center opacity-30'><p class='text-lg font-bold'>No content yet...</p><p class='text-sm'>Start typing in the editor to see the magic happen.</p></div>" }}
            />
        </div>
    );
};

const CodeBlockComponent = ({ node, updateAttributes, extension }: { node: any, updateAttributes: any, extension: any }) => {
    const filename = node.attrs.filename || "";
    const language = node.attrs.language || "auto";

    return (
        <NodeViewWrapper className="code-block-wrapper relative group my-6 rounded-xl overflow-hidden border border-border shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/60 border-b border-border transition-colors hover:bg-muted/80">
                <div className="flex items-center gap-2.5 flex-1">
                    <div className="flex items-center justify-center p-1.5 bg-background rounded-lg border border-border/50 shadow-sm">
                        {getIconForFile(filename, language)}
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-0.5">Code Title</label>
                        <input
                            className="bg-transparent border-none outline-none text-[12px] font-mono w-full text-foreground placeholder:text-muted-foreground/40 focus:ring-0 leading-tight"
                            placeholder="e.g. Main.java, style.css, or Snippet Title"
                            value={filename}
                            onChange={(e) => updateAttributes({ filename: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-0.5 items-end">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pr-0.5">Lang</label>
                    <select
                        className="bg-transparent border-none outline-none text-[11px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors font-mono"
                        value={language}
                        onChange={(e) => updateAttributes({ language: e.target.value })}
                    >
                        <option value="auto" className="bg-background">Auto</option>
                        <option value="javascript" className="bg-background">JS</option>
                        <option value="typescript" className="bg-background">TS</option>
                        <option value="python" className="bg-background">Python</option>
                        <option value="java" className="bg-background">Java</option>
                        <option value="cpp" className="bg-background">C++</option>
                    </select>
                </div>
            </div>
            <pre className="p-0 m-0 bg-zinc-950">
                <NodeViewContent className="block p-4 font-mono text-sm leading-relaxed" />
            </pre>
        </NodeViewWrapper>
    );
};

export default function WriteBlog() {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [content, setContent] = useState("");

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setThumbnail(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            toast.success("Thumbnail uploaded successfully!");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"]
        },
        maxFiles: 1
    });

    const removeThumbnail = (e: React.MouseEvent) => {
        e.stopPropagation();
        setThumbnail(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Disable default code block to use lowlight instead
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            CodeBlockLowlight.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        filename: {
                            default: null,
                            parseHTML: element => element.getAttribute('data-filename'),
                            renderHTML: attributes => ({
                                'data-filename': attributes.filename,
                            }),
                        },
                    };
                },
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent);
                },
            }).configure({
                lowlight,
            }),
            Placeholder.configure({
                placeholder: "Start writing your masterpiece...",
            }),
        ],
        content: "",
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert focus:outline-none max-w-none min-h-[500px]",
            },
        },
    });

    const handleSubmit = async () => {
        if (!title || !content) {
            toast.error("Please provide a title and blog content");
            return;
        }

        setIsSubmitting(true);
        // Logic for saving would go here
        setTimeout(() => {
            toast.success("Blog published successfully!");
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
                        <Breadcrumb>
                            <BreadcrumbList>
                                {/* <BreadcrumbItem>
                                    <BreadcrumbLink href="/feed">Feed</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator /> */}
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Write Blog</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                        <NextLink href="/home">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Cancel
                            </Button>
                        </NextLink>
                        <Button size="sm" className="gap-2" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Publish
                        </Button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col pointer-events-auto h-[calc(100vh-4rem)] overflow-hidden">
                    <Tabs defaultValue="editor" className="flex-1 flex flex-col h-full bg-linear-to-b from-background to-muted/10">
                        <div className="px-4 py-2 border-b flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <TabsList className="grid w-64 grid-cols-2">
                                <TabsTrigger value="editor" className="gap-2">
                                    <Edit3 className="h-4 w-4" /> Write
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="gap-2">
                                    <Eye className="h-4 w-4" /> Preview
                                </TabsTrigger>
                            </TabsList>
                            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground italic">
                                All changes are automatically saved
                            </div>
                        </div>

                        <TabsContent value="editor" className="flex-1 p-0 m-0 overflow-hidden focus:outline-none data-[state=inactive]:hidden data-[state=active]:flex">
                            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                                {/* Left Column: Form Details */}
                                <ScrollArea className="w-full md:w-80 border-b md:border-b-0 md:border-r bg-muted/20 shrink-0">
                                    <div className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                                                <Input
                                                    id="title"
                                                    placeholder="Give it a catchy name..."
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="bg-background border-none shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="desc" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Short Summary</Label>
                                                <Input
                                                    id="desc"
                                                    placeholder="What is this about?"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="bg-background border-none shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Thumbnail</Label>
                                                <div
                                                    {...getRootProps()}
                                                    className={`aspect-video rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer relative overflow-hidden group
                                                        ${isDragActive ? "border-primary bg-primary/10" : "border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-primary/5"}
                                                        ${thumbnail ? "border-solid border-primary/20" : ""}
                                                    `}
                                                >
                                                    <input {...getInputProps()} />

                                                    {previewUrl ? (
                                                        <>
                                                            <img
                                                                src={previewUrl}
                                                                alt="Preview"
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                                onLoad={() => {
                                                                    // Image loaded
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <Button
                                                                    size="icon-sm"
                                                                    variant="destructive"
                                                                    onClick={removeThumbnail}
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                                                                    Replace
                                                                </div>
                                                            </div>
                                                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="bg-background/80 p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                                <Upload className="h-6 w-6 text-primary" />
                                                            </div>
                                                            <span className="text-xs font-bold text-foreground">
                                                                {isDragActive ? "Drop here" : "Upload cover image"}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground mt-1">
                                                                JPEG, PNG or WEBP
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>

                                {/* Right Column: Tiptap Editor */}
                                <div className="flex-1 flex flex-col overflow-hidden bg-background/50">
                                    <MenuBar editor={editor} />
                                    <ScrollArea className="flex-1 px-4 md:px-8 py-6">
                                        <div className="max-w-3xl mx-auto pb-20">
                                            <EditorContent editor={editor} />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="flex-1 p-0 m-0 focus:outline-none data-[state=inactive]:hidden data-[state=active]:flex overflow-hidden">
                            <ScrollArea className="flex-1 bg-background">
                                <article className="max-w-3xl mx-auto py-12 px-6 md:px-10">
                                    <header className="space-y-6 mb-12 pb-10 border-b border-border/50">
                                        <div className="space-y-4">
                                            {title ? (
                                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">{title}</h1>
                                            ) : (
                                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-muted-foreground/20 italic leading-[1.1]">Your Title Here</h1>
                                            )}
                                            {description && <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">{description}</p>}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                                                <AvatarImage src={user?.image || ""} alt={user?.name || "Author"} />
                                                <AvatarFallback className="font-bold">{user?.name?.[0] || "?"}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground leading-none">{user?.name || "Anonymous Student"}</span>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span className="w-1 h-1 rounded-full bg-border" />
                                                    <span className="text-[10px] uppercase font-bold tracking-widest">5 min read</span>
                                                </div>
                                            </div>
                                        </div>
                                    </header>

                                    {previewUrl && (
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-border/50 bg-muted/20">
                                            <img
                                                src={previewUrl}
                                                alt="Cover"
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    <BlogContentRenderer content={content} />
                                </article>
                                <div className="h-20" />
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
