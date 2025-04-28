"use client";
import { Calendar } from "@/components/ui/calendar";

import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useBookingCalendar } from "@/app/context/BookingContext";
import { useEffect, useState } from "react";
import { TimeSlot } from "@/app/api/calendar/available-slots/route";

const BookingCalendar = ({ form }) => {
  const {
    isSelected,
    setIsSelected,
    selectedDate,
    setSelectedDate,
    clearSelected,
  } = useBookingCalendar();
  const [isLoading, setIsLoading] = useState(true);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const enabledDates = slots.map(({ date }) => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day); // monthIndex is 0‑based
  });

  const { setValue } = form;

  const slotsForSelectedDate = slots.filter((slot) => {
    if (!selectedDate) return false;
    const [y, m, d] = slot.date.split("-").map(Number);
    const slotDay = new Date(y, m - 1, d); // local midnight of that date
    return slotDay.toDateString() === selectedDate.toDateString();
  });

  const createBooking = () => {};

  const handleTimeSelect = async (slotDate, idx) => {
    if (isSelected === idx) {
      return clearSelected();
    }

    // Only validate the fields in the current step
    const start = slotDate.toISOString();
    const end = new Date(slotDate.getTime() + 30 * 60 * 1000).toISOString(); // +30 mins
    // const isValid = await trigger(["slotDate"], { shouldFocus: false });
    // if (!isValid) return;
    setIsSelected(idx);
    setValue("slotDate", { start, end }, { shouldValidate: false });

    return;
    try {
      const resp = await fetch("/api/calendar/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Name",
          email: "name@example.com",
          slot: {
            start,
            end,
          },
        }),
      });
      const data = resp.json();
      console.log({ respData: data });
      if (resp.ok) {
        alert("Appointment Booked!");
      } else {
        throw Error;
      }
    } catch (err) {
      console.log("Error booking:", err);
      alert("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    clearSelected();
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
  }, [selectedDate]);

  return (
    <div className="flex flex-col ">
      <div className="flex w-full justify-center items-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="mb-6 rounded-md border shadow-xs"
          disabled={(date) =>
            !enabledDates.some(
              (ed) => ed.toDateString() === date.toDateString()
            )
          }
        />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="w-full flex flex-col items-center">
            <div className="flex w-full flex-col gap-4 max-w-3xl">
              {selectedDate && (
                <>
                  <p>
                    Time shown in <span className="font-semibold">PT</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {slotsForSelectedDate[0]?.slots.map((slot, idx) => {
                      const [hour, minute] = slot.split(":").map(Number);
                      const slotDate = new Date(selectedDate);
                      slotDate.setHours(hour, minute, 0, 0);

                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`border rounded-md px-3 py-2 hover:bg-black hover:text-white cursor-pointer shadow-xs  ${
                            isSelected === idx ? "bg-black text-white" : ""
                          }`}
                          onClick={() => handleTimeSelect(slotDate, idx)}
                        >
                          {slotDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
          <FormField
            control={form.control}
            name="slotDate"
            render={() => (
              <FormItem>
                <FormMessage className="pt-6" />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export { BookingCalendar };
