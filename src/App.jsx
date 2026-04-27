import { useMemo, useState } from "react";
import { entries, defaultDate } from "./data.js";

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const WEEKDAY_LABELS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function isoDate(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

// Build a 6x7 grid (Mon-Sun weeks) for the given month.
function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  // getDay(): 0 = Sun..6 = Sat; convert to Mon=0..Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function Calendar({ year, month, selectedDate, onSelect, onPrev, onNext, onArchive }) {
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const monthLabel = MONTH_NAMES[month];

  return (
    <div className="bg-white border border-black/80 text-black w-full h-full flex flex-col">
      {/* Header controls */}
      <div className="grid grid-cols-4 border-b border-black/80 text-[11px] uppercase tracking-wide">
        <button
          type="button"
          onClick={onArchive}
          className="px-3 py-2 text-left hover:bg-black hover:text-white transition-colors"
        >
          archive
        </button>
        <div className="px-3 py-2 text-center font-semibold">{year}</div>
        <div className="px-3 py-2 text-center">{monthLabel}</div>
        <button
          type="button"
          onClick={onNext}
          className="px-3 py-2 text-right hover:bg-black hover:text-white transition-colors"
        >
          next month
        </button>
      </div>

      {/* Optional prev row hidden visually but keep accessibility */}
      <button
        type="button"
        onClick={onPrev}
        className="sr-only"
        aria-label="previous month"
      >
        previous month
      </button>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-black/40 text-[10px] uppercase tracking-wide">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="px-1 py-1 text-center text-black/60">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 flex-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="border-t border-l border-black/20" />;
          }
          const date = isoDate(year, month, day);
          const isSelected = date === selectedDate;
          const hasEntry = Boolean(entries[date]);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(date)}
              className={[
                "border-t border-l border-black/20 text-sm flex items-center justify-center",
                "hover:bg-black hover:text-white transition-colors",
                isSelected ? "bg-red-600 text-white hover:bg-red-600" : "",
                hasEntry && !isSelected ? "font-semibold underline underline-offset-2" : "",
              ].join(" ")}
              aria-pressed={isSelected}
              aria-label={date}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  // Calendar viewport (independent of selection so users can browse months).
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(3); // April (0-indexed)

  const entry = entries[selectedDate] ?? entries[defaultDate];

  function handleSelect(date) {
    if (entries[date]) setSelectedDate(date);
    // For dates without dummy data, do nothing (could fall through to a default).
  }

  function handlePrevMonth() {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function handleNextMonth() {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function handleArchive() {
    // "archive" jumps to the earliest entry month.
    const dates = Object.keys(entries).sort();
    if (dates.length === 0) return;
    const [y, m] = dates[0].split("-").map(Number);
    setViewYear(y);
    setViewMonth(m - 1);
    setSelectedDate(dates[0]);
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white text-black">
      {/*
        Layout grid (matches the wireframe):
        - 2 rows: top media row (~58vh), bottom row (~42vh) for calendar + text.
        - Top row: 2/3 video frame (16:9) + 1/3 image.
        - Bottom row: ~40% calendar + ~60% text (logo header on top of right column).
      */}
      <div
        className="h-full w-full grid gap-px bg-black/80"
        style={{
          gridTemplateColumns: "2fr 1fr",
          gridTemplateRows: "minmax(0, 58fr) minmax(0, 42fr)",
        }}
      >
        {/* TOP LEFT: 16:9 video frame inside a black surround. */}
        <div className="bg-black flex items-center justify-center overflow-hidden">
          <div
            className="relative bg-red-600 w-full"
            style={{ aspectRatio: "16 / 9", maxHeight: "100%" }}
          >
            {entry.video ? (
              <video
                key={entry.video}
                src={entry.video}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            ) : null}
            <div className="absolute left-3 top-3 text-black/70 text-xs uppercase tracking-widest pointer-events-none">
              16x9 videoframe
            </div>
          </div>
        </div>

        {/* TOP RIGHT: image frame. */}
        <div className="bg-black flex items-center justify-center overflow-hidden">
          {entry.image ? (
            <img
              key={entry.image}
              src={entry.image}
              alt={entry.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-white text-3xl tracking-widest">IMAGE</div>
          )}
        </div>

        {/* BOTTOM LEFT: calendar (taking the whole bottom-left cell). */}
        <div className="bg-white p-4 flex items-center justify-center overflow-hidden">
          <div className="h-full w-full max-w-xl">
            <Calendar
              year={viewYear}
              month={viewMonth}
              selectedDate={selectedDate}
              onSelect={handleSelect}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
              onArchive={handleArchive}
            />
          </div>
        </div>

        {/* BOTTOM RIGHT: logo header + two-column rich text. */}
        <div className="bg-white flex flex-col overflow-hidden">
          <div className="border-b border-black/80 px-4 py-2">
            <div className="text-2xl font-semibold tracking-tight">Logo</div>
          </div>
          <div className="flex-1 px-4 py-3 overflow-hidden">
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: entry.html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
