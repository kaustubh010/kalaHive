import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function PlatformSection() {
  return (
    <div className="container relative">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">A Platform for Every Artist</h2>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Whether you're just starting your creative journey or you're an established professional, ArtistHub
              provides the tools and community you need to thrive.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">For Beginners</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Learning resources</li>
                  <li>• Community feedback</li>
                  <li>• Basic portfolio tools</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">For Professionals</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Advanced analytics</li>
                  <li>• Commission management</li>
                  <li>• Custom branding</li>
                </ul>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href="/signup">
              Join Our Community <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-rXEcGxxJ8voxluF4GxRGBE1FOxRmy7.png"
                alt="Portrait artwork"
                fill
                className="object-cover"
              />
            </div>
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-rXEcGxxJ8voxluF4GxRGBE1FOxRmy7.png"
                alt="Character artwork"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-rXEcGxxJ8voxluF4GxRGBE1FOxRmy7.png"
                alt="Wildlife artwork"
                fill
                className="object-cover"
              />
            </div>
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-rXEcGxxJ8voxluF4GxRGBE1FOxRmy7.png"
                alt="Portrait artwork"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

