"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import React, { useState, useMemo, useRef, useEffect } from "react";

interface Event {
  bookingId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  dressName: string;
  customer: string;
  status: string;
}

interface CalendarData {
  month: number;
  year: number;
  totalEvents: number;
  events: Event[];
}

const Calendar = ({ token }: { token: string }) => {
  const [selectedDress, setSelectedDress] = useState<string>("All");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [hoveredDate, setHoveredDate] = useState<{
    date: Date;
    events: Event[];
    element: DOMRect;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const calendarRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<{ data: CalendarData }>({
    queryKey: ["calendar-data", selectedMonth, selectedYear],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/overview/rental-calendar?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data;
    },
  });

  // Calculate tooltip position
  useEffect(() => {
    if (hoveredDate && tooltipRef.current) {
      const calendarRect = calendarRef.current?.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let left = hoveredDate.element.left;
      let top = hoveredDate.element.bottom + 8;

      // Adjust horizontal position to prevent overflow
      if (left + tooltipRect.width > window.innerWidth - 20) {
        left = window.innerWidth - tooltipRect.width - 20;
      }

      // Adjust vertical position to prevent overflow
      if (top + tooltipRect.height > window.innerHeight - 20) {
        top = hoveredDate.element.top - tooltipRect.height - 8;
      }

      setTooltipPosition({ top, left });
    }
  }, [hoveredDate]);

  // Get unique dress names for filter
  const dressNames = useMemo(() => {
    if (!data?.data?.events) return [];
    const names = data.data.events.map((event) => event.dressName);
    return ["All", ...Array.from(new Set(names))];
  }, [data?.data?.events]);

  // Filter events based on selected dress
  const filteredEvents = useMemo(() => {
    if (!data?.data?.events) return [];
    if (selectedDress === "All") return data.data.events;
    return data.data.events.filter(
      (event) => event.dressName === selectedDress
    );
  }, [data?.data?.events, selectedDress]);

  // Generate calendar days dynamically based on the month and year from API
  const calendarDays = useMemo(() => {
    if (!data?.data) return [];

    const { month, year } = data.data;

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const lastDayOfPrevMonth = new Date(year, month - 1, 0).getDate();

    const days = [];

    // Add days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: lastDayOfPrevMonth - i,
        month: "prev" as const,
        date: new Date(year, month - 2, lastDayOfPrevMonth - i),
        events: [],
      });
    }

    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(year, month - 1, day);
      const dateString = currentDate.toISOString().split("T")[0];

      const dayEvents = filteredEvents.filter((event) => {
        const eventStartDate = new Date(event.rentalStartDate)
          .toISOString()
          .split("T")[0];
        const eventEndDate = new Date(event.rentalEndDate)
          .toISOString()
          .split("T")[0];
        return dateString >= eventStartDate && dateString <= eventEndDate;
      });

      days.push({
        day,
        month: "current" as const,
        date: currentDate,
        events: dayEvents,
      });
    }

    // Add days from next month to complete the grid
    const totalCells = 42;
    const remainingCells = totalCells - days.length;

    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        month: "next" as const,
        date: new Date(year, month, day),
        events: [],
      });
    }

    return days;
  }, [data?.data, filteredEvents]);

  // Get month name from month number
  const getMonthName = (monthNumber: number) => {
    return new Date(2000, monthNumber - 1, 1).toLocaleString("default", {
      month: "long",
    });
  };

  // Generate year options (current year -2 to +2)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, []);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle date hover
  const handleDateHover = (
    date: { date: Date; events: Event[] },
    event: React.MouseEvent
  ) => {
    const elementRect = event.currentTarget.getBoundingClientRect();
    setHoveredDate({ ...date, element: elementRect });
  };

  // Handle mouse leave from calendar area
  const handleCalendarMouseLeave = (event: React.MouseEvent) => {
    if (!tooltipRef.current?.contains(event.relatedTarget as Node)) {
      setHoveredDate(null);
    }
  };

  // Calendar Skeleton Component
  const CalendarSkeleton = () => (
    <div className="lg:col-span-2 bg-white p-6 rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="h-7 w-40 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="flex flex-wrap gap-2">
          {/* Dress Filter Skeleton */}
          <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          {/* Month Filter Skeleton */}
          <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          {/* Year Filter Skeleton */}
          <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Calendar Header Skeleton */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="text-center py-2">
            <div className="h-4 bg-gray-200 rounded mx-auto w-12 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[80px] p-2 border border-gray-100 rounded-lg bg-gray-50 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-6 mb-2"></div>
            <div className="flex justify-center">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center space-x-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div
      ref={calendarRef}
      className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A] relative"
      onMouseLeave={handleCalendarMouseLeave}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {data?.data
            ? `${getMonthName(data.data.month)} ${data.data.year}`
            : "Calendar"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {/* Dress Filter */}
          <div className="relative group">
            <button className="px-4 py-2 bg-[#891d33] text-white rounded-md flex items-center text-sm hover:bg-[#6a1526] transition-colors">
              {selectedDress === "All" ? "Dresses" : selectedDress}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {dressNames.map((dress) => (
                <button
                  key={dress}
                  onClick={() => setSelectedDress(dress)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md text-sm ${selectedDress === dress
                    ? "bg-gray-50 text-[#891d33] font-medium"
                    : "text-gray-700"
                    }`}
                >
                  {dress}
                </button>
              ))}
            </div>
          </div>

          {/* Month Filter */}
          <div className="relative group">
            <button className="px-4 py-2 bg-[#891d33] text-white rounded-md flex items-center text-sm hover:bg-[#6a1526] transition-colors">
              Month
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md text-sm ${selectedMonth === month
                    ? "bg-gray-50 text-[#891d33] font-medium"
                    : "text-gray-700"
                    }`}
                >
                  {getMonthName(month)}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          <div className="relative group">
            <button className="px-4 py-2 bg-[#891d33] text-white rounded-md flex items-center text-sm hover:bg-[#6a1526] transition-colors">
              Year
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {yearOptions.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md text-sm ${selectedYear === year
                    ? "bg-gray-50 text-[#891d33] font-medium"
                    : "text-gray-700"
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="max-w-full overflow-x-auto pb-4 -mb-4 scrollbar-hide">
        <div className="grid grid-cols-7 gap-1 mb-4 min-w-[600px] md:min-w-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-600 text-sm py-2"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((date, index) => (
            <div
              key={index}
              className={`min-h-[80px] p-2 border border-gray-100 rounded-lg transition-all duration-200 ${date.month !== "current"
                ? "bg-gray-50 text-gray-400"
                : "bg-white hover:bg-gray-50 hover:shadow-sm cursor-pointer"
                } ${date.events.length > 0 ? "border-l-4 border-l-[#891d33]" : ""}`}
              onMouseEnter={(e) => handleDateHover(date, e)}
            >
              <div
                className={`text-sm font-medium mb-1 ${date.month === "current" ? "text-gray-900" : "text-gray-400"
                  }`}
              >
                {date.day}
              </div>

              {/* Event Count Badge */}
              {date.events.length > 0 && (
                <div className="flex justify-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-[#891d33] text-white rounded-full min-w-[20px]">
                    {date.events.length}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Tooltip - Fixed Position */}
      {hoveredDate && hoveredDate.events.length > 0 && (
        <div
          ref={tooltipRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-sm transition-opacity duration-200"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          onMouseEnter={() => setHoveredDate(hoveredDate)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <div className="p-4">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">
              {formatDate(hoveredDate.date)}
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {hoveredDate.events.map((event) => (
                <div
                  key={event.bookingId}
                  className="text-sm border-l-4 border-l-[#891d33] pl-3 pb-2 last:pb-0"
                >
                  <div className="font-medium text-gray-900 mb-1">
                    {event.dressName}
                  </div>
                  <div className="text-gray-600 text-xs mb-1">
                    Customer: {event.customer}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">
                      {new Date(event.rentalStartDate).toLocaleDateString()} -{" "}
                      {new Date(event.rentalEndDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip arrow */}
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#891d33] rounded-sm"></div>
            <span className="text-gray-600">Bookings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span className="text-gray-600">Paid</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
            <span className="text-gray-600">Pending</span>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Total: {filteredEvents.length} bookings
        </div>
      </div>
    </div>
  );
};

export default Calendar;
