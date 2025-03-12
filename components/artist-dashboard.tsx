"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Heart, 
  MessageSquare, 
  BarChart3, 
  Calendar, 
  Clock, 
  Users, 
  Settings,
  PlusCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ArtistDashboardProps {
  profile: any
}

export function ArtistDashboard({ profile }: ArtistDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the dashboard
  const recentArtworks = [
    {
      id: 1,
      title: "Ethereal Dreams",
      image: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
      price: "$450",
      medium: "Acrylic on Canvas",
      views: 124,
      likes: 32,
      uploadedAt: "2 weeks ago"
    },
    {
      id: 2,
      title: "Urban Reflections",
      image: "https://images.unsplash.com/photo-1549887534-1541e9326642?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      price: "$320",
      medium: "Digital Art",
      views: 98,
      likes: 24,
      uploadedAt: "1 month ago"
    },
    {
      id: 3,
      title: "Serenity",
      image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2044&q=80",
      price: "$550",
      medium: "Oil on Canvas",
      views: 156,
      likes: 47,
      uploadedAt: "2 months ago"
    }
  ]

  const recentMessages = [
    {
      id: 1,
      from: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      message: "I'm interested in your 'Ethereal Dreams' piece. Is it still available?",
      time: "2 hours ago"
    },
    {
      id: 2,
      from: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      message: "Your work is amazing! Do you do commissions?",
      time: "Yesterday"
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Virtual Art Exhibition",
      date: "June 15, 2023",
      type: "Exhibition"
    },
    {
      id: 2,
      title: "Artist Collaboration Meeting",
      date: "June 22, 2023",
      type: "Meeting"
    }
  ]

  const followers = [
    {
      id: 1,
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      since: "2 months ago"
    },
    {
      id: 2,
      name: "James Rodriguez",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      since: "3 weeks ago"
    },
    {
      id: 3,
      name: "Olivia Parker",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      since: "5 days ago"
    }
  ]

  const stats = [
    { label: "Total Views", value: 2458, icon: <Eye className="h-4 w-4" />, trend: "+12%" },
    { label: "Total Likes", value: 423, icon: <Heart className="h-4 w-4" />, trend: "+8%" },
    { label: "Messages", value: 18, icon: <MessageSquare className="h-4 w-4" />, trend: "+3" },
    { label: "Followers", value: 156, icon: <Users className="h-4 w-4" />, trend: "+5" }
  ]

  const salesStats = [
    { label: "Total Sales", value: "$2,450", icon: <DollarSign className="h-4 w-4" /> },
    { label: "Pending Orders", value: 3, icon: <Clock className="h-4 w-4" /> },
    { label: "Avg. Rating", value: "4.8", icon: <TrendingUp className="h-4 w-4" /> }
  ]

  return (
    <div className="space-y-8">
      {/* Header with welcome message */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.fullName || "Artist"}</h1>
          <p className="text-muted-foreground">
            Manage your artwork and track your performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </Button>
          <Button onClick={() => router.push("/upload")}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Artwork
          </Button>
        </div>
      </div>

      {/* Dashboard tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="artworks">My Artworks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-500 mt-1">{stat.trend}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent artworks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Artworks</CardTitle>
                <CardDescription>
                  Your recently uploaded artwork
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/upload")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentArtworks.map((artwork) => (
                  <div key={artwork.id} className="group cursor-pointer" onClick={() => router.push(`/artwork/${artwork.id}`)}>
                    <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <div className="flex justify-between text-white">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {artwork.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {artwork.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium">{artwork.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium">{artwork.price}</span>
                      <span className="text-xs text-muted-foreground">{artwork.uploadedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setActiveTab("artworks")}>
                View All Artworks
              </Button>
            </CardFooter>
          </Card>

          {/* Recent messages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>
                  Messages from potential buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex gap-4 items-start">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.avatar} alt={message.from} />
                        <AvatarFallback>{message.from.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{message.from}</h4>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("messages")}>
                  View All Messages
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Your sales performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary p-2 rounded-md">
                        {stat.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-lg font-medium">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("analytics")}>
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Artworks Tab */}
        <TabsContent value="artworks" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Artwork Collection</CardTitle>
                <CardDescription>
                  Manage and organize your artwork
                </CardDescription>
              </div>
              <Button onClick={() => router.push("/upload")}>
                <Upload className="mr-2 h-4 w-4" />
                Upload New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...recentArtworks, ...recentArtworks].slice(0, 6).map((artwork, index) => (
                  <div key={`${artwork.id}-${index}`} className="group cursor-pointer" onClick={() => router.push(`/artwork/${artwork.id}`)}>
                    <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <div className="flex justify-between text-white">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {artwork.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {artwork.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium">{artwork.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium">{artwork.price}</span>
                      <Badge variant="outline">{artwork.medium}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                Load More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Your artwork performance over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">Analytics visualization would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Top Performing Artwork</CardTitle>
                <CardDescription>
                  Based on views and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentArtworks.map((artwork) => (
                    <div key={artwork.id} className="flex gap-3 items-start">
                      <div className="relative h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={artwork.image}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{artwork.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {artwork.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" /> {artwork.likes}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">{artwork.price}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>
                Who's viewing and engaging with your art
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium mb-4">Age Distribution</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>18-24</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>25-34</span>
                        <span>42%</span>
                      </div>
                      <Progress value={42} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>35-44</span>
                        <span>28%</span>
                      </div>
                      <Progress value={28} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>45+</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-4">Top Locations</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>United States</span>
                        <span>35%</span>
                      </div>
                      <Progress value={35} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>United Kingdom</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Canada</span>
                        <span>18%</span>
                      </div>
                      <Progress value={18} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Germany</span>
                        <span>12%</span>
                      </div>
                      <Progress value={12} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Inquiries and messages from potential buyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...recentMessages, ...recentMessages].map((message, index) => (
                  <div key={`${message.id}-${index}`} className="flex gap-4 items-start border-b pb-6 last:border-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={message.avatar} alt={message.from} />
                      <AvatarFallback>{message.from.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{message.from}</h4>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground my-2">{message.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm">Reply</Button>
                        <Button size="sm" variant="outline">Archive</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

