"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/utils/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function UserTypeSelection() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelectUserType = async (userType: 'artist' | 'buyer') => {
    if (!user) {
      setError("You must be logged in to continue")
      return
    }

    setLoading(userType)
    setError(null)

    try {
      // Update the user's profile with the selected user type
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          userType,
          onboardingCompleted: userType === 'buyer', // Buyer onboarding is simpler, mark as completed
          updatedAt: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      // Redirect to the appropriate setup page
      if (userType === 'artist') {
        router.push("/onboarding/artist-setup")
      } else {
        router.push("/onboarding/buyer-setup")
      }
    } catch (err: any) {
      console.error("Error updating user type:", err)
      setError(err.message || "Failed to update user type")
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">How will you use Art Realm?</h1>
        <p className="text-muted-foreground">Select your primary role to help us customize your experience</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          className="border-border/50 bg-background/80 backdrop-blur-md hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => !loading && handleSelectUserType('artist')}
        >
          <CardHeader className="pb-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>I'm an Artist</CardTitle>
            <CardDescription>I want to showcase and sell my artwork</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Create a beautiful portfolio
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Sell your artwork
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Connect with art enthusiasts
              </li>
            </ul>
            <Button className="w-full" disabled={!!loading} onClick={() => handleSelectUserType('artist')}>
              {loading === 'artist' ? 'Processing...' : 'Continue as Artist'}
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-border/50 bg-background/80 backdrop-blur-md hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => !loading && handleSelectUserType('buyer')}
        >
          <CardHeader className="pb-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>I'm a Buyer</CardTitle>
            <CardDescription>I want to discover and purchase artwork</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Discover unique artwork
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Support talented artists
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Build your art collection
              </li>
            </ul>
            <Button className="w-full" disabled={!!loading} onClick={() => handleSelectUserType('buyer')}>
              {loading === 'buyer' ? 'Processing...' : 'Continue as Buyer'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        <p>You can always change your role later in your account settings</p>
      </div>
    </div>
  )
}

