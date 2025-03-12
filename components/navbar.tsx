"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd, Settings, User, LogOut, Upload, Palette, Search, Menu, X, Home, ShoppingBag, Info, Mail } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function Navbar() {
  const router = useRouter();
  const { user, profile, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { href: "/explore", label: "Explore", icon: <Search className="h-4 w-4 mr-2" /> },
    { href: "/artists", label: "Artists", icon: <Palette className="h-4 w-4 mr-2" /> },
    { href: "/marketplace", label: "Marketplace", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    { href: "/about", label: "About", icon: <Info className="h-4 w-4 mr-2" /> },
    { href: "/contact", label: "Contact", icon: <Mail className="h-4 w-4 mr-2" /> },
  ];

  // Function to navigate and close mobile menu
  const navigateTo = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <span className="hidden sm:inline">Art Realm</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {loading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            ) : user ? (
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
                  <DropdownMenuContent align="end" className="min-w-[200px]">
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

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            {!loading && user && (
              <Button variant="outline" size="sm" className="mr-2" asChild>
                <Link href="/upload">
                  <Upload className="h-4 w-4" />
                </Link>
              </Button>
            )}
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex-1 py-6">
                    {loading ? (
                      <div className="flex items-center gap-4 mb-6">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </div>
                    ) : user ? (
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={profile?.profileImage || ""} 
                            alt={profile?.fullName || "User"} 
                          />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{profile?.fullName || "User"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mb-6">
                        <SheetClose asChild>
                          <Button className="flex-1" onClick={() => router.push("/login")}>
                            Log in
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button className="flex-1" variant="outline" onClick={() => router.push("/signup")}>
                            Sign up
                          </Button>
                        </SheetClose>
                      </div>
                    )}

                    <nav className="space-y-1">
                      <SheetClose asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start" 
                          onClick={() => router.push("/")}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          Home
                        </Button>
                      </SheetClose>
                      
                      {navLinks.map((link) => (
                        <SheetClose key={link.href} asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            onClick={() => router.push(link.href)}
                          >
                            {link.icon}
                            {link.label}
                          </Button>
                        </SheetClose>
                      ))}
                      
                      {user && (
                        <>
                          <SheetClose asChild>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start" 
                              onClick={() => router.push("/dashboard")}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Dashboard
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start" 
                              onClick={() => router.push(`/artist/${getUserName()}`)}
                            >
                              <Palette className="mr-2 h-4 w-4" />
                              My Profile
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start" 
                              onClick={() => router.push("/settings")}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start" 
                              onClick={handleSignOut}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Log out
                            </Button>
                          </SheetClose>
                        </>
                      )}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from being hidden under the navbar */}
      <div className="h-16"></div>
    </>
  );
} 