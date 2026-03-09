import React, { useState, useEffect, ChangeEvent } from "react";

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

  const rentalOptions = [
    { id: 1, days: 4, label: "4 Days Rental" },
    { id: 2, days: 8, label: "8 Days Rental" },
  ];

  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(start.getDate() + rentalDuration);
        const endDateStr = end.toISOString().split("T")[0];
        setEndDate(endDateStr);
      }
    }
  }, [startDate, rentalDuration]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setRentalDurationDays(0);
        return;
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRentalDurationDays(diffDays);
    } else {
      setRentalDurationDays(0);
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
  };

  const handleRentalDurationChange = (days: number): void => {
    setRentalDuration(days);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-5">
      <h1 className="font-medium mb-2">
        Date Range <span className="text-xl text-red-500">*</span>
      </h1>

      <div className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Rental Duration
          </label>
          <div className="flex gap-4">
            {rentalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleRentalDurationChange(option.days)}
                className={`px-4 py-2 rounded-md border ${rentalDuration === option.days
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  } transition-colors`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5 w-full">
              {/* Start Date */}
              <div className="flex flex-col gap-1 w-full md:w-auto">
                <label className="text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="w-full md:w-[180px] focus-visible:ring-0 border border-input h-10 md:h-9 rounded-md text-base shadow-sm px-3 py-1 bg-inherit"
                />
              </div>

              {/* Separator */}
              <div className="hidden md:block mt-5">
                <div className="w-5 h-1 border-b-2 border-black"></div>
              </div>

              {/* End Date (Read-only) */}
              <div className="flex flex-col gap-1 w-full md:w-auto">
                <label className="text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  readOnly
                  className="w-full md:w-[180px] focus-visible:ring-0 border border-input h-10 md:h-9 rounded-md text-base shadow-sm px-3 py-1 bg-inherit bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Display Summary */}
        {(startDate || endDate) && (
          <div className="mt-4 p-4 bg-primary/10 rounded-md border border-primary/15">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Selected Duration</p>
                <p className="text-lg font-semibold text-primary">
                  {rentalDuration} Days
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rental Days</p>
                <p className="text-lg font-semibold text-primary">
                  {rentalDurationDays} day{rentalDurationDays !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {startDate && endDate && (
              <div className="mt-3 pt-3 border-t border-primary/25">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Period:</span>{" "}
                  {formatDate(startDate)} to {formatDate(endDate)}
                </p>
              </div>
            )}
          </div>
        )}

        {!startDate && (
          <div className="mt-2 text-sm text-gray-500">
            Please select a start date. End date will be automatically
            calculated based on selected rental duration.
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRange;
