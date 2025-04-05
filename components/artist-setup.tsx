"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { ProfileUpload } from "@/components/profile-upload";
import { ArtUpload } from "@/components/art-upload";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

export default function ArtistSetup() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    artistStatement: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.fullName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        artistStatement: profile.artistStatement || "",
      });
      if (profile.profileImage) {
        setProfileImagePreview(profile.profileImage);
      }
      if (profile.coverImage) {
        setCoverImagePreview(profile.coverImage);
      }
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (file: File | null) => {
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (file: File | null) => {
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleArtworkUpload = (artwork: any) => {
    setArtworks([...artworks, artwork]);
  };

  const handleNext = () => {
    if (activeTab === "profile") {
      if (!formData.displayName || !formData.bio) {
        setError("Please fill in your display name and bio");
        return;
      }
      setActiveTab("portfolio");
    } else if (activeTab === "portfolio") {
      setActiveTab("preview");
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError(null);
    if (activeTab === "portfolio") {
      setActiveTab("profile");
    } else if (activeTab === "preview") {
      setActiveTab("portfolio");
    }
  };

  const handleSkip = async () => {
    if (!user) {
      setError("You must be logged in to continue");
      return;
    }

    setLoading(true);
    try {
      // Update profile to mark onboarding as completed
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          onboardingCompleted: true,
          updatedAt: new Date().toISOString()
        })
        .eq("id", user.id);

      if (updateError) throw updateError;
      router.push("/");
    } catch (err: any) {
      console.error("Error skipping setup:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to continue");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let profileImageUrl = profile?.profileImage;
      let coverImageUrl = profile?.coverImage;

      // Upload profile image if changed
      if (profileImage) {
        const fileExt = profileImage.name.split(".").pop();
        const fileName = `${user.id}/profile.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(fileName, profileImage, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("profiles").getPublicUrl(fileName);
        profileImageUrl = data.publicUrl;
      }

      // Upload cover image if changed
      if (coverImage) {
        const fileExt = coverImage.name.split(".").pop();
        const fileName = `${user.id}/cover.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(fileName, coverImage, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("profiles").getPublicUrl(fileName);
        coverImageUrl = data.publicUrl;
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          fullName: formData.displayName,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          artistStatement: formData.artistStatement,
          profileImage: profileImageUrl,
          coverImage: coverImageUrl,
          onboardingCompleted: true,
          updatedAt: new Date().toISOString()
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Upload artworks if any
      if (artworks.length > 0) {
        const artworkPromises = artworks.map(async (artwork) => {
          // Upload artwork image
          const fileExt = artwork.file.name.split(".").pop();
          const fileName = `${user.id}/artworks/${artwork.id}.${fileExt}`;
          
          await supabase.storage
            .from("artworks")
            .upload(fileName, artwork.file, { upsert: true });
            
          const { data } = supabase.storage.from("artworks").getPublicUrl(fileName);
          
          return supabase
            .from("artworks")
            .insert({
              title: artwork.title,
              description: artwork.description,
              medium: artwork.medium,
              image_url: data.publicUrl,
              artist_id: user.id,
            });
        });

        await Promise.all(artworkPromises);
      }

      router.push("/");
    } catch (err: any) {
      console.error("Error setting up artist profile:", err);
      setError(err.message || "An error occurred while setting up your profile");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <Card className="border-border/50 bg-background/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Set up your artist profile</CardTitle>
          <CardDescription>
            Let's create your portfolio and showcase your artwork
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <ProfileUpload
                      label="Profile Picture"
                      description="Upload a profile picture"
                      onImageSelected={handleProfileImageChange}
                      currentImage={profileImagePreview}
                    />
                  </div>
                  <div className="flex-1">
                    <ProfileUpload
                      label="Cover Image"
                      description="Upload a banner for your profile"
                      onImageSelected={handleCoverImageChange}
                      currentImage={coverImagePreview}
                      isWide
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Your artist name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and your art..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Your Artwork</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add up to 10 pieces to start your portfolio. You can add more later.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, index) => (
                      <ArtUpload
                        key={index}
                        onUpload={handleArtworkUpload}
                        disabled={artworks.length >= 10}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="artistStatement">Artist Statement (optional)</Label>
                  <Textarea
                    id="artistStatement"
                    name="artistStatement"
                    value={formData.artistStatement}
                    onChange={handleChange}
                    placeholder="Share your artistic vision, inspiration, or creative process..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="relative rounded-lg overflow-hidden h-48 bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
                {coverImagePreview ? (
                  <Image
                    src={coverImagePreview}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-indigo-900/50" />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full border-4 border-background overflow-hidden">
                    {profileImagePreview ? (
                      <Image
                        src={profileImagePreview}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">
                      {formData.displayName || "Your Name"}
                    </h2>
                    {formData.location && (
                      <p className="text-white/80 text-sm">{formData.location}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Bio</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {formData.bio || "Your bio will appear here..."}
                  </p>
                </div>

                {formData.artistStatement && (
                  <div>
                    <h3 className="text-lg font-medium">Artist Statement</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {formData.artistStatement}
                    </p>
                  </div>
                )}
              </div>

              {artworks.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Portfolio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {artworks.map((artwork, index) => (
                      <div
                        key={index}
                        className="rounded-lg overflow-hidden border border-border/50"
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={URL.createObjectURL(artwork.file)}
                            alt={artwork.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium truncate">{artwork.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {artwork.medium}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border/50 p-4 bg-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Your profile is ready!</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can always edit your profile and add more artwork from your dashboard.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {activeTab !== "profile" ? (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <Button variant="outline" onClick={handleSkip} disabled={loading}>
              Skip for now
            </Button>
          )}
          <Button onClick={handleNext} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-t-2 border-b-2 border-current animate-spin rounded-full" />
                Saving...
              </div>
            ) : activeTab === "preview" ? (
              "Complete Setup"
            ) : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
