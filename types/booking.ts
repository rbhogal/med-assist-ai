import { z } from "zod";
import { WizardStep } from "./wizard";

export const calenderSchema = z.object({
  slotDate: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .refine((data) => data.start && data.end, {
      message: "Please select a date and time.",
    }),
});

export const contactSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email" }),
});

export const FormSchema = z.object({
  ...calenderSchema.shape,
  ...contactSchema.shape,
});

export type BookingFormData = z.infer<typeof FormSchema>;

export type FormData = {
  slotDate: {
    start: string;
    end: string;
  };
  firstName: string;
  lastName: string;
  email: string;
};

export type Steps = WizardStep[];

/**
 * A time slot interval with ISO start/end
 */
export type TimeSlot = {
  slots: string[];
  date: string;
  start: string;
  end: string;
};

export type SlotRange = {
  start: string;
  end: string;
};

export type BookingContextType = {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date) => void;
  isSelected: number | null;
  setIsSelected: (val: number | null) => void;
  handleSelectedDate: (date: Date | undefined) => void;
};
