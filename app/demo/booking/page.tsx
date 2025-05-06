"use client";

import { useRef, useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BookingCalendarProvider } from "@/app/context/BookingContext";
import { BookingCalendar } from "@/components/wizard/steps/booking-calendar";
import { PersonalInfoStep } from "@/components/wizard/steps/personal-info-step";
import { Wizard } from "@/components/wizard/wizard";
import { ConfirmationStep } from "@/components/wizard/steps/confirmation-step";

import {
  BookingFormData,
  calenderSchema,
  contactSchema,
  FormSchema,
  Steps,
  FormData,
} from "@/types/booking";
import { WizardHandle } from "@/types/wizard";

export default function Booking() {
  const wizardRef = useRef<WizardHandle>(null);
  const [calenderEventLink, setCalenderEventLink] = useState<
    string | undefined
  >(undefined);

  const form = useForm<BookingFormData>({
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
      content: <ConfirmationStep url={calenderEventLink} />,
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

      if (!resp.ok) throw Error;

      const respData = await resp.json();
      setCalenderEventLink(respData.link);
      wizardRef.current?.goNext();
    } catch (err) {
      console.log("Error booking:", err);
      alert("Something went wrong trying too book appointment. Try again.");
    }
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
