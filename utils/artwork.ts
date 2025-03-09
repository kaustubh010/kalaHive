import { supabase } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export type Artwork = {
  id: string;
  title: string;
  description: string | null;
  artist_id: string;
  image_url: string;
  thumbnail_url: string | null;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  is_featured: boolean;
};

export type ArtworkWithArtist = Artwork & {
  profiles: {
    fullName: string;
    userName: string;
    profileImage: string | null;
  };
};

// Upload artwork image to Supabase Storage
export async function uploadArtworkImage(file: File, userId: string): Promise<{ path: string; error: any }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("artworks")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("artworks").getPublicUrl(filePath);

    return { path: data.publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading artwork:", error);
    return { path: "", error };
  }
}

// Create a new artwork entry in the database
export async function createArtwork(
  artwork: Omit<Artwork, "id" | "created_at" | "updated_at" | "view_count" | "like_count" | "is_featured">
): Promise<{ artwork: Artwork | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("artworks")
      .insert(artwork)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return { artwork: data, error: null };
  } catch (error) {
    console.error("Error creating artwork:", error);
    return { artwork: null, error };
  }
}

// Get artwork by ID
export async function getArtworkById(id: string): Promise<{ artwork: ArtworkWithArtist | null; error: any }> {
  try {
    // First get the artwork
    const { data: artwork, error: artworkError } = await supabase
      .from("artworks")
      .select("*")
      .eq("id", id)
      .single();

    if (artworkError) {
      console.error("Error fetching artwork:", artworkError);
      return { artwork: null, error: artworkError };
    }

    if (!artwork) {
      return { artwork: null, error: new Error("Artwork not found") };
    }

    // Then get the artist profile
    const { data: artistProfile, error: profileError } = await supabase
      .from("profiles")
      .select("fullName, userName, profileImage")
      .eq("id", artwork.artist_id)
      .single();

    // Create the combined object
    const artworkWithArtist: ArtworkWithArtist = {
      ...artwork,
      profiles: artistProfile || {
        fullName: "Unknown Artist",
        userName: `artist_${artwork.artist_id.substring(0, 8)}`,
        profileImage: null
      }
    };

    // If userName is null, create a default one
    if (!artworkWithArtist.profiles.userName) {
      artworkWithArtist.profiles.userName = `artist_${artwork.artist_id.substring(0, 8)}`;
    }
    
    // If fullName is null, use a default
    if (!artworkWithArtist.profiles.fullName) {
      artworkWithArtist.profiles.fullName = "Unknown Artist";
    }

    // Record a view for this artwork
    await recordArtworkView(id);

    return { artwork: artworkWithArtist, error: null };
  } catch (error) {
    console.error("Error getting artwork:", error);
    return { artwork: null, error };
  }
}

// Record a view for an artwork
export async function recordArtworkView(artworkId: string): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    await supabase.from("artwork_views").insert({
      artwork_id: artworkId,
      user_id: userId || null,
    });
  } catch (error) {
    console.error("Error recording artwork view:", error);
  }
}

// Like or unlike an artwork
export async function toggleArtworkLike(artworkId: string): Promise<{ liked: boolean; error: any }> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
      throw new Error("User must be logged in to like artworks");
    }

    // Check if the user has already liked this artwork
    const { data: existingLike, error: checkError } = await supabase
      .from("artwork_likes")
      .select("*")
      .eq("artwork_id", artworkId)
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingLike) {
      // Unlike the artwork
      const { error: unlikeError } = await supabase
        .from("artwork_likes")
        .delete()
        .eq("artwork_id", artworkId)
        .eq("user_id", userId);

      if (unlikeError) {
        throw unlikeError;
      }

      return { liked: false, error: null };
    } else {
      // Like the artwork
      const { error: likeError } = await supabase
        .from("artwork_likes")
        .insert({
          artwork_id: artworkId,
          user_id: userId,
        });

      if (likeError) {
        throw likeError;
      }

      return { liked: true, error: null };
    }
  } catch (error) {
    console.error("Error toggling artwork like:", error);
    return { liked: false, error };
  }
}

// Check if a user has liked an artwork
export async function hasUserLikedArtwork(artworkId: string): Promise<{ liked: boolean; error: any }> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
      return { liked: false, error: null };
    }

    const { data, error } = await supabase
      .from("artwork_likes")
      .select("*")
      .eq("artwork_id", artworkId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return { liked: !!data, error: null };
  } catch (error) {
    console.error("Error checking if user liked artwork:", error);
    return { liked: false, error };
  }
}

// Get artworks with various filters
export async function getArtworks({
  limit = 10,
  page = 1,
  category = null,
  sortBy = "created_at",
  sortOrder = "desc",
  artistId = null,
  featured = null,
  search = null,
}: {
  limit?: number;
  page?: number;
  category?: string | null;
  sortBy?: "created_at" | "view_count" | "like_count";
  sortOrder?: "asc" | "desc";
  artistId?: string | null;
  featured?: boolean | null;
  search?: string | null;
}): Promise<{ artworks: ArtworkWithArtist[]; count: number; error: any }> {
  try {
    // First, get the artworks with pagination and filters
    let query = supabase
      .from("artworks")
      .select("*", { count: "exact" });

    // Apply filters
    if (category) {
      query = query.eq("category", category);
    }

    if (artistId) {
      query = query.eq("artist_id", artistId);
    }

    if (featured !== null) {
      query = query.eq("is_featured", featured);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: artworks, error, count } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return { artworks: [], count: 0, error };
    }

    if (!artworks || artworks.length === 0) {
      return { artworks: [], count: 0, error: null };
    }

    // Get all unique artist IDs
    const artistIds = [...new Set(artworks.map(artwork => artwork.artist_id))];

    // Fetch all profiles for these artists in a single query
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, fullName, userName, profileImage")
      .in("id", artistIds);

    if (profilesError) {
      console.error("Error fetching artist profiles:", profilesError);
    }

    // Create a map of artist IDs to profiles for quick lookup
    const profileMap: Record<string, any> = (profiles || []).reduce((map: Record<string, any>, profile) => {
      map[profile.id] = profile;
      return map;
    }, {});

    // Combine artworks with their artist profiles
    const artworksWithProfiles = artworks.map(artwork => {
      const artistProfile = profileMap[artwork.artist_id] || null;
      
      return {
        ...artwork,
        profiles: artistProfile || {
          fullName: "Unknown Artist",
          userName: `artist_${artwork.artist_id.substring(0, 8)}`,
          profileImage: null
        }
      };
    });

    return { artworks: artworksWithProfiles as ArtworkWithArtist[], count: count || 0, error: null };
  } catch (error) {
    console.error("Error getting artworks:", error);
    return { artworks: [], count: 0, error };
  }
}

// Get artworks by a specific artist
export async function getArtworksByArtist(
  userName: string,
  limit = 10,
  page = 1
): Promise<{ artworks: ArtworkWithArtist[]; count: number; error: any }> {
  try {
    // First, get the artist's ID from their username
    const { data: artistData, error: artistError } = await supabase
      .from("profiles")
      .select("id")
      .eq("userName", userName)
      .single();

    if (artistError) {
      console.error("Error finding artist:", artistError);
      
      // Check if it's a "not found" error
      if (artistError.code === "PGRST116") {
        return { artworks: [], count: 0, error: new Error(`Artist with username '${userName}' not found`) };
      }
      
      return { artworks: [], count: 0, error: artistError };
    }

    if (!artistData || !artistData.id) {
      return { artworks: [], count: 0, error: new Error(`Artist with username '${userName}' has no ID`) };
    }

    // Then, get the artworks by this artist
    const result = await getArtworks({
      limit,
      page,
      artistId: artistData.id,
      sortBy: "created_at",
      sortOrder: "desc",
    });
    
    return result;
  } catch (error) {
    console.error("Error getting artworks by artist:", error);
    return { artworks: [], count: 0, error };
  }
}

// Delete an artwork
export async function deleteArtwork(id: string): Promise<{ success: boolean; error: any }> {
  try {
    // Get the artwork to check if the current user is the owner
    const { data: artwork, error: getError } = await supabase
      .from("artworks")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) {
      throw getError;
    }

    // Delete the artwork from the database
    const { error: deleteError } = await supabase
      .from("artworks")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    // Delete the artwork image from storage
    const imageUrl = artwork.image_url;
    const imagePath = imageUrl.split("/").pop();
    
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from("artworks")
        .remove([imagePath]);

      if (storageError) {
        console.error("Error deleting artwork image:", storageError);
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return { success: false, error };
  }
} 