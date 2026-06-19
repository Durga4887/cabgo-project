import BookingForm from './BookingForm'
import Hero from './Hero'
import Navbar from './Navbar'

const services = [
  {
    title: 'Instant Booking',
    description: 'Reserve a cab in just a few taps with a clean flow designed for speed.',
  },
  {
    title: 'Safe Rides',
    description: 'Verified drivers, live trip visibility, and a user-first experience.',
  },
  {
    title: 'Affordable Pricing',
    description: 'Transparent fares with no hidden surprises for every journey.',
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <BookingForm />

        <section id="services" className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-300">Services</p>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Everything you need for a modern cab platform</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-white/8"
                >
                  <div className="mb-4 h-12 w-12 rounded-2xl bg-yellow-400/15 ring-1 ring-yellow-400/20" />
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-yellow-400/15 bg-[#111111] p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-300">About</p>
              <h2 className="text-3xl font-black sm:text-4xl">Built for a polished ride-booking experience</h2>
            </div>
            <p className="text-base leading-8 text-gray-400 sm:text-lg">
              CabGo is a responsive landing page foundation for an Uber or Ola style booking product. It is structured for growth, styled with a bold black and yellow theme, and organized into reusable sections that can later connect to authentication, maps, and live trip tracking.
            </p>
          </div>
        </section>

        <section id="contact" className="px-4 py-12 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-300">Contact</p>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">We are ready when you are</h2>
              </div>
              <div className="grid gap-4 text-gray-300">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="mt-1 font-semibold text-white">support@cabgo.com</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="mt-1 font-semibold text-white">+1 (555) 204-4000</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home