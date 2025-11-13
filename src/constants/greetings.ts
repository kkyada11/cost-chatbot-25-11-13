/**
 * 인사말 데이터 정의
 */

import type { GreetingData } from "@/types/greeting";

export const PAY_DAY = 25;

export const HOLIDAYS = [
  "01-01", // 신정
  "03-01", // 삼일절
  "05-05", // 어린이날
  "06-06", // 현충일
  "08-15", // 광복절
  "10-03", // 개천절
  "10-09", // 한글날
  "12-25", // 크리스마스
];

export const ANNIVERSARIES: string[] = [
  // 회사 기념일 (예시)
  // "03-15", // 회사 창립일
];

export const GREETINGS: GreetingData[] = [
  // Priority 3 - 이벤트 (최우선)
  {
    message: "급여일입니다 💳",
    subMessage: "오늘도 수고 많으셨습니다!",
    condition: {
      priority: 3,
      isPayday: true,
    },
  },
  {
    message: "내일은 공휴일이네요 🎉",
    subMessage: "편안한 휴일 되세요!",
    condition: {
      priority: 3,
      isHolidayEve: true,
    },
  },
  {
    message: "즐거운 공휴일 보내세요 🎊",
    subMessage: "오늘은 쉬는 날입니다!",
    condition: {
      priority: 3,
      isHoliday: true,
    },
  },
  {
    message: "회사 창립 기념일입니다 🎂",
    subMessage: "함께 축하해요!",
    condition: {
      priority: 3,
      isAnniversary: true,
    },
  },

  // Priority 1 - 요일
  {
    message: "새로운 한 주의 시작 🌱",
    subMessage: "월요일, 힘차게 시작해봐요!",
    condition: {
      priority: 1,
      weekdays: [1],
    },
  },
  {
    message: "화요일 🚀",
    subMessage: "이번 주도 화이팅!",
    condition: {
      priority: 1,
      weekdays: [2],
    },
  },
  {
    message: "수요일! 🏞️",
    subMessage: "벌써 한 주의 중간입니다!",
    condition: {
      priority: 1,
      weekdays: [3],
    },
  },
  {
    message: "목요일 💡",
    subMessage: "주말이 코앞입니다!",
    condition: {
      priority: 1,
      weekdays: [4],
    },
  },
  {
    message: "불금 🎉",
    subMessage: "즐거운 금요일 되세요!",
    condition: {
      priority: 1,
      weekdays: [5],
    },
  },
  {
    message: "주말에 접속하셨네요 🌸",
    subMessage: "좋은 주말 보내세요!",
    condition: {
      priority: 1,
      weekdays: [0, 6],
    },
  },

  // Priority 1 - 시간대
  {
    message: "좋은 아침입니다 ☀️",
    subMessage: "상쾌한 하루 시작하세요!",
    condition: {
      priority: 1,
      timeRange: [6, 9],
    },
  },
  {
    message: "업무 시작! 💪",
    subMessage: "오늘도 화이팅!",
    condition: {
      priority: 1,
      timeRange: [9, 12],
    },
  },
  {
    message: "점심시간 🍲",
    subMessage: "맛있는 점심 드세요!",
    condition: {
      priority: 1,
      timeRange: [12, 13],
    },
  },
  {
    message: "오후에도 화이팅 ✨",
    subMessage: "조금만 더 힘내세요!",
    condition: {
      priority: 1,
      timeRange: [13, 18],
    },
  },
  {
    message: "오늘도 수고 많으셨습니다 🌙",
    subMessage: "편안한 저녁 되세요!",
    condition: {
      priority: 1,
      timeRange: [18, 20],
    },
  },
  {
    message: "늦은 시간까지 고생하시네요 🌌",
    subMessage: "건강 챙기세요!",
    condition: {
      priority: 1,
      timeRange: [20, 24],
    },
  },
  {
    message: "새벽까지 고생하시네요 🌃",
    subMessage: "충분한 휴식 취하세요!",
    condition: {
      priority: 1,
      timeRange: [0, 6],
    },
  },

  // Priority 0 - 기본
  {
    message: "사우님, 무엇을 도와드릴까요?",
    subMessage: "경비 청구 관련 질문을 해주세요!",
    condition: {
      priority: 0,
    },
  },
];
