# IndexedDB Schema Documentation

## 개요

이 프로젝트는 Dexie.js를 사용하여 IndexedDB를 관리합니다.
오프라인 지원 및 대화 히스토리 영속성을 제공합니다.

## 데이터베이스 정보

- **데이터베이스 이름**: `CostChatbotDB`
- **현재 버전**: 5
- **라이브러리**: Dexie.js v4.x

## 테이블 스키마

### 1. conversations 테이블

대화(Conversation) 목록을 저장합니다.

**필드:**

| 필드명 | 타입 | 설명 | 인덱스 |
|--------|------|------|--------|
| id | string | 대화 고유 ID (Primary Key) | ✅ |
| title | string | 대화 제목 | ❌ |
| timestamp | string | 생성 시간 (ISO 8601 형식) | ✅ |
| firstMessage | string? | 첫 메시지 내용 (선택) | ❌ |

**인덱스:**
```typescript
"id, timestamp"
```

**TypeScript 타입:**
```typescript
interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  firstMessage?: string;
}
```

### 2. messages 테이블

각 대화의 메시지들을 저장합니다.

**필드:**

| 필드명 | 타입 | 설명 | 인덱스 |
|--------|------|------|--------|
| id | string | 메시지 고유 ID (Primary Key) | ✅ |
| conversationId | string | 소속 대화 ID | ✅ |
| role | "user" \| "assistant" | 메시지 역할 | ❌ |
| content | string | 메시지 내용 | ❌ |
| timestamp | string | 생성 시간 (ISO 8601 형식) | ✅ |
| order | number | 메시지 순서 (cursor 기반 페이지네이션용) | ✅ |
| animationStatus | "idle" \| "typing" \| "complete" | 타이핑 애니메이션 상태 | ❌ |
| feedback | "good" \| "bad" \| null | 사용자 피드백 (좋아요/싫어요) | ❌ |
| isOptimistic | boolean | 낙관적 업데이트 메시지 여부 | ❌ |
| relatedQuestions | string[]? | AI 추천 질문 목록 (assistant만) | ❌ |

**인덱스:**
```typescript
"id, conversationId, timestamp, order, [conversationId+order]"
```

**TypeScript 타입:**
```typescript
interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  order: number;
  animationStatus?: "idle" | "typing" | "complete";
  feedback?: "good" | "bad" | null;
  isOptimistic?: boolean;
  relatedQuestions?: string[];
}
```

## 버전 히스토리

### Version 5 (현재)
- `messages` 테이블에 `order` 필드 추가
- `[conversationId+order]` 복합 인덱스 추가
- 무한 스크롤 cursor 기반 페이지네이션 지원

### Version 4
- `messages` 테이블에 `feedback` 필드 추가
- 사용자 피드백 기능 (좋아요/싫어요)

### Version 3
- `messages` 테이블에 `isOptimistic` 필드 추가
- 낙관적 업데이트 지원

### Version 2
- `messages` 테이블에 `animationStatus` 필드 추가
- 타이핑 애니메이션 상태 관리

### Version 1 (초기)
- `conversations` 테이블 생성
- `messages` 테이블 생성
- 기본 인덱스 설정

## 마이그레이션 전략

Dexie는 자동 마이그레이션을 지원합니다:

1. **필드 추가**: 기존 데이터는 유지되며, 새 필드는 `undefined`로 초기화
2. **인덱스 추가**: 기존 데이터에 대해 자동으로 인덱스 생성
3. **데이터 변환**: 필요시 `.upgrade()` 함수로 수동 마이그레이션

## 쿼리 패턴

### 1. 대화 목록 조회 (최신순)
```typescript
db.conversations.orderBy('timestamp').reverse().toArray();
```

### 2. 특정 대화의 메시지 조회
```typescript
db.messages
  .where('conversationId')
  .equals(conversationId)
  .sortBy('order');
```

### 3. 무한 스크롤 (cursor 기반)
```typescript
db.messages
  .where('[conversationId+order]')
  .between([conversationId, Dexie.minKey], [conversationId, cursor])
  .reverse()
  .limit(20)
  .toArray();
```

### 4. 낙관적 메시지 제거
```typescript
db.messages
  .where('conversationId')
  .equals(conversationId)
  .and(msg => msg.isOptimistic === true)
  .delete();
```

## 용량 관리

- **예상 용량**: 대화 100개 기준 약 5-10MB
- **브라우저 제한**: Chrome/Edge는 사용 가능한 디스크의 60%까지 허용
- **정리 전략**: 향후 오래된 대화 자동 아카이빙 고려

## 보안 고려사항

- IndexedDB는 same-origin policy 적용
- 민감한 정보(비밀번호 등)는 저장하지 않음
- 사용자가 브라우저 데이터 삭제 시 모두 제거됨

## 참고 자료

- [Dexie.js 공식 문서](https://dexie.org/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
