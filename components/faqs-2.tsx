"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQsTwo() {
  const faqItems = [
    {
      id: "item-1",
      question: "What kind of questions can the chatbot handle?",
      answer:
        "Anything you want. From “Do you accept my insurance?” to “What are your hours?” and “How do I prepare for my appointment?” You control the FAQs.",
    },
    {
      id: "item-2",
      question: "Is patient data secure?",
      answer:
        "HIPAA compliance is only required if collecting a reason for visit. For that reason we currently only collect name, email, and phone number. Currently working on ensuring future features are HIPAA compliant.",
    },
    {
      id: "item-3",
      question: "Which EHR integrations do you support?",
      answer:
        "We're flexible. We'll support any custom integration if your EHR provides an API or third-party integrations.",
    },
    {
      id: "item-4",
      question: "How long does integration take?",
      answer:
        "It depends on your EHR and use case, but most should be up and running within a few weeks after onboarding.",
    },
    {
      id: "item-5",
      question: "Is there ongoing support?",
      answer:
        "Yes. We’ll be available for ongoing support, updates, and tweaks as your needs evolve.",
    },
    {
      id: "item-6",
      question: "How do I update my FAQs or change the flow?",
      answer:
        "You’ll get access to a simple dashboard (or just email us). We’ll make it easy.",
    },
    {
      id: "item-7",
      question: "How much does it cost?",
      answer:
        "We’re still finalizing pricing. Join the waitlist or book a call, and we’ll reach out when it’s ready.",
    },
  ];

  return (
    <section id="faqs" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Everything you might want to know about our platform, services, and
            features.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8">
            Can&apos;t find what you&apos;re looking for? Contact our{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
