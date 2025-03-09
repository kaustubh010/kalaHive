"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Camera } from "lucide-react"
import Image from "next/image"

export interface ProfileUploadProps {
  label: string
  description: string
  isWide?: boolean
  onImageSelected?: (file: File | null) => void
  currentImage?: string | null
}

export function ProfileUpload({
  label,
  description,
  isWide,
  onImageSelected,
  currentImage
}: ProfileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, or WEBP)")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB")
      return
    }

    setPreview(URL.createObjectURL(file))
    if (onImageSelected) {
      onImageSelected(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={`relative ${
          isWide ? "aspect-[3/1]" : "aspect-square"
        } rounded-lg overflow-hidden bg-muted`}
      >
        {preview ? (
          <Image
            src={preview}
            alt={label}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}
        <Label
          htmlFor={`${label.toLowerCase().replace(/\s+/g, "-")}-upload`}
          className="cursor-pointer"
        >
          <div className="absolute bottom-2 right-2 bg-background text-foreground p-2 rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition-colors">
            <Camera className="h-5 w-5" />
          </div>
          <input
            id={`${label.toLowerCase().replace(/\s+/g, "-")}-upload`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </Label>
      </div>
      <p className="text-xs text-muted-foreground">
        JPG, PNG or GIF. Max size: 5MB.
      </p>
    </div>
  )
}

