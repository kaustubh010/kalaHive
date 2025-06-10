"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
// import { uploadArtworkImage, createArtwork } from "@/utils/artwork";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const CATEGORIES = [
  "Painting",
  "Digital Art",
  "Photography",
  "Sculpture",
  "Drawing",
  "Mixed Media",
  "Illustration",
  "Graphic Design",
  "Other",
];

export function ArtUploadForm() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) return setError("You must be logged in to upload artwork");
    if (!selectedFile) return setError("Please select an image to upload");
    if (!formData.title) return setError("Please enter a title");

    setSuccess(true);

    const tempFormData = { ...formData };
    const tempFile = selectedFile;

    setFormData({ title: "", description: "", category: "", tags: "" });
    clearSelectedFile();

    try {
      const formPayload = new FormData();
      formPayload.append("image", tempFile);
      formPayload.append("title", tempFormData.title);
      formPayload.append("description", tempFormData.description);
      formPayload.append("category", tempFormData.category);
      formPayload.append("tags", tempFormData.tags);

      const res = await fetch("/api/artwork/upload", {
        method: "POST",
        body: formPayload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const artwork = await res.json();
      router.push(`/artwork/${artwork.id}`);
    } catch (err: any) {
      setSuccess(false);
      setError(err.message || "An error occurred");
      setFormData(tempFormData);
      setSelectedFile(tempFile);
      setPreviewUrl(URL.createObjectURL(tempFile));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Your Artwork</CardTitle>
        <CardDescription>
          Share your creative work with the Kala Hive community
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your artwork has been uploaded successfully! Redirecting to your
              artwork page...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="image">Artwork Image</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                previewUrl
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative">
                  <div className="relative w-full h-64 mx-auto overflow-hidden rounded-md">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelectedFile();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag and drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPEG, PNG, GIF, WEBP (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the title of your artwork"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your artwork, inspiration, techniques used, etc."
              rows={4}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., abstract, nature, portrait)"
            />
            <p className="text-xs text-muted-foreground">
              Tags help others discover your artwork
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={success}>
            {success ? (
              <>
                <span className="mr-2">✓</span> Artwork Uploaded Successfully
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload Artwork
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
