import { useState } from "react";
import { ChevronLeft, ChevronRight, HelpCircle, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, format, isSameMonth, isToday, isSameDay } from "date-fns";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMM d";
  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold min-w-[180px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Week
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-lg border overflow-hidden">
        {/* Day Names Header */}
        <div className="grid grid-cols-7 border-b">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="p-4 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);

            return (
              <div
                key={idx}
                className={`min-h-[120px] p-3 border-r border-b last:border-r-0 ${
                  isTodayDate ? "bg-primary/10" : ""
                } ${!isCurrentMonth ? "bg-muted/30" : ""}`}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-sm mb-2 ${
                      !isCurrentMonth ? "text-muted-foreground" : ""
                    } ${isTodayDate ? "font-semibold text-primary" : ""}`}
                  >
                    {format(day, dateFormat)}
                  </span>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">No posts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
