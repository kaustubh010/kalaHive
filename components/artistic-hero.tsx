"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ArtisticHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Bubble class
    class Bubble {
      x: number
      y: number
      radius: number
      color: string
      speedX: number
      speedY: number
      doodle: number

      constructor(x: number, y: number, radius: number) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = `hsla(${Math.random() * 60 + 250}, 70%, 60%, 0.2)`
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.doodle = Math.floor(Math.random() * 3)
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Draw doodle inside bubble
        ctx.save()
        ctx.clip()

        // Different doodle patterns
        switch (this.doodle) {
          case 0: // Spiral
            this.drawSpiral(ctx)
            break
          case 1: // Stars
            this.drawStars(ctx)
            break
          case 2: // Squiggles
            this.drawSquiggles(ctx)
            break
        }

        ctx.restore()
      }

      drawSpiral(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
        ctx.lineWidth = 1
        ctx.beginPath()

        const spiralRadius = this.radius * 0.8
        const turns = 4
        const pointsPerTurn = 20
        const totalPoints = turns * pointsPerTurn

        for (let i = 0; i < totalPoints; i++) {
          const angle = (i / pointsPerTurn) * Math.PI * 2
          const scale = i / totalPoints
          const x = this.x + Math.cos(angle) * spiralRadius * scale
          const y = this.y + Math.sin(angle) * spiralRadius * scale

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
      }

      drawStars(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"

        const starCount = Math.floor(this.radius / 5)

        for (let i = 0; i < starCount; i++) {
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * this.radius * 0.8
          const x = this.x + Math.cos(angle) * distance
          const y = this.y + Math.sin(angle) * distance
          const size = Math.random() * 3 + 1

          ctx.beginPath()
          for (let j = 0; j < 5; j++) {
            const starAngle = (j * Math.PI * 2) / 5 - Math.PI / 2
            const starX = x + Math.cos(starAngle) * size
            const starY = y + Math.sin(starAngle) * size

            if (j === 0) {
              ctx.moveTo(starX, starY)
            } else {
              ctx.lineTo(starX, starY)
            }
          }
          ctx.closePath()
          ctx.fill()
        }
      }

      drawSquiggles(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
        ctx.lineWidth = 1

        const squiggleCount = 3

        for (let i = 0; i < squiggleCount; i++) {
          const startAngle = Math.random() * Math.PI * 2
          const startDistance = Math.random() * this.radius * 0.3 + this.radius * 0.2
          const startX = this.x + Math.cos(startAngle) * startDistance
          const startY = this.y + Math.sin(startAngle) * startDistance

          ctx.beginPath()
          ctx.moveTo(startX, startY)

          const points = 10
          let prevX = startX
          let prevY = startY

          for (let j = 0; j < points; j++) {
            const angle = startAngle + (j / points) * Math.PI
            const distance = startDistance + Math.sin(j * 0.5) * 10
            const x = this.x + Math.cos(angle) * distance
            const y = this.y + Math.sin(angle) * distance

            const cpx = prevX + (x - prevX) / 2 + Math.random() * 10 - 5
            const cpy = prevY + (y - prevY) / 2 + Math.random() * 10 - 5

            ctx.quadraticCurveTo(cpx, cpy, x, y)

            prevX = x
            prevY = y
          }

          ctx.stroke()
        }
      }

      update(width: number, height: number) {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x - this.radius < 0 || this.x + this.radius > width) {
          this.speedX = -this.speedX
        }

        if (this.y - this.radius < 0 || this.y + this.radius > height) {
          this.speedY = -this.speedY
        }
      }
    }

    // Create bubbles
    const bubbleCount = 15
    const bubbles: Bubble[] = []

    const { width, height } = canvas.getBoundingClientRect()

    for (let i = 0; i < bubbleCount; i++) {
      const radius = Math.random() * 40 + 20
      const x = Math.random() * (width - radius * 2) + radius
      const y = Math.random() * (height - radius * 2) + radius
      bubbles.push(new Bubble(x, y, radius))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      bubbles.forEach((bubble) => {
        bubble.update(width, height)
        bubble.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
      {/* Background canvas for animated doodle bubbles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-background to-background z-0"></div>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <h1 className="relative font-bold text-left mb-6">
            {/* Main heading with doodle effect */}
            <span className="block text-7xl md:text-8xl lg:text-9xl leading-tight doodle-text">Create</span>
            <span className="block text-6xl md:text-7xl lg:text-8xl mt-2 gradient-text">& Inspire</span>

            {/* SVG doodle overlays */}
            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              viewBox="0 0 600 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Underline doodle */}
              <path
                d="M20,120 C60,150 120,130 180,120 C240,110 300,100 360,110 C420,120 480,140 540,130"
                stroke="#a78bfa"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                className="doodle-path"
              />

              {/* Decorative circles */}
              <circle cx="50" cy="50" r="10" fill="#8b5cf6" className="doodle-circle" />
              <circle cx="500" cy="70" r="15" fill="#a78bfa" className="doodle-circle" />
              <circle cx="400" cy="40" r="8" fill="#8b5cf6" className="doodle-circle" />
              <circle cx="100" cy="90" r="12" fill="#a78bfa" className="doodle-circle" />

              {/* Decorative stars */}
              <path
                d="M450,30 L455,20 L460,30 L470,35 L460,40 L455,50 L450,40 L440,35 Z"
                fill="#8b5cf6"
                className="doodle-star"
              />
              <path
                d="M150,40 L153,33 L156,40 L163,43 L156,46 L153,53 L150,46 L143,43 Z"
                fill="#a78bfa"
                className="doodle-star"
              />
            </svg>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-left mb-8 max-w-2xl">
            Join our vibrant community of artists where creativity knows no bounds. Showcase your talent, connect with
            art enthusiasts, and turn your passion into opportunity.
          </p>

          <div className="flex gap-4">
            <Button size="lg" className="rounded-full text-lg px-8" asChild>
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-lg px-8" asChild>
              <Link href="/explore">Explore Art</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-20 top-1/4 w-80 h-80 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow"></div>
      <div className="absolute right-1/4 bottom-1/4 w-40 h-40 rounded-full border border-primary/30 animate-float"></div>
    </div>
  )
}

