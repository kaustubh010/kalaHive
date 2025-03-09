"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

export interface ArtUploadProps {
  onUpload?: (artwork: {
    id: string;
    file: File;
    title: string;
    description: string;
    medium: string;
  }) => void;
  disabled?: boolean;
}

export function ArtUpload({ onUpload, disabled }: ArtUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    medium: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(selectedFile.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, or WEBP)")
      return
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Image must be less than 10MB")
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleRemove = () => {
    setPreview(null)
    setFile(null)
    setFormData({
      title: "",
      description: "",
      medium: "",
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !formData.title || !formData.medium) {
      alert("Please fill in all required fields")
      return
    }

    if (onUpload) {
      onUpload({
        id: Math.random().toString(36).substring(7),
        file,
        ...formData,
      })
    }

    // Reset form
    handleRemove()
  }

  return (
    <Card className="overflow-hidden border-border/50 art-card">
      <div className="aspect-square bg-muted relative">
        {preview ? (
          <>
            <Image
              src={preview}
              alt={formData.title || "Artwork preview"}
              fill
              className="object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center h-full cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Upload artwork</span>
            <span className="text-xs text-muted-foreground mt-1">
              Max size: 10MB
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
        )}
      </div>

      {preview && (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Artwork title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medium">Medium *</Label>
            <Input
              id="medium"
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              placeholder="e.g. Oil on canvas"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about this piece..."
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full">
            Add to Portfolio
          </Button>
        </form>
      )}
    </Card>
  )
}

