export function SupportPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-3 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Support</h1>
        <p className="text-muted-foreground">
          Add your support center, FAQ, and contact flows here. The scaffold is ready for a real
          backend or third-party helpdesk integration.
        </p>
      </div>
      <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Contact</p>
            <p className="mt-1 text-lg font-medium">support@cabbooking.app</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="mt-1 text-lg font-medium">+1 (555) 101-2020</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hours</p>
            <p className="mt-1 text-lg font-medium">24/7 availability</p>
          </div>
        </div>
      </div>
    </section>
  )
}