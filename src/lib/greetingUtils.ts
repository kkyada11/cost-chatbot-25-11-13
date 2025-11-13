/**
 * 인사말 시스템 유틸리티
 */

import type { GreetingData, GreetingResult, Weekday } from "@/types/greeting";
import { HOLIDAYS, ANNIVERSARIES, PAY_DAY } from "@/constants/greetings";

export function isPayday(date: Date): boolean {
  return date.getDate() === PAY_DAY;
}

export function isHoliday(date: Date): boolean {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${month}-${day}`;
  return HOLIDAYS.includes(dateString);
}

export function isHolidayEve(date: Date): boolean {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isHoliday(tomorrow);
}

export function isAnniversary(date: Date): boolean {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${month}-${day}`;
  return ANNIVERSARIES.includes(dateString);
}

export function getWeekday(date: Date): Weekday {
  return date.getDay() as Weekday;
}

export function getHour(date: Date): number {
  return date.getHours();
}

export function isInTimeRange(hour: number, range: [number, number]): boolean {
  const [start, end] = range;
  if (start < end) {
    return hour >= start && hour < end;
  }
  // Handle overnight range (e.g., 22-06)
  return hour >= start || hour < end;
}

export function filterMatchingGreetings(
  greetings: GreetingData[],
  date: Date = new Date()
): GreetingData[] {
  const weekday = getWeekday(date);
  const hour = getHour(date);

  return greetings.filter((greeting) => {
    const { condition } = greeting;

    // Check event conditions (priority 3)
    if (condition.isPayday && !isPayday(date)) return false;
    if (condition.isHoliday && !isHoliday(date)) return false;
    if (condition.isHolidayEve && !isHolidayEve(date)) return false;
    if (condition.isAnniversary && !isAnniversary(date)) return false;

    // Check weekday condition
    if (condition.weekdays && !condition.weekdays.includes(weekday)) return false;

    // Check time range condition
    if (condition.timeRange && !isInTimeRange(hour, condition.timeRange)) return false;

    return true;
  });
}

export function selectRandomGreeting(greetings: GreetingData[]): GreetingResult | null {
  if (greetings.length === 0) return null;

  // Find highest priority
  const maxPriority = Math.max(...greetings.map((g) => g.condition.priority));

  // Filter by highest priority
  const highestPriorityGreetings = greetings.filter(
    (g) => g.condition.priority === maxPriority
  );

  // Random selection
  const randomIndex = Math.floor(Math.random() * highestPriorityGreetings.length);
  const selected = highestPriorityGreetings[randomIndex];

  return {
    message: selected.message,
    subMessage: selected.subMessage,
    priority: selected.condition.priority,
  };
}

export function getGreeting(greetings: GreetingData[], date?: Date): GreetingResult | null {
  const matching = filterMatchingGreetings(greetings, date);
  return selectRandomGreeting(matching);
}
