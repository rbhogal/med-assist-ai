"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Waitlist() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <section className="py-32 ">
          <div className="mx-auto max-w-3xl px-8 lg:px-0">
            <h1 className="text-center text-4xl font-semibold lg:text-5xl">
              Your Clinic’s AI Assistant Is Coming
            </h1>
            <p className="mt-4 text-center">
              Simpler scheduling and fewer phone calls are almost here.
            </p>

            <Card className="mx-auto mt-12 max-w-lg p-8 shadow-md sm:p-16">
              <div>
                <h2 className="text-xl font-semibold text-center">
                  Join the waitlist to stay in the loop.{" "}
                </h2>
                {/* <p className="mt-4 text-sm">
Reach out to our sales team! We’re eager to learn more about how
you plan to use our application.
</p> */}
              </div>

              <form
                action="https://submit-form.com/sHtek1YX7"
                className="**:[&>label]:block  space-y-6 *:space-y-3 flex gap-2"
              >
                <Input
                  placeholder="example@email.com"
                  name="email"
                  type="email"
                  id="email"
                  required
                />
                <Button type="submit" className="cursor-pointer">
                  Join
                </Button>
              </form>
              {/* {status && <p className="text-center">{status}</p>} */}
            </Card>
          </div>
        </section>
      </div>
      <footer className="border-b  py-12 dark:bg-transparent">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex justify-center">
            <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
              © {new Date().getFullYear()} MedAssist. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
