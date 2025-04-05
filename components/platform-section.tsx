"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Palette, Users, Sparkles, Zap, Star, Book, BarChart4, Briefcase } from "lucide-react"

export function PlatformSection() {
  return (
    <div className="container relative">
      {/* Decorative background elements */}
      <div className="absolute -z-10 top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"></div>
      <div className="absolute -z-10 bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Where Creativity Flourishes</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Our platform is designed to nurture artistic talent at every stage of your creative journey.
          Find the resources, community, and opportunities you need to thrive.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-background/60 backdrop-blur-sm p-6 rounded-xl border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Creative Freedom</h3>
          <p className="text-muted-foreground mb-4">
            Express yourself without limitations. Our platform supports various art forms, styles, and mediums, giving you complete creative freedom.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Multiple medium support</span>
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>High-quality uploads</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span>Feature opportunities</span>
            </li>
          </ul>
        </div>

        <div className="bg-background/60 backdrop-blur-sm p-6 rounded-xl border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Vibrant Community</h3>
          <p className="text-muted-foreground mb-4">
            Connect with fellow artists, enthusiasts, and collectors. Share ideas, receive feedback, and build meaningful connections.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Artist collaborations</span>
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Constructive feedback</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span>Global networking</span>
            </li>
          </ul>
        </div>

        <div className="bg-background/60 backdrop-blur-sm p-6 rounded-xl border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Professional Growth</h3>
          <p className="text-muted-foreground mb-4">
            Transform your passion into opportunity. Access tools and resources to elevate your art career to new heights.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4 text-primary" />
              <span>Performance analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <Book className="h-4 w-4 text-primary" />
              <span>Learning resources</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span>Commission opportunities</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" className="rounded-full" asChild>
          <Link href="/signup">
            Join Our Creative Community <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

