"use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useRouter } from "next/navigation"
// import { ProfileUpload } from "@/components/profile-upload"
// import { ArrowRight, Check, AlertCircle } from "lucide-react"
// import { useAuth } from "@/hooks/use-auth"
// import { supabase } from "@/utils/supabase/client"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import Image from "next/image"

// export function BuyerSetup() {
//   const router = useRouter()
//   const { user, profile } = useAuth()
//   const [artPreferences, setArtPreferences] = useState<string[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [profileImage, setProfileImage] = useState<File | null>(null)
//   const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  
//   const [formData, setFormData] = useState({
//     displayName: "",
//     bio: "",
//     location: "",
//   })

//   useEffect(() => {
//     if (profile) {
//       setFormData({
//         displayName: profile.fullName || "",
//         bio: profile.bio || "",
//         location: profile.location || "",
//       })
//       if (profile.profileImage) {
//         setProfileImagePreview(profile.profileImage)
//       }
//       if (profile.preferences) {
//         setArtPreferences(profile.preferences)
//       }
//     }
//   }, [profile])

//   const artCategories = [
//     { id: "painting", label: "Painting" },
//     { id: "digital", label: "Digital Art" },
//     { id: "photography", label: "Photography" },
//     { id: "sculpture", label: "Sculpture" },
//     { id: "illustration", label: "Illustration" },
//     { id: "printmaking", label: "Printmaking" },
//     { id: "mixed-media", label: "Mixed Media" },
//     { id: "abstract", label: "Abstract" },
//   ]

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleProfileImageChange = (file: File | null) => {
//     if (file) {
//       setProfileImage(file)
//       setProfileImagePreview(URL.createObjectURL(file))
//     }
//   }

//   const handlePreferenceChange = (id: string, checked: boolean) => {
//     if (checked) {
//       setArtPreferences([...artPreferences, id])
//     } else {
//       setArtPreferences(artPreferences.filter((item) => item !== id))
//     }
//   }

//   const handleComplete = async () => {
//     if (!user) {
//       setError("You must be logged in to continue")
//       return
//     }

//     if (!formData.displayName) {
//       setError("Please provide a display name")
//       return
//     }

//     setLoading(true)
//     setError(null)

//     try {
//       let profileImageUrl = profile?.profileImage

//       // Upload profile image if changed
//       if (profileImage) {
//         const fileExt = profileImage.name.split(".").pop()
//         const fileName = `${user.id}/profile.${fileExt}`
        
//         const { error: uploadError } = await supabase.storage
//           .from("profiles")
//           .upload(fileName, profileImage, { upsert: true })
          
//         if (uploadError) throw uploadError
        
//         const { data } = supabase.storage.from("profiles").getPublicUrl(fileName)
//         profileImageUrl = data.publicUrl
//       }

//       // Update profile in database
//       const { error: updateError } = await supabase
//         .from("profiles")
//         .update({
//           fullName: formData.displayName,
//           bio: formData.bio,
//           location: formData.location,
//           profileImage: profileImageUrl,
//           preferences: artPreferences,
//           onboardingCompleted: true,
//           updatedAt: new Date().toISOString()
//         })
//         .eq("id", user.id)

//       if (updateError) throw updateError

//       router.push("/")
//     } catch (err: any) {
//       console.error("Error setting up buyer profile:", err)
//       setError(err.message || "An error occurred while setting up your profile")
//       setLoading(false)
//     }
//   }

//   const handleSkip = async () => {
//     if (!user) {
//       setError("You must be logged in to continue")
//       return
//     }

//     setLoading(true)
//     try {
//       // Update profile to mark onboarding as completed
//       const { error: updateError } = await supabase
//         .from("profiles")
//         .update({
//           onboardingCompleted: true,
//           updatedAt: new Date().toISOString()
//         })
//         .eq("id", user.id)

//       if (updateError) throw updateError
//       router.push("/")
//     } catch (err: any) {
//       console.error("Error skipping setup:", err)
//       setError(err.message)
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="w-full max-w-3xl">
//       <Card className="border-border/50 bg-background/80 backdrop-blur-md">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl">Complete your buyer profile</CardTitle>
//           <CardDescription>Tell us about your art preferences to help us recommend artwork you'll love</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
          
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="flex-1">
//               <ProfileUpload 
//                 label="Profile Picture" 
//                 description="Upload a profile picture" 
//                 onImageSelected={handleProfileImageChange}
//                 currentImage={profileImagePreview}
//               />
//             </div>
//             <div className="flex-1 space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="displayName">Display Name</Label>
//                 <Input 
//                   id="displayName" 
//                   name="displayName"
//                   value={formData.displayName}
//                   onChange={handleChange}
//                   placeholder="Your name" 
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="location">Location</Label>
//                 <Input 
//                   id="location" 
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   placeholder="City, Country" 
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="bio">About You (optional)</Label>
//             <Textarea
//               id="bio"
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               placeholder="Tell us about yourself and your interest in art..."
//               className="min-h-[100px]"
//             />
//           </div>

//           <div className="space-y-3">
//             <Label>Art Preferences</Label>
//             <p className="text-sm text-muted-foreground">Select the types of art you're interested in</p>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//               {artCategories.map((category) => (
//                 <div key={category.id} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={category.id}
//                     checked={artPreferences.includes(category.id)}
//                     onCheckedChange={(checked) => handlePreferenceChange(category.id, checked as boolean)}
//                   />
//                   <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
//                     {category.label}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-lg border border-border/50 p-4 bg-secondary/30">
//             <div className="flex items-center gap-2 mb-2">
//               <Check className="h-5 w-5 text-primary" />
//               <h3 className="font-medium">You're almost ready!</h3>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Complete your profile to start discovering and collecting artwork that speaks to you.
//             </p>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button variant="outline" onClick={handleSkip} disabled={loading}>
//             Skip for now
//           </Button>
//           <Button onClick={handleComplete} disabled={loading}>
//             {loading ? (
//               <div className="flex items-center gap-2">
//                 <div className="h-4 w-4 border-t-2 border-b-2 border-current animate-spin rounded-full" />
//                 Saving...
//               </div>
//             ) : (
//               <>
//                 Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
//               </>
//             )}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

import React from 'react'

const BuyerSetup = () => {
  return (
    <div>BuyerSetup</div>
  )
}

export default BuyerSetup