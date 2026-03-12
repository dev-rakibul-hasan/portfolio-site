"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  currentUrl: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
  shape?: "circle" | "square";
  uploadFolder?: string;
}

export function ImageUploader({
  currentUrl,
  onUploadSuccess,
  label = "Upload Image",
  shape = "circle",
  uploadFolder = "profile-images",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", uploadFolder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Success
      onUploadSuccess(data.url);
      setPreview(data.url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to upload image.");
      } else {
        setError("Failed to upload image.");
      }
      setPreview(currentUrl); // Revert preview on failure
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
        {label}
      </label>
      
      <div className="flex items-start gap-6">
        {/* Preview Area */}
        <div
          className={`relative h-24 w-24 flex-shrink-0 overflow-hidden border border-border/50 bg-background/50 flex items-center justify-center ${
            shape === "circle" ? "rounded-full" : "rounded-2xl"
          }`}
        >
          {preview ? (
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover" 
              unoptimized={preview.startsWith("blob:") || preview.startsWith("http")}
            />
          ) : (
            <div className="text-muted text-xs">No Image</div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-brand" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm font-medium transition hover:border-brand/50 hover:text-brand disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Choose Image"}
            </button>
          </div>
          
          <p className="text-xs text-muted max-w-[250px]">
            Recommended: Square image, MAX 2MB. JPG, PNG, or WebP.
          </p>
          
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
