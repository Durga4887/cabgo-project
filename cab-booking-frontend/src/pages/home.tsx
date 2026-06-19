import { ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const highlights = [
  {
    icon: Sparkles,
    title: 'Clean booking flow',
    description: 'Quick ride requests with a layout that can grow into real product logic.',
  },
  {
    icon: MapPin,
    title: 'Route-aware pages',
    description: 'Dedicated pages for booking, ride history, and support keep the app organized.',
  },
  {
    icon: ShieldCheck,
    title: 'Theme ready',
    description: 'Light and dark modes are wired through a shared provider and Tailwind tokens.',
  },
]

export function HomePage() {
  return (
    <section className="space-y-8">
      <div className="grid gap-6 rounded-3xl border border-border/70 bg-card/80 p-8 shadow-sm backdrop-blur sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            React + Vite + TypeScript + Tailwind + shadcn UI
          </span>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              A modern cab booking starter with routing and theming built in.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              This scaffold gives you a clean foundation for a cab booking product: reusable UI
              primitives, route separation, a persistent navbar, and theme support.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <NavLink to="/book">
                Start booking
                <ArrowRight className="h-4 w-4" />
              </NavLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <NavLink to="/rides">View ride history</NavLink>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-border bg-background/80 p-5">
          <div>
            <p className="text-sm text-muted-foreground">Today&apos;s status</p>
            <p className="text-2xl font-semibold">Ready to extend</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-muted/70 p-4">
              <p className="text-muted-foreground">Trips</p>
              <p className="mt-1 text-xl font-semibold">12</p>
            </div>
            <div className="rounded-xl bg-muted/70 p-4">
              <p className="text-muted-foreground">Drivers</p>
              <p className="mt-1 text-xl font-semibold">48</p>
            </div>
            <div className="rounded-xl bg-muted/70 p-4">
              <p className="text-muted-foreground">Avg ETA</p>
              <p className="mt-1 text-xl font-semibold">8 min</p>
            </div>
            <div className="rounded-xl bg-muted/70 p-4">
              <p className="text-muted-foreground">Rating</p>
              <p className="mt-1 text-xl font-semibold">4.9/5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <item.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}