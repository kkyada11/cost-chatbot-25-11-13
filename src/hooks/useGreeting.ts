/**
 * useGreeting - 우선순위 기반 인사말 선택 훅
 */

import { useMemo } from "react";
import { GREETINGS } from "@/constants/greetings";
import { getGreeting } from "@/lib/greetingUtils";
import type { GreetingResult } from "@/types/greeting";

export function useGreeting(): GreetingResult | null {
  const greeting = useMemo(() => {
    return getGreeting(GREETINGS);
  }, []);

  return greeting;
}
