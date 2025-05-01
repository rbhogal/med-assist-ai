import { createContext, SetStateAction, useContext, useState } from "react";
import { BookingContextType } from "@/types/booking";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingCalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSelected, setIsSelected] = useState<number | null>(null);

  const handleSelectedDate = (date: SetStateAction<Date | undefined>) => {
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
