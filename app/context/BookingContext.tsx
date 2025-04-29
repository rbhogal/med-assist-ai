// TODO: store typings in separate file

import { createContext, useContext, useState } from "react";

type SlotDate = {
  start: string;
  end: string;
};

type BookingContextType = {
  selectedDate: SlotDate | null;
  setSelectedDate: (date: SlotDate) => void;
  isSelected: number | null;
  setIsSelected: (val: number | null) => void;
  handleSelectedDate: (date: SlotDate) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingCalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedDate, setSelectedDate] = useState<SlotDate | null>(null);
  const [isSelected, setIsSelected] = useState<number | null>(null);

  const handleSelectedDate = (date) => {
    setIsSelected(null);
    setSelectedDate(date);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        isSelected,
        setIsSelected,
        handleSelectedDate,
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
