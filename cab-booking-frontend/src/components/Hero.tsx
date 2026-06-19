import { ArrowRight } from 'lucide-react'

import heroImage from '@/assets/hero.png'

function Hero() {
  return (
    <section id="home" className="px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-7">
          <span className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-300">
            Premium cab booking for daily rides
          </span>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Book Your Ride Instantly
            </h1>
            <p className="max-w-xl text-lg leading-8 text-gray-300 sm:text-xl">
              Safe, Fast and Affordable Cab Booking
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-4 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20"
            >
              Book Now
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center rounded-full border border-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:border-yellow-400/40 hover:bg-white/5 hover:text-yellow-300"
            >
              Explore Services
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['2,500+', 'Trips completed'],
              ['4.9/5', 'Customer rating'],
              ['10 min', 'Average pickup'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-2xl font-black text-yellow-400">{value}</p>
                <p className="mt-1 text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-cover bg-center shadow-2xl shadow-black/40"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.75)), url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.2),transparent_38%)]" />
            <div className="absolute bottom-5 left-5 right-5 grid gap-4 rounded-[1.5rem] border border-white/10 bg-black/70 p-5 backdrop-blur-md sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-yellow-300">Live city coverage</p>
                <p className="mt-2 text-lg font-bold text-white">Fast pickups across your city</p>
              </div>
              <div className="grid gap-2 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Safety check</span>
                  <span className="font-semibold text-yellow-300">Verified</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[78%] rounded-full bg-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero