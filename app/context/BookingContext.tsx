// TODO: store typings in separate file

import { createContext, useContext, useState } from "react";

type SlotDate = {
  start: string;
  end: string;
};

type BookingContextType = {
  selectedDate: SlotDate | null;
  setSelectedDate: (date: SlotDate) => void;
  clearSelected: () => void;
  isSelected: number | null;
  setIsSelected: (val: number | null) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingCalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedDate, setSelectedDate] = useState<SlotDate | null>(null);
  const [isSelected, setIsSelected] = useState<number | null>(null);

  const clearSelected = () => {
    setIsSelected(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        clearSelected,
        isSelected,
        setIsSelected,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingCalendar = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error(
      "useBookingCalendar must be used within a BookingCalendarProvider"
    );
  }
  return context;
};
