"use client";
import { TimeSlot } from "@/app/api/calendar/available-slots/route";
import { BookingCalendar } from "@/components/booking-calendar";
import { ContactForm } from "@/components/booking/contact-form";
import Stepper from "@/components/ui/stepper";
import { ReactNode, useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  const [isLoading, setIsLoading] = useState(true);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  const steps = [
    {
      id: "calender",
      title: "Date and time",
      schema: calenderSchema,
      content: <BookingCalendar availableSlots={slots} form={form} />,
    },
    {
      id: "contact",
      title: "Contact",
      schema: contactSchema,
      content: <PersonalInfoStep form={form} />,
    },
    {
      id: "confirmation",
      title: "Booked!",
      schema: null,
      content: <p>Appointment booked!</p>,
    },
  ];

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setIsLoading(true);

      try {
        const resp = await fetch("/api/calendar/available-slots");
        if (!resp.ok) throw new Error("Failed to fetch available slots");
        const data = await resp.json();
        setSlots(data);
      } catch (err) {
        console.log({ Error: err });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, []);

  console.log(form.formState.errors);

  return (
    <div className="p-10">
      {/* <h1 className="font-bold text-3xl sm:text-4xl text-center sm:text-3xl  mb-6 sm:mb-6">
        Appointment Booking
      </h1> */}
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <BookingCalendarProvider>
          {/* <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Stepper steps={steps} form={form} />
            </form>
          </FormProvider> */}
          {/* <Wizard slots={slots} steps={steps} form={form} /> */}
          <Wizard steps={steps} form={form} slots={slots} />
        </BookingCalendarProvider>
      )}
    </div>
  );
}
