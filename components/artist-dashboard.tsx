"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Image, Settings, Plus, Users, BarChart } from "lucide-react"
import Link from "next/link"

export function ArtistDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ArtistHub</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/messages">
                <Users className="h-5 w-5 mr-2" />
                Messages
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Link>
            </Button>
            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: "url('/placeholder.svg?height=100&width=100')" }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, Artist!</h1>
            <p className="text-muted-foreground">Manage your portfolio and track your progress</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Artwork
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-background/60 backdrop-blur-md border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Portfolio Views</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">Add artwork to start tracking views</p>
            </CardContent>
          </Card>
          <Card className="bg-background/60 backdrop-blur-md border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Artwork Count</CardTitle>
              <CardDescription>Total pieces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">Upload your first artwork</p>
            </CardContent>
          </Card>
          <Card className="bg-background/60 backdrop-blur-md border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
              <CardDescription>Setup progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">60%</div>
              <div className="w-full bg-secondary h-2 rounded-full mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Add artwork to complete your profile</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="portfolio">
              <Image className="h-4 w-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-background/60 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle>Your Portfolio</CardTitle>
                <CardDescription>Manage and organize your artwork</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Image className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No artwork yet</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Start building your portfolio by uploading your first artwork
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Artwork
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-background/60 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track your portfolio performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <BarChart className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No data to display</h3>
                  <p className="text-muted-foreground max-w-md">
                    Add artwork to your portfolio to start tracking analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-background/60 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Profile Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your profile details and public information
                      </p>
                      <Button variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Account Settings</h3>
                      <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
                      <Button variant="outline" size="sm">
                        Account Settings
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Notification Preferences</h3>
                      <p className="text-sm text-muted-foreground">Control which notifications you receive</p>
                      <Button variant="outline" size="sm">
                        Notification Settings
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Privacy Settings</h3>
                      <p className="text-sm text-muted-foreground">Manage your privacy and visibility settings</p>
                      <Button variant="outline" size="sm">
                        Privacy Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/40 py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ArtistHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

