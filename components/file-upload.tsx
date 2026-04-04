"use client";
import { FileUpload as FileUploader } from "./ui/file-upload"

export default function FileUpload({ onChange }: { onChange: (files: File[]) => void }) {
  return (
    <div className="w-full max-w-xl mx-auto border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUploader onChange={onChange} />
    </div>
  );
}
