/**
 * 인사말 시스템 관련 타입 정의
 */

export type TimeRange = [number, number];

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface GreetingCondition {
  priority: number;
  timeRange?: TimeRange;
  weekdays?: Weekday[];
  isPayday?: boolean;
  isHoliday?: boolean;
  isHolidayEve?: boolean;
  isAnniversary?: boolean;
}

export interface GreetingData {
  message: string;
  subMessage?: string;
  condition: GreetingCondition;
}

export interface GreetingResult {
  message: string;
  subMessage?: string;
  priority: number;
}
