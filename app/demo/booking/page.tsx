"use client";
import { TimeSlot } from "@/app/api/calendar/available-slots/route";
import { BookingCalendar } from "@/components/booking-calendar";
import { Calendar } from "@/components/ui/calendar";
import { getBusyTimes } from "@/lib/google/utils";
import { useEffect, useState } from "react";

const availableSlots = [
  {
    date: "2025-04-17",
    slots: ["09:00", "10:30", "14:00", "16:30"],
  },
  {
    date: "2025-04-18",
    slots: ["10:00", "11:30", "13:00", "15:30"],
  },
  {
    date: "2025-04-19",
    slots: ["09:00", "12:00", "14:30"],
  },
  {
    date: "2025-04-20",
    slots: ["10:00", "11:00", "13:30", "15:00", "16:00"],
  },
  {
    date: "2025-04-21",
    slots: ["09:30", "11:00", "14:00"],
  },
  {
    date: "2025-04-22",
    slots: ["10:00", "12:30", "15:00"],
  },
  {
    date: "2025-04-23",
    slots: ["09:00", "10:30", "13:00", "14:30", "16:00"],
  },
];

export default function Booking() {
  const [isLoading, setIsLoading] = useState(true);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

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

  return (
    <div className="flex w-full justify-center p-10 items-center">
      {isLoading ? "loading..." : <BookingCalendar availableSlots={slots} />}
    </div>
  );
}
