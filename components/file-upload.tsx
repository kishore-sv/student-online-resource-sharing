"use client";
import { useState } from "react";
import { FileUpload as FileUploader } from "./ui/file-upload"

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="w-full max-w-xl  mx-auto border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUploader onChange={handleFileUpload} />
    </div>
  );
}
