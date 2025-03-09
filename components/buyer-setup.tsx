"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { ProfileUpload } from "@/components/profile-upload"
import { ArrowRight, Check } from "lucide-react"

export function BuyerSetup() {
  const router = useRouter()
  const [artPreferences, setArtPreferences] = useState<string[]>([])

  const artCategories = [
    { id: "painting", label: "Painting" },
    { id: "digital", label: "Digital Art" },
    { id: "photography", label: "Photography" },
    { id: "sculpture", label: "Sculpture" },
    { id: "illustration", label: "Illustration" },
    { id: "printmaking", label: "Printmaking" },
    { id: "mixed-media", label: "Mixed Media" },
    { id: "abstract", label: "Abstract" },
  ]

  const handlePreferenceChange = (id: string, checked: boolean) => {
    if (checked) {
      setArtPreferences([...artPreferences, id])
    } else {
      setArtPreferences(artPreferences.filter((item) => item !== id))
    }
  }

  const handleComplete = () => {
    router.push("/dashboard")
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  return (
    <div className="w-full max-w-3xl">
      <Card className="border-border/50 bg-background/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete your buyer profile</CardTitle>
          <CardDescription>Tell us about your art preferences to help us recommend artwork you'll love</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <ProfileUpload label="Profile Picture" description="Upload a profile picture" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, Country" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About You (optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself and your interest in art..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-3">
            <Label>Art Preferences</Label>
            <p className="text-sm text-muted-foreground">Select the types of art you're interested in</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {artCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={artPreferences.includes(category.id)}
                    onCheckedChange={(checked) => handlePreferenceChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border/50 p-4 bg-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-primary" />
              <h3 className="font-medium">You're almost ready!</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete your profile to start discovering and collecting artwork that speaks to you.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button onClick={handleComplete}>
            Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

