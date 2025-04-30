"use client";
import { BookingCalendar } from "@/components/booking-calendar";
import { useRef, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import { BookingCalendarProvider } from "@/app/context/BookingContext";
import { Wizard, WizardHandle, WizardStep } from "@/components/wizard/wizard";
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

export const FormSchema = z.object({
  ...calenderSchema.shape,
  ...contactSchema.shape,
});

type FormData = {
  slotDate: {
    start: string;
    end: string;
  };
  firstName: string;
  lastName: string;
  email: string;
};

type Steps = WizardStep[];

export default function Booking() {
  const wizardRef = useRef<WizardHandle>(null);
  const [calenderEventLink, setCalenderEventLink] = useState(undefined);

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

  const steps: Steps = [
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
        <div className="flex flex-col">
          <p>{`We've booked your appointment, you're all set. See you soon!`}</p>
          <p className="pt-6">
            <a
              className="text-blue-500  hover:text-blue-600 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
              href={calenderEventLink}
            >
              Click here to add the appointment to your google calender
            </a>
          </p>
        </div>
      ),
    },
  ];

  // Function to handle form submission
  const onSubmit = async (data: FormData) => {
    const { firstName, lastName, email, slotDate } = data;
    const { start, end } = slotDate;

    try {
      const resp = await fetch("/api/calendar/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: email,
          slot: {
            start,
            end,
          },
        }),
      });
      const respData = await resp.json();
      setCalenderEventLink(respData.link);
      console.log(respData.link);

      if (!resp.ok) throw Error;
    } catch (err) {
      console.log("Error booking:", err);
      alert("Something went wrong. Try again.");
    }

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
