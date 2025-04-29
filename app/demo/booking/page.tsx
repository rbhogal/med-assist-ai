"use client";
import { BookingCalendar } from "@/components/booking-calendar";
import { useRef } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import { BookingCalendarProvider } from "@/app/context/BookingContext";
import { Wizard } from "@/components/wizard/wizard";
import { PersonalInfoStep } from "@/components/wizard/steps/personal-info-step";

const calenderSchema = z.object({
  slotDate: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .refine((data) => data.start && data.end, {
      message: "Please select a date and time.",
    }),
});
const contactSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email" }),
});

const FormSchema = z.object({
  ...calenderSchema.shape,
  ...contactSchema.shape,
});

export default function Booking() {
  const wizardRef = useRef<WizardHandle>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      slotDate: { start: "", end: "" },
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const steps = [
    {
      id: "calender",
      title: "Date and time",
      schema: calenderSchema,
      content: <BookingCalendar form={form} />,
    },
    {
      id: "contact",
      title: "Contact",
      schema: contactSchema,
      content: <PersonalInfoStep form={form} />,
    },
    {
      id: "confirmation",
      title: "Appointment Confirmed! 🎉",
      schema: null,
      content: (
        <p>We've booked your appointment, you're all set. See you soon!</p>
      ),
    },
  ];

  // Function to handle form submission
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    wizardRef.current?.goNext();
  };

  return (
    <div className="p-4 sm:p-10">
      <BookingCalendarProvider>
        <FormProvider {...form}>
          <Form>
            <Wizard
              steps={steps}
              form={form}
              onSubmit={onSubmit}
              ref={wizardRef}
            />
          </Form>
        </FormProvider>
      </BookingCalendarProvider>
    </div>
  );
}
