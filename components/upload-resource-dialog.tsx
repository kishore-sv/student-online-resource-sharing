"use client"

import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { createResource } from "@/lib/actions"
import { toast } from "sonner"
import FileUpload from "@/components/file-upload"

const AVAILABLE_TOPICS = [
  "Programming", "Mathematics", "Science", "History", "Design", "Business", "Language", "Music", "Other"
]

interface UploadResourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadResourceDialog({ open, onOpenChange }: UploadResourceDialogProps) {
  const { data: session } = authClient.useSession()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [visibility, setVisibility] = useState("Public")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleAddTopic = (topic: string) => {
    if (!topics.includes(topic)) setTopics([...topics, topic])
  }

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic))
  }

  const handleUpload = async () => {
    if (!title || topics.length === 0) {
      toast.error("Please fill in title and select at least one topic")
      return
    }
    if (!session?.user) return

    setIsUploading(true)

    // In a real app, you'd upload these to S3/ImageKit first.
    // For now, we'll simulate it by creating a data list.
    const resourceFiles = selectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file), // Placeholder URL
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type
    }))

    const { error }: any = await createResource({
      title,
      description,
      category: "file",
      visibility: visibility.toLowerCase() as any,
      authorId: session.user.id,
      tags: topics,
      files: resourceFiles,
      url: resourceFiles[0]?.url || "" // Fallback for backward compatibility
    })

    setIsUploading(false)
    if (!error) {
      toast.success("Resource shared!")
      setTitle("")
      setDescription("")
      setTopics([])
      setSelectedFiles([])
      onOpenChange(false)
    } else {
      toast.error(error.message || "Failed to share")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
          <DialogDescription>Fill in the details below to upload your resource.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="upload-title">Title</Label>
            <Input id="upload-title" placeholder="Resource title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-desc">Description</Label>
            <Textarea id="upload-desc" placeholder="What is this about?" className="min-h-[80px]" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Shared">Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Files</Label>
              <FileUpload onChange={setSelectedFiles} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Topics</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {topics.map(topic => (
                <Badge key={topic} variant="secondary" className="gap-1">
                  {topic}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTopic(topic)} />
                </Badge>
              ))}
            </div>
            <Select onValueChange={handleAddTopic}>
              <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
              <SelectContent>
                {AVAILABLE_TOPICS.map(topic => (
                  <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto cursor-pointer">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={isUploading} className="w-full sm:w-auto cursor-pointer">
            {isUploading ? "Uploading..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
