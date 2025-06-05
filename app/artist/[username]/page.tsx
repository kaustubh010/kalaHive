"use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { MainLayout } from "@/components/main-layout";
// import { ArtworkCard } from "@/components/artwork-card";
// import { getArtworksByArtist } from "@/utils/artwork";
// import { supabase } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Loader2, Grid, Calendar, Mail, MapPin, Link as LinkIcon, ChevronLeft, ChevronRight, Info } from "lucide-react";
// import type { ArtworkWithArtist } from "@/utils/artwork";
// import { use } from "react";
// import Image from "next/image";

// export default function ArtistProfilePage({ params }: { params: Promise<{ username: string }> }) {
//   const resolvedParams = use(params);
//   const router = useRouter();
//   const [artist, setArtist] = useState<any | null>(null);
//   const [artworks, setArtworks] = useState<any[]>([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const limit = 12;

//   // Fetch artist profile and artworks
//   useEffect(() => {
//     const fetchArtistAndArtworks = async () => {
//       setError(null);

//       try {
//         // Fetch artist profile
//         const { data: artistData, error: artistError } = await supabase
//           .from("profiles")
//           .select("*")
//           .eq("userName", resolvedParams.username)
//           .single();

//         if (artistError) {
//           console.error("Error fetching artist profile:", artistError);
//           throw new Error("Artist not found");
//         }

//         setArtist(artistData);

//         // Fetch artist's artworks
//         const { artworks: fetchedArtworks, count, error: artworksError } = await getArtworksByArtist(
//           resolvedParams.username,
//           limit,
//           page
//         );

//         if (artworksError) {
//           console.error("Error fetching artworks:", artworksError);
//           throw new Error(artworksError.message || "Failed to fetch artworks");
//         }

//         setArtworks(fetchedArtworks);
//         setTotalCount(count);
//       } catch (err: any) {
//         console.error("Error fetching artist profile:", err);
//         setError(err.message || "Failed to load artist profile. Please try again later.");
//       }
//     };

//     fetchArtistAndArtworks();
//   }, [resolvedParams.username, page]);

//   // Calculate total pages
//   const totalPages = Math.ceil(totalCount / limit);

//   // Format date
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return "Unknown";
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric"
//       });
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "Unknown";
//     }
//   };

//   // Get artist initials for avatar fallback
//   const getArtistInitials = () => {
//     if (artist?.fullName) {
//       return artist.fullName
//         .split(" ")
//         .map((n: string) => n[0])
//         .join("")
//         .toUpperCase()
//         .substring(0, 2);
//     }
//     return "KH"; // Kala Hive default
//   };

//   if (error) {
//     return (
//       <MainLayout>
//         <div className="container py-8">
//           <div className="text-center py-12">
//             <h2 className="text-2xl font-bold mb-4">
//               {error || "Artist not found"}
//             </h2>
//             <Button onClick={() => router.push("/explore")}>
//               Explore Artists
//             </Button>
//           </div>
//         </div>
//       </MainLayout>
//     );
//   }

//   if (!artist) {
//     return (
//       <MainLayout>
//         <div className="container py-8">
//           {/* Skeleton for artist profile */}
//           <div className="flex flex-col md:flex-row gap-8 mb-12">
//             {/* Avatar skeleton */}
//             <div className="flex-shrink-0">
//               <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-muted animate-pulse"></div>
//             </div>

//             {/* Profile info skeleton */}
//             <div className="flex-1">
//               <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2"></div>
//               <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4"></div>

//               <div className="flex flex-wrap gap-4 mb-6">
//                 <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
//                 <div className="h-5 w-36 bg-muted rounded animate-pulse"></div>
//                 <div className="h-5 w-28 bg-muted rounded animate-pulse"></div>
//               </div>

//               <div className="h-4 w-full bg-muted rounded animate-pulse mb-1"></div>
//               <div className="h-4 w-5/6 bg-muted rounded animate-pulse mb-1"></div>
//               <div className="h-4 w-4/6 bg-muted rounded animate-pulse mb-6"></div>

//               <div className="flex flex-wrap gap-4">
//                 <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
//                 <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
//               </div>
//             </div>
//           </div>

//           {/* Skeleton for tabs */}
//           <div className="h-10 w-32 bg-muted rounded animate-pulse mb-6"></div>

//           {/* Skeleton for artworks grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {Array.from({ length: 4 }).map((_, index) => (
//               <div key={index} className="aspect-square bg-muted rounded animate-pulse"></div>
//             ))}
//           </div>
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <div className="container py-8">
//         {/* Cover Image */}
//         <div className="relative w-full h-48 md:h-64 lg:h-80 mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-purple-900/50 to-blue-900/50">
//           {artist.coverImage && (
//             <Image
//               src={artist.coverImage}
//               alt={`${artist.fullName}'s cover`}
//               fill
//               className="object-cover"
//             />
//           )}
//         </div>

//         {/* Artist Profile Header */}
//         <div className="flex flex-col md:flex-row gap-8 mb-12 -mt-16 md:-mt-20 relative z-10">
//           {/* Avatar */}
//           <div className="flex-shrink-0 ml-4">
//             <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background">
//               <AvatarImage
//                 src={artist.profileImage || ""}
//                 alt={artist.fullName || artist.userName}
//               />
//               <AvatarFallback className="text-3xl">
//                 {getArtistInitials()}
//               </AvatarFallback>
//             </Avatar>
//           </div>

//           {/* Profile Info */}
//           <div className="flex-1 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
//             <h1 className="text-3xl font-bold mb-2">{artist.fullName}</h1>
//             <p className="text-muted-foreground mb-4">@{artist.userName}</p>

//             <div className="flex flex-wrap gap-4 mb-6">
//               {artist.location && (
//                 <div className="flex items-center gap-2">
//                   <MapPin className="h-4 w-4 text-muted-foreground" />
//                   <span>{artist.location}</span>
//                 </div>
//               )}
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//                 <span>Joined {formatDate(artist.created_at)}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Grid className="h-4 w-4 text-muted-foreground" />
//                 <span>{totalCount} artworks</span>
//               </div>
//             </div>

//             {artist.bio && (
//               <div className="mb-6">
//                 <h2 className="text-lg font-semibold mb-2">About</h2>
//                 <p className="text-muted-foreground whitespace-pre-line">
//                   {artist.bio}
//                 </p>
//               </div>
//             )}

//             <div className="flex flex-wrap gap-4">
//               {artist.contactPreference === 'email' && artist.email && (
//                 <Button variant="outline" size="sm" asChild>
//                   <a href={`mailto:${artist.email}`}>
//                     <Mail className="mr-2 h-4 w-4" />
//                     Contact
//                   </a>
//                 </Button>
//               )}
//               {artist.contactPreference === 'website' && artist.website && (
//                 <Button variant="outline" size="sm" asChild>
//                   <a
//                     href={artist.website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <LinkIcon className="mr-2 h-4 w-4" />
//                     Website
//                   </a>
//                 </Button>
//               )}
//               {artist.contactPreference === 'custom' && artist.customContactInfo && (
//                 <div className="flex items-center gap-2 text-sm">
//                   <Info className="h-4 w-4 text-muted-foreground" />
//                   <span>{artist.customContactInfo}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Artist's Artworks */}
//         <Tabs defaultValue="artworks" className="mb-8">
//           <TabsList>
//             <TabsTrigger value="artworks">Artworks</TabsTrigger>
//             {/* Add more tabs in the future like "Collections", "About", etc. */}
//           </TabsList>
//           <TabsContent value="artworks" className="mt-6">
//             {artworks.length === 0 ? (
//               <div className="text-center py-12">
//                 <h3 className="text-xl font-semibold mb-2">No artworks yet</h3>
//                 <p className="text-muted-foreground">
//                   This artist hasn't uploaded any artworks yet.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                   {artworks.map((artwork) => (
//                     <ArtworkCard key={artwork.id} artwork={artwork} />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <Pagination className="mt-8">
//                     <PaginationContent>
//                       <PaginationItem>
//                         {page === 1 ? (
//                           <Button variant="ghost" size="default" className="gap-1 pl-2.5 opacity-50 cursor-not-allowed" disabled>
//                             <ChevronLeft className="h-4 w-4" />
//                             <span>Previous</span>
//                           </Button>
//                         ) : (
//                           <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
//                         )}
//                       </PaginationItem>

//                       {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                         (pageNum) => (
//                           <PaginationItem key={pageNum}>
//                             <PaginationLink
//                               isActive={page === pageNum}
//                               onClick={() => setPage(pageNum)}
//                             >
//                               {pageNum}
//                             </PaginationLink>
//                           </PaginationItem>
//                         )
//                       )}

//                       <PaginationItem>
//                         {page === totalPages ? (
//                           <Button variant="ghost" size="default" className="gap-1 pr-2.5 opacity-50 cursor-not-allowed" disabled>
//                             <span>Next</span>
//                             <ChevronRight className="h-4 w-4" />
//                           </Button>
//                         ) : (
//                           <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
//                         )}
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 )}
//               </>
//             )}
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