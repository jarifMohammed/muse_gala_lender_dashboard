import React, { useState, useEffect } from "react";
import { format, addDays, subDays, isSameDay, isWithinInterval, startOfDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

interface Props {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  rentalDurationDays: number;
  setRentalDurationDays: (days: number) => void;
}

const DateRange = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  rentalDurationDays,
  setRentalDurationDays,
}: Props) => {
  const [rentalDuration, setRentalDuration] = useState<number>(4);
  const [eventDay, setEventDay] = useState<Date | undefined>(undefined);

  const rentalOptions = [
    { id: 1, days: 4, label: "4 Days Rental" },
    { id: 2, days: 8, label: "8 Days Rental" },
  ];

  // Calculate range whenever eventDay or rentalDuration changes
  useEffect(() => {
    if (eventDay) {
      let start: Date;
      let end: Date;

      if (rentalDuration === 4) {
        start = subDays(eventDay, 2);
        end = addDays(eventDay, 1);
      } else {
        start = subDays(eventDay, 6);
        end = addDays(eventDay, 1);
      }

      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both ends
      setRentalDurationDays(diffDays);
    }
  }, [eventDay, rentalDuration, setStartDate, setEndDate, setRentalDurationDays]);

  const handleDayClick = (day: Date) => {
    setEventDay(startOfDay(day));
  };

  const handleRentalDurationChange = (days: number): void => {
    setRentalDuration(days);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return format(date, "MMM d, yyyy");
  };

  // Define modifiers for the calendar
  const range = (startDate && endDate) ? {
    from: new Date(startDate),
    to: new Date(endDate)
  } : undefined;

  const modifiers: Record<string, any> = {};
  if (eventDay) modifiers.event = eventDay;
  if (range) modifiers.range = range;

  const modifiersStyles = {
    event: {
      backgroundColor: "#891d33",
      color: "white",
      borderRadius: "50%",
      fontWeight: "bold"
    },
    range: {
      backgroundColor: "rgba(137, 29, 51, 0.1)",
    }
  };

  return (
    <div className="mt-5 space-y-6">
      <div>
        <h1 className="font-medium mb-3 text-gray-900">
          Step 2: Select Event Day <span className="text-xl text-red-500">*</span>
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Rental Duration
          </label>
          <div className="flex gap-3">
            {rentalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleRentalDurationChange(option.days)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                  rentalDuration === option.days
                    ? "bg-[#891d33] text-white border-[#891d33] shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#891d33]/50 hover:bg-gray-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Calendar Picker */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mx-auto lg:mx-0">
            <DayPicker
              mode="single"
              selected={eventDay}
              onSelect={setEventDay}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rdp-custom"
              showOutsideDays
              styles={{
                caption: { color: "#891d33" },
                head_cell: { color: "#6b7280", fontWeight: "600" },
              }}
            />
          </div>

          {/* Guidelines & Summary */}
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Rental Policy</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#891d33]"></span>
                  <span><strong>Event Day:</strong> The day of your event.</span>
                </li>
                {rentalDuration === 4 ? (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#891d33]/20"></span>
                      <span><strong>4-Day Buffer:</strong> Starts 2 days before & ends 1 day after.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#891d33]/20"></span>
                      <span><strong>8-Day Buffer:</strong> Starts 6 days before & ends 1 day after.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {eventDay && (
              <div className="p-4 bg-[#891d33]/5 rounded-xl border border-[#891d33]/10 space-y-3 animate-in fade-in slide-in-from-top-1">
                <h3 className="text-sm font-bold text-[#891d33]">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Event Date</p>
                    <p className="text-sm font-semibold">{format(eventDay, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Duration</p>
                    <p className="text-sm font-semibold">{rentalDurationDays} Days</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#891d33]/20">
                  <p className="text-[10px] text-gray-500 uppercase">Total Rental Period</p>
                  <p className="text-xs font-medium text-gray-700">
                    {formatDate(startDate)} — {formatDate(endDate)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .rdp-custom .rdp-day_selected {
          background-color: transparent !important;
          color: inherit !important;
        }
        .rdp-custom .rdp-day_selected:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
};

export default DateRange;
