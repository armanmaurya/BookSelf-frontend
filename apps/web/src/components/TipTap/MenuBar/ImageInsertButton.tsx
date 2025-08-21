"use client";

import { useState, useRef } from "react";
import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { API_ENDPOINT } from "@/app/utils";

export function ImageInsertButton({ editor, className, initialSlug }: { editor: Editor; className?: string, initialSlug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setImageUrl(""); // Clear URL input when file is selected
      setUploadedImageUrl(""); // Clear any previous uploaded URL
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      // Handle upload completion
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            // Assuming your server returns { url: "http://..." } or { file_url: "http://..." }
            const serverImageUrl = response.url || response.file_url || response.image_url;
            if (serverImageUrl) {
              setUploadedImageUrl(serverImageUrl);
              // Clean up the preview URL since we now have the server URL
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
              }
            }
          } catch (error) {
            console.error('Error parsing upload response:', error);
          }
        } else {
          console.error('Upload failed with status:', xhr.status);
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        console.error('Upload failed');
        setIsUploading(false);
      };

      // Use the configured upload endpoint
      xhr.open('POST', `${API_ENDPOINT.uploadImage.url}/article/${initialSlug}/images/`, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      
      // Include credentials for authentication if needed
      xhr.withCredentials = true;
      
      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };

  const handleInsert = () => {
    const finalUrl = uploadedImageUrl || previewUrl || imageUrl;
    if (!finalUrl) return;
    
    editor.chain().focus().setImage({ src: finalUrl }).run(); 
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setImageUrl("");
    setUploadedFile(null);
    setUploadedImageUrl("");
    setIsUploading(false);
    setUploadProgress(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up object URL
    }
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setUploadedImageUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className ?? "h-8 w-8 p-0"}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* File Upload Section */}
          <div>
            <label className="text-sm font-medium mb-2 block">Upload Image File</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? "Uploading..." : "Choose File"}
              </Button>
              {(uploadedFile || uploadedImageUrl) && !isUploading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  className="text-muted-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            {uploadedFile && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  {isUploading ? "Uploading" : uploadedImageUrl ? "Uploaded" : "Selected"}: {uploadedFile.name}
                </p>
                {isUploading && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                  </div>
                )}
                {uploadedImageUrl && (
                  <p className="text-xs text-green-600 mt-1">✓ Upload complete</p>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* URL Input Section */}
          <div>
            <label className="text-sm font-medium mb-2 block">Image URL</label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (e.target.value) {
                  clearFile(); // Clear file when URL is entered
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInsert();
              }}
              disabled={!!uploadedFile || isUploading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleInsert} 
              disabled={(!imageUrl && !uploadedImageUrl && !previewUrl) || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Insert"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageInsertButton;
