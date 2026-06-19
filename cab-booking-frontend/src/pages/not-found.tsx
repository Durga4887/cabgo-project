import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-start justify-center gap-4 rounded-3xl border border-border bg-card p-8 shadow-sm">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-xl text-muted-foreground">
        The route you opened does not exist. Use the navigation to return to the main app.
      </p>
      <Button asChild>
        <NavLink to="/">Go home</NavLink>
      </Button>
    </section>
  )
}