"use client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const BookingCalendar = ({ availableSlots }) => {
  console.log({ availableSlots });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const enabledDates = availableSlots.map(({ date }) => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day); // monthIndex is 0‑based
  });

  const slotsForSelectedDate = availableSlots.filter((slot) => {
    if (!selectedDate) return false;
    const [y, m, d] = slot.date.split("-").map(Number);
    const slotDay = new Date(y, m - 1, d); // local midnight of that date
    return slotDay.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border shadow-xs"
        disabled={(date) =>
          !enabledDates.some((ed) => ed.toDateString() === date.toDateString())
        }
      />
      {selectedDate && (
        <div className="grid grid-cols-2 gap-2">
          {slotsForSelectedDate[0]?.slots.map((slot, idx) => {
            const [hour, minute] = slot.split(":").map(Number);
            const slotDate = new Date(selectedDate);
            slotDate.setHours(hour, minute, 0, 0);

            return (
              <button
                key={idx}
                className="border rounded px-3 py-2 hover:bg-muted cursor-pointer shadow-xs"
                onClick={() =>
                  console.log("Selected slot:", slotDate.toISOString())
                }
              >
                {slotDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { BookingCalendar };
