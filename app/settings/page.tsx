"use client";

// import { useState, useEffect } from "react";
// import { MainLayout } from "@/components/main-layout";
// import { useAuth } from "@/hooks/use-auth";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle, Upload, Camera, User, Mail, Globe, MessageSquare } from "lucide-react";
// import Image from "next/image";

// export default function SettingsPage() {
//   const router = useRouter();
//   const { user, profile, loading } = useAuth();
  
//   const [formData, setFormData] = useState({
//     fullName: "",
//     bio: "",
//     location: "",
//     website: "",
//     contactPreference: "email",
//     customContactInfo: "",
//   });
  
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
//   const [coverImage, setCoverImage] = useState<File | null>(null);
//   const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   // Load user data
//   useEffect(() => {
//     if (profile) {
//       setFormData({
//         fullName: profile.fullName || "",
//         bio: profile.bio || "",
//         location: profile.location || "",
//         website: profile.website || "",
//         contactPreference: profile.contactPreference || "email",
//         customContactInfo: profile.customContactInfo || "",
//       });
      
//       if (profile.profileImage) {
//         setProfileImagePreview(profile.profileImage);
//       }
      
//       if (profile.coverImage) {
//         setCoverImagePreview(profile.coverImage);
//       }
//     }
//   }, [profile]);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     }
//   }, [user, loading, router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Check file type
//     const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
//     if (!validTypes.includes(file.type)) {
//       setError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
//       return;
//     }

//     // Check file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setError("Profile image must be less than 5MB");
//       return;
//     }

//     setProfileImage(file);
//     setProfileImagePreview(URL.createObjectURL(file));
//     setError(null);
//   };

//   const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Check file type
//     const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
//     if (!validTypes.includes(file.type)) {
//       setError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
//       return;
//     }

//     // Check file size (max 10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       setError("Cover image must be less than 10MB");
//       return;
//     }

//     setCoverImage(file);
//     setCoverImagePreview(URL.createObjectURL(file));
//     setError(null);
//   };

//   const uploadImage = async (file: File, path: string): Promise<string | null> => {
//     try {
//       const fileExt = file.name.split(".").pop();
//       const fileName = `${user!.id}/${path}.${fileExt}`;
//       const filePath = fileName;

//       const { error: uploadError } = await supabase.storage
//         .from("profiles")
//         .upload(filePath, file, { upsert: true });

//       if (uploadError) {
//         throw uploadError;
//       }

//       const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);
//       return data.publicUrl;
//     } catch (error) {
//       console.error(`Error uploading ${path}:`, error);
//       return null;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(false);
//     setSaving(true);

//     try {
//       let profileImageUrl = profile?.profileImage || null;
//       let coverImageUrl = profile?.coverImage || null;

//       // Upload profile image if changed
//       if (profileImage) {
//         const uploadedUrl = await uploadImage(profileImage, "profile");
//         if (uploadedUrl) {
//           profileImageUrl = uploadedUrl;
//         }
//       }

//       // Upload cover image if changed
//       if (coverImage) {
//         const uploadedUrl = await uploadImage(coverImage, "cover");
//         if (uploadedUrl) {
//           coverImageUrl = uploadedUrl;
//         }
//       }

//       // Update profile in database
//       const { error: updateError } = await supabase
//         .from("profiles")
//         .update({
//           fullName: formData.fullName,
//           bio: formData.bio,
//           location: formData.location,
//           website: formData.website,
//           profileImage: profileImageUrl,
//           coverImage: coverImageUrl,
//           contactPreference: formData.contactPreference,
//           customContactInfo: formData.customContactInfo,
//           updatedAt: new Date().toISOString(),
//         })
//         .eq("id", user!.id);

//       if (updateError) {
//         throw updateError;
//       }

//       setSuccess(true);
      
//       // Refresh the page after a short delay to show updated profile
//       setTimeout(() => {
//         window.location.reload();
//       }, 1500);
//     } catch (error: any) {
//       setError(error.message || "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <MainLayout>
//         <div className="container py-8">
//           <div className="flex justify-center items-center min-h-[50vh]">
//             <div className="h-8 w-8 border-t-2 border-b-2 border-primary animate-spin rounded-full"></div>
//           </div>
//         </div>
//       </MainLayout>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <MainLayout>
//       <div className="container py-8">
//         <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
//         <Tabs defaultValue="profile" className="w-full">
//           <TabsList className="mb-6">
//             <TabsTrigger value="profile">Profile</TabsTrigger>
//             <TabsTrigger value="account">Account</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="profile">
//             <div className="max-w-3xl mx-auto">
//               {error && (
//                 <Alert variant="destructive" className="mb-6">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertTitle>Error</AlertTitle>
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
              
//               {success && (
//                 <Alert className="mb-6">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertTitle>Success</AlertTitle>
//                   <AlertDescription>Your profile has been updated successfully!</AlertDescription>
//                 </Alert>
//               )}
              
//               <form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Cover Image */}
//                 <div className="space-y-2">
//                   <Label>Cover Image</Label>
//                   <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
//                     {coverImagePreview ? (
//                       <Image
//                         src={coverImagePreview}
//                         alt="Cover"
//                         fill
//                         className="object-cover"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center h-full">
//                         <p className="text-muted-foreground">No cover image</p>
//                       </div>
//                     )}
//                     <div className="absolute bottom-2 right-2">
//                       <Label htmlFor="cover-upload" className="cursor-pointer">
//                         <div className="bg-background text-foreground p-2 rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition-colors">
//                           <Camera className="h-5 w-5" />
//                         </div>
//                         <input
//                           id="cover-upload"
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleCoverImageChange}
//                         />
//                       </Label>
//                     </div>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     Recommended size: 1500x500px. Max size: 10MB.
//                   </p>
//                 </div>
                
//                 {/* Profile Image */}
//                 <div className="space-y-2">
//                   <Label>Profile Image</Label>
//                   <div className="flex items-center gap-4">
//                     <div className="relative">
//                       <Avatar className="h-24 w-24">
//                         <AvatarImage src={profileImagePreview || ""} />
//                         <AvatarFallback>
//                           <User className="h-12 w-12" />
//                         </AvatarFallback>
//                       </Avatar>
//                       <Label htmlFor="profile-upload" className="cursor-pointer">
//                         <div className="absolute bottom-0 right-0 bg-background text-foreground p-1 rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition-colors">
//                           <Camera className="h-4 w-4" />
//                         </div>
//                         <input
//                           id="profile-upload"
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleProfileImageChange}
//                         />
//                       </Label>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium">Profile Picture</p>
//                       <p className="text-xs text-muted-foreground">
//                         JPG, PNG or GIF. Max size: 5MB.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Basic Info */}
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="fullName">Full Name</Label>
//                     <Input
//                       id="fullName"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleChange}
//                       placeholder="Your full name"
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="bio">Bio</Label>
//                     <Textarea
//                       id="bio"
//                       name="bio"
//                       value={formData.bio}
//                       onChange={handleChange}
//                       placeholder="Tell us about yourself"
//                       rows={4}
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Write a short bio to introduce yourself to others.
//                     </p>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="location">Location</Label>
//                     <Input
//                       id="location"
//                       name="location"
//                       value={formData.location}
//                       onChange={handleChange}
//                       placeholder="City, Country"
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="website">Website</Label>
//                     <Input
//                       id="website"
//                       name="website"
//                       value={formData.website}
//                       onChange={handleChange}
//                       placeholder="https://yourwebsite.com"
//                       type="url"
//                     />
//                   </div>
//                 </div>
                
//                 {/* Contact Preferences */}
//                 <div className="space-y-4">
//                   <Label>Contact Preference</Label>
//                   <RadioGroup
//                     value={formData.contactPreference}
//                     onValueChange={(value) => setFormData({ ...formData, contactPreference: value })}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="email" id="email" />
//                       <Label htmlFor="email" className="flex items-center gap-2">
//                         <Mail className="h-4 w-4" />
//                         Email ({user.email})
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="website" id="website" />
//                       <Label htmlFor="website" className="flex items-center gap-2">
//                         <Globe className="h-4 w-4" />
//                         Website
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="custom" id="custom" />
//                       <Label htmlFor="custom" className="flex items-center gap-2">
//                         <MessageSquare className="h-4 w-4" />
//                         Custom
//                       </Label>
//                     </div>
//                   </RadioGroup>
                  
//                   {formData.contactPreference === "custom" && (
//                     <div className="space-y-2 pl-6">
//                       <Label htmlFor="customContactInfo">Custom Contact Information</Label>
//                       <Input
//                         id="customContactInfo"
//                         name="customContactInfo"
//                         value={formData.customContactInfo}
//                         onChange={handleChange}
//                         placeholder="How would you like to be contacted?"
//                       />
//                     </div>
//                   )}
//                 </div>
                
//                 <Button type="submit" disabled={saving}>
//                   {saving ? "Saving..." : "Save Changes"}
//                 </Button>
//               </form>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="account">
//             <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Account Information</CardTitle>
//                   <CardDescription>
//                     Your account details and email
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm font-medium mb-1">Email</p>
//                       <p className="text-sm text-muted-foreground">{user.email}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium mb-1">Username</p>
//                       <p className="text-sm text-muted-foreground">{profile?.userName || "Not set"}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium mb-1">Account Created</p>
//                       <p className="text-sm text-muted-foreground">
//                         {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Account Security</CardTitle>
//                   <CardDescription>
//                     Manage your password and account security
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm font-medium mb-1">Password</p>
//                       <p className="text-sm text-muted-foreground">••••••••</p>
//                     </div>
//                     <Button variant="outline" onClick={() => router.push("/auth/reset-password")}>
//                       Change Password
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </MainLayout>
//   );
// } 

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page