"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, ShoppingBag, Star, Clock, Calendar, TrendingUp, Bookmark, Eye, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BuyerDashboardProps {
  profile: any;
}

export function BuyerDashboard({ profile }: BuyerDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for the dashboard
  const savedArtworks = [
    {
      id: 1,
      title: "Abstract Harmony",
      artist: "Elena Rivera",
      image: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
      price: "$450",
      medium: "Acrylic on Canvas"
    },
    {
      id: 2,
      title: "Urban Reflections",
      artist: "Marcus Chen",
      image: "https://images.unsplash.com/photo-1549887534-1541e9326642?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      price: "$320",
      medium: "Digital Art"
    },
    {
      id: 3,
      title: "Serenity",
      artist: "Sophia Kim",
      image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2044&q=80",
      price: "$550",
      medium: "Oil on Canvas"
    }
  ];

  const recentlyViewed = [
    {
      id: 4,
      title: "Coastal Dreams",
      artist: "James Wilson",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2045&q=80",
      viewed: "2 hours ago"
    },
    {
      id: 5,
      title: "Midnight Forest",
      artist: "Olivia Parker",
      image: "https://images.unsplash.com/photo-1578301978018-3c5876a72e98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2044&q=80",
      viewed: "Yesterday"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Modern Art Exhibition",
      date: "June 15, 2023",
      location: "City Gallery",
      type: "Exhibition"
    },
    {
      id: 2,
      title: "Artist Talk: Contemporary Techniques",
      date: "June 22, 2023",
      location: "Virtual Event",
      type: "Workshop"
    }
  ];

  const artistsFollowing = [
    {
      id: 1,
      name: "Elena Rivera",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      artworks: 24
    },
    {
      id: 2,
      name: "Marcus Chen",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      artworks: 18
    },
    {
      id: 3,
      name: "Sophia Kim",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      artworks: 31
    }
  ];

  const stats = [
    { label: "Saved Artworks", value: 24, icon: <Bookmark className="h-4 w-4" /> },
    { label: "Artists Following", value: 12, icon: <Star className="h-4 w-4" /> },
    { label: "Viewed Artworks", value: 87, icon: <Eye className="h-4 w-4" /> },
    { label: "Messages", value: 5, icon: <MessageSquare className="h-4 w-4" /> }
  ];

  const artPreferences = profile?.preferences || ["painting", "photography", "digital"];

  return (
    <div className="space-y-8">
      {/* Header with welcome message */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.fullName || "Art Collector"}</h1>
          <p className="text-muted-foreground">
            Discover new artwork and keep track of your collection
          </p>
        </div>
        <Button onClick={() => router.push("/explore")}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Explore Artwork
        </Button>
      </div>

      {/* Dashboard tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="saved">Saved Artwork</TabsTrigger>
          <TabsTrigger value="artists">Following</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
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
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Art preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Your Art Preferences</CardTitle>
              <CardDescription>
                Based on your profile and browsing history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {artPreferences && artPreferences.map((preference: string) => (
                  <Badge key={preference} variant="secondary" className="capitalize">
                    {preference}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => router.push("/settings")}>
                Update Preferences
              </Button>
            </CardFooter>
          </Card>

          {/* Recently viewed */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
              <CardDescription>
                Artwork you've viewed recently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentlyViewed.map((artwork) => (
                  <div key={artwork.id} className="flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{artwork.title}</h4>
                      <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" /> {artwork.viewed}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => router.push("/explore")}>
                View More
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Art events you might be interested in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-md">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.date} • {event.location}</p>
                      <Badge variant="outline" className="mt-2">{event.type}</Badge>
                    </div>
                    <Button variant="outline" size="sm">RSVP</Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => router.push("/events")}>
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Saved Artwork Tab */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Artwork</CardTitle>
              <CardDescription>
                Artwork you've saved for later
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedArtworks.map((artwork) => (
                  <div key={artwork.id} className="group cursor-pointer" onClick={() => router.push(`/artwork/${artwork.id}`)}>
                    <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                          <Heart className="h-4 w-4 fill-primary text-primary" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium">{artwork.price}</span>
                      <span className="text-xs text-muted-foreground">{artwork.medium}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push("/collections")}>
                View All Saved Artwork
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Following Tab */}
        <TabsContent value="artists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Artists You Follow</CardTitle>
              <CardDescription>
                Stay updated with your favorite artists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {artistsFollowing.map((artist) => (
                  <div key={artist.id} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={artist.image} alt={artist.name} />
                      <AvatarFallback>{artist.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{artist.name}</h4>
                      <p className="text-sm text-muted-foreground">{artist.artworks} artworks</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/artist/${artist.id}`)}>
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push("/artists")}>
                Discover More Artists
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent interactions on Art Realm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-md">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">You viewed <span className="font-medium">Coastal Dreams</span> by James Wilson</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-md">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">You saved <span className="font-medium">Abstract Harmony</span> to your collection</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-md">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">You started following <span className="font-medium">Elena Rivera</span></p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-md">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">You messaged <span className="font-medium">Marcus Chen</span> about their artwork</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 