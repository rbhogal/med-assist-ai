import { Cable, Calendar, Mail } from "lucide-react";
import Image from "next/image";
import Features from "./features-2";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-32">
      <Features />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-4xl font-semibold lg:text-5xl">
                Patient Appointment Booking
              </h2>
              <p className="mt-6">
                Integrate with your existing EHR and allow patients to easily
                book, reschedule, or cancel their appointments at their
                convenience 24/7 while keeping full control over your clinic's
                schedule.
              </p>
            </div>
            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <Cable className="size-5" />
                EHR Integration
              </li>
              <li>
                <Calendar className="size-5" />
                24/7 Patient Self-Booking
              </li>
              <li>
                <Mail className="size-5" />
                Email & Text Confirmations
              </li>
            </ul>
          </div>
          <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/screenshots/med-assist-feature-booking.png"
                className="hidden rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="/screenshots/med-assist-feature-booking.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
