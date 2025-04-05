"use client"

import Link from "next/link"
import { GalleryVerticalEnd, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="h-4 w-4" />
              </div>
              <span className="font-semibold text-lg">Kala Hive</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              A creative platform for artists to showcase their work, connect with others, 
              and grow their artistic career.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Discover Art
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Upload Artwork
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Your Profile
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Onboarding
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kala Hive. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 