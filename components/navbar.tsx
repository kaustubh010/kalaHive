"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd, Settings, User, LogOut, Upload, Palette, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    // Redirect immediately for better UX
    router.push("/login");
    
    // Then perform the actual signout
    await signOut();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile?.fullName) {
      return profile.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || "AR";
  };

  // Ensure profile has userName
  const getUserName = () => {
    return profile?.userName || (user?.email ? user.email.split("@")[0] : "user");
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span>Art Realm</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">
            Explore
          </Link>
          
          {user ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={profile?.profileImage || ""} 
                        alt={profile?.fullName || "User"} 
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.fullName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/artist/${getUserName()}`)}>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/explore")}>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Explore Art</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Log in
              </Button>
              <Button onClick={() => router.push("/signup")}>
                Sign up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 