"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, ShoppingBag } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/utils/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function UserTypeSelection() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
  }

  const handleContinue = async () => {
    if (!selectedType) {
      setError("Please select a user type to continue")
      return
    }

    if (!user) {
      setError("You must be logged in to continue")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Update the user's profile with the selected type
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          userType: selectedType,
          updatedAt: new Date().toISOString()
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Redirect to the appropriate setup page
      if (selectedType === "artist") {
        router.push("/onboarding/artist-setup")
      } else {
        router.push("/onboarding/buyer-setup")
      }
    } catch (err: any) {
      console.error("Error saving user type:", err)
      setError(err.message || "An error occurred while saving your selection")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <Card className="border-border/50 bg-background/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">How will you use Kala Hive?</CardTitle>
          <CardDescription>
            Select your primary role to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedType === "artist"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleTypeSelect("artist")}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Palette className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">I'm an Artist</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    I want to showcase and sell my artwork
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedType === "buyer"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleTypeSelect("buyer")}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">I'm a Collector</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    I want to discover and collect artwork
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedType || loading}
            className="w-full md:w-auto"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-t-2 border-b-2 border-current animate-spin rounded-full" />
                Processing...
              </div>
            ) : (
              "Continue"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

