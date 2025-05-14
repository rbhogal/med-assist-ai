import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-16 md:py-32 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            See MedAssist in Action
          </h2>
          <p className="mt-4">
            Experience the power of chatbot support and seamless scheduling with
            our live demo.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="w-40">
              <Link href="/demo">
                <span>Try the Demo</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="w-40">
              <Link href="/waitlist">
                <span>Join the Waitlist</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
