# Src Directory - 애플리케이션 핵심 로직

이 디렉토리는 React 컴포넌트, 커스텀 훅, 상태 관리, 유틸리티 등 애플리케이션의 핵심 로직을 포함합니다.

## 디렉토리 구조

```
src/
├── components/              # Presentational Components
│   ├── chat/                # 채팅 UI 컴포넌트
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── ModelSelector.tsx # AI 모델 선택기
│   │   ├── TypingIndicator.tsx
│   │   ├── SuggestedQuestions.tsx
│   │   ├── VoiceInputButton.tsx
│   │   ├── Greeting.tsx     # 우선순위 기반 인사말
│   │   ├── EmptyState.tsx   # 초기 화면 (Greeting 사용)
│   │   └── HomePageContent.tsx
│   ├── wiki/                # Wiki UI 컴포넌트
│   │   ├── WikiDialog.tsx
│   │   ├── SpaceExample.tsx
│   │   ├── ApiTestPage.tsx
│   │   └── WikiExample.tsx  # Wiki 예제 컴포넌트
│   ├── layout/              # 레이아웃 UI 컴포넌트
│   │   ├── SidebarPresentation.tsx
│   │   ├── Header.tsx
│   │   ├── ConversationList.tsx
│   │   └── LoadingGate.tsx  # 로딩 게이트 (초기화 완료 대기)
│   ├── electron/            # Electron 전용 컴포넌트
│   │   └── ElectronTitleBar.tsx # Electron 타이틀바
│   └── ui/                  # 공통 UI 컴포넌트
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Dialog.tsx
│       ├── Divider.tsx      # 구분선
│       ├── CustomMenu.tsx   # 커스텀 메뉴
│       ├── LoadingSpinner.tsx
│       ├── LoadingScreen.tsx # 전체 화면 로딩
│       ├── ImageLoadingSpinner.tsx # 이미지 로딩 스피너
│       ├── ThemeToggle.tsx  # 다크모드 토글 버튼
│       ├── Toast.tsx        # 토스트 알림
│       └── ToastContainer.tsx # 토스트 컨테이너
├── containers/              # Container Components
│   ├── ChatContainer.tsx
│   └── SidebarContainer.tsx
├── hooks/                   # Custom Hooks
│   ├── useChat.ts
│   ├── useConversations.ts
│   ├── useInfiniteChatMessages.ts # 무한 스크롤 메시지 로딩
│   ├── useTypedAnimation.ts # 타이핑 애니메이션
│   ├── useAnimationCallbacks.ts
│   ├── useSpeechRecognition.ts
│   ├── useGreeting.ts       # 우선순위 기반 인사말 선택
│   └── useToast.ts          # 토스트 알림 관리
├── factories/               # Factory Pattern (객체 생성)
│   ├── MessageFactory.ts
│   ├── ConversationFactory.ts
│   └── index.ts
├── repositories/            # Repository Pattern (데이터 접근)
│   ├── MessageRepository.ts
│   ├── ConversationRepository.ts
│   └── index.ts
├── services/                # Service Layer (비즈니스 로직)
│   ├── MessageService.ts
│   ├── ConversationService.ts
│   └── index.ts
├── stores/                  # Zustand Stores (Flux Pattern)
│   ├── chatStore.ts
│   ├── suggestionsStore.ts
│   ├── toastStore.ts        # 토스트 알림 상태 관리
│   └── types/
│       ├── chatTypes.ts
│       └── suggestionsTypes.ts
├── lib/                     # Utilities & Configuration
│   ├── api.ts              # Axios 설정
│   ├── dexie.ts            # IndexedDB 설정
│   ├── wikiApi.ts          # Confluence Wiki API
│   ├── AnimationManager.ts # 애니메이션 관리
│   ├── greetingUtils.ts    # 인사말 조건 평가 유틸리티
│   ├── logger.ts           # 로깅 유틸리티
│   ├── devUtils.ts         # 개발 유틸리티
│   ├── utils.ts            # 공통 함수
│   └── constants.ts        # 상수 정의
├── assets/                  # 정적 자산
│   └── icon/               # 아이콘 TSX 컴포넌트
├── constants/               # 상수 데이터
│   └── greetings.ts        # 인사말 데이터 (22개 인사말)
└── types/                   # TypeScript 타입 정의
    ├── ai.ts                # AI 모델 타입
    ├── api.ts
    ├── chat.ts
    ├── database.ts
    ├── electron.d.ts        # Electron 타입 정의
    ├── voice.ts
    ├── greeting.ts          # 인사말 타입
    ├── factory.ts           # Factory 타입
    ├── repository.ts        # Repository 타입
    └── service.ts           # Service 타입
```

## 아키텍처 패턴

### 1. Container & Presentational Pattern

#### Container Components (로직)
- **역할**: 데이터 로직, 상태 관리, 이벤트 핸들러
- **위치**: `src/containers/`
- **특징**:
  - 커스텀 훅 사용
  - Zustand store 연결
  - 비즈니스 로직 처리
  - Presentational 컴포넌트에 props 전달

#### Presentational Components (UI)
- **역할**: UI 렌더링, 스타일링
- **위치**: `src/components/`
- **특징**:
  - props를 통해 데이터 받음
  - 상태 관리 최소화
  - 재사용 가능한 UI 컴포넌트

### 2. Factory Pattern (객체 생성 표준화)

#### 목적
- 객체 생성 로직을 중앙화하여 일관성 유지
- ID 생성, 타임스탬프, order 등 생성 로직 표준화
- 중복 코드 제거 및 유지보수성 향상

#### 구조
- **위치**: `src/factories/`
- **파일**: MessageFactory.ts, ConversationFactory.ts

#### 주요 기능

**MessageFactory**:
```typescript
// User 메시지 생성
createUserMessage(options: CreateUserMessageOptions): Message

// Assistant 메시지 생성
createAssistantMessage(options: CreateAssistantMessageOptions): Message

// 낙관적 메시지 생성 (즉시 UI 반영용)
createOptimisticMessage(options: CreateOptimisticMessageOptions): Message

// 메시지 쌍 생성 (User + Assistant)
createMessagePair(options: CreateMessagePairOptions): MessagePair
```

**ConversationFactory**:
```typescript
// 새 대화 생성
createConversation(firstMessage?: string): Conversation
```

#### 사용 예시
```typescript
// Factory를 사용한 메시지 생성
const message = messageFactory.createUserMessage({
  conversationId: "conv-123",
  content: "안녕하세요",
});

// 메시지 쌍 생성
const { userMessage, aiMessage } = messageFactory.createMessagePair({
  userContent: "질문",
  aiContent: "답변",
  conversationId: "conv-123",
});
```

### 3. Repository Pattern (데이터 접근 계층)

#### 목적
- DB 접근 로직을 중앙화하여 관심사 분리
- Dexie IndexedDB를 래핑하여 타입 안정성 제공
- 에러 핸들링 및 로깅 표준화
- 타입 캐스팅 제거 (DB 타입 → Domain 타입 자동 변환)

#### 구조
- **위치**: `src/repositories/`
- **파일**: MessageRepository.ts, ConversationRepository.ts

#### 주요 기능

**MessageRepository**:
```typescript
// 메시지 저장
save(message: Message): Promise<Message>

// ID로 메시지 조회
findById(id: string): Promise<Message | null>

// 대화 ID로 메시지 목록 조회
findByConversationId(conversationId: string): Promise<Message[]>

// 메시지 업데이트
update(id: string, updates: Partial<Message>): Promise<void>

// 애니메이션 상태 업데이트
updateAnimationStatus(id: string, status: AnimationStatus): Promise<void>

// 피드백 업데이트 (좋아요/싫어요)
updateFeedback(id: string, feedback: "good" | "bad" | null): Promise<void>

// 메시지 삭제
delete(id: string): Promise<void>

// 낙관적 메시지 제거
removeOptimistic(conversationId: string): Promise<void>
```

**ConversationRepository**:
```typescript
// 대화 저장
save(conversation: Conversation): Promise<Conversation>

// ID로 대화 조회
findById(id: string): Promise<Conversation | null>

// 모든 대화 조회 (최신순)
findAll(): Promise<Conversation[]>

// 대화 업데이트
update(id: string, updates: Partial<Conversation>): Promise<void>

// 대화 삭제
delete(id: string): Promise<void>
```

#### 사용 예시
```typescript
// Repository를 사용한 DB 접근
const message = await messageRepository.findById("msg-123");
await messageRepository.save(newMessage);

// 대화 메시지 조회
const messages = await messageRepository.findByConversationId("conv-123");
```

### 4. Service Layer (비즈니스 로직)

#### 목적
- 비즈니스 로직을 캡슐화하여 Hook 단순화
- Repository와 Factory를 조합하여 복잡한 작업 수행
- Store와 DB 동기화 로직 중앙화
- 재사용 가능한 비즈니스 로직 제공

#### 구조
- **위치**: `src/services/`
- **파일**: MessageService.ts, ConversationService.ts

#### 주요 기능

**MessageService**:
```typescript
// 메시지를 DB에 저장하고 Store와 동기화
saveMessageWithSync(message: Message): Promise<void>

// User + AI 메시지 쌍 생성 (Factory 위임)
createMessagePair(options: CreateMessagePairOptions): MessagePair

// 낙관적 메시지 제거 (Store 동기화)
removeOptimisticMessages(conversationId: string): void
```

**ConversationService**:
```typescript
// 대화를 DB에 저장하고 Store와 동기화
saveConversationWithSync(conversation: Conversation): Promise<void>

// 새 대화 생성 (Factory 위임)
createConversation(firstMessage?: string): Conversation

// 대화 목록 조회 (Repository 위임)
getConversations(): Promise<Conversation[]>
```

#### 의존성 주입
Service는 Store Actions를 의존성 주입으로 받아서 순환 참조를 방지합니다:

```typescript
// Store에서 Service Actions 설정
messageService.setStoreActions({
  removeOptimisticMessagesAction,
});
```

#### 사용 예시
```typescript
// Service를 사용한 비즈니스 로직
const { userMessage, aiMessage } = messageService.createMessagePair({
  userContent: "질문",
  aiContent: "답변",
  conversationId: "conv-123",
});

await messageService.saveMessageWithSync(userMessage);
```

### 5. Flux Pattern (Zustand Store)

**구현 상태**: chatStore.ts에 18개 액션 구현 완료

#### 특징
- 단방향 데이터 플로우
- 낙관적 업데이트
- IndexedDB 동기화
- Immer 미들웨어 (불변성)

### Container 책임 분리 원칙

#### ✅ 올바른 패턴
```tsx
// ChatContainer: 메시지 표시 + 전송
function ChatContainer() {
  const { messages } = useChatStore();      // Store 구독
  const { sendMessage } = useChat();        // 메시지 전송
  return <ChatPresentation />;
}

// SidebarContainer: 대화 목록 관리
function SidebarContainer() {
  const { conversations } = useConversations();  // 대화 목록
  const { setCurrentConversation } = useChatStore();
  return <SidebarPresentation />;
}
```

#### ❌ 피해야 할 패턴
```tsx
// ❌ 동일한 훅을 여러 Container에서 호출
function SidebarContainer() {
  const data = useConversations(); // ✅
}

function AnotherContainer() {
  const data = useConversations(); // ❌ 중복 호출
}

// ❌ 데이터 전달만을 위한 중간 Container
function MiddleContainer() {
  const data = useData();
  return <ChildContainer data={data} />; // 불필요
}
```

## 핵심 디렉토리 상세

### `components/` - Presentational Components

#### `chat/` - 채팅 컴포넌트
- **MessageList.tsx**: 메시지 목록 (무한 스크롤, Intersection Observer, 스크롤 위치 유지)
- **MessageBubble.tsx**: 개별 메시지 버블
  - `dangerouslySetInnerHTML` 사용 (HTML 렌더링)
  - **형광펜 효과**: `animationStatus === 'complete'` 시 "컴포넌트" 단어 자동 하이라이트
  - 타이핑 애니메이션, 복사, 좋아요/싫어요 피드백
- **MessageInput.tsx**: 메시지 입력창
- **ModelSelector.tsx**: AI 모델 선택 드롭다운 (Gemini, GPT 등)
- **TypingIndicator.tsx**: 타이핑 인디케이터
- **SuggestedQuestions.tsx**: 추천 질문
- **VoiceInputButton.tsx**: 음성 입력 버튼
- **Greeting.tsx**: 우선순위 기반 인사말 표시 (Presentational)
- **EmptyState.tsx**: 초기 화면 (Greeting 컴포넌트 사용)
- **HomePageContent.tsx**: 홈 페이지 메인 콘텐츠

#### `wiki/` - Wiki 컴포넌트
- **WikiDialog.tsx**: Wiki 페이지 선택 다이얼로그
- **SpaceExample.tsx**: Space 예제
- **ApiTestPage.tsx**: API 테스트 페이지
- **WikiExample.tsx**: Wiki 통합 예제 컴포넌트

#### `layout/` - 레이아웃 컴포넌트
- **SidebarPresentation.tsx**: 사이드바 UI
- **Header.tsx**: 헤더
- **ConversationList.tsx**: 대화 목록
  - 호버 시 삭제 버튼 표시 (빨간색 휴지통 아이콘)
  - `onDelete` 핸들러로 대화 삭제
- **LoadingGate.tsx**: 앱 초기화 완료 대기 게이트

#### `ui/` - 공통 UI 컴포넌트
- **Button.tsx**: 버튼 컴포넌트
- **Input.tsx**: 입력 컴포넌트
- **Dialog.tsx**: 모달 다이얼로그
- **Divider.tsx**: 구분선 컴포넌트
- **CustomMenu.tsx**: 커스텀 메뉴 (대화 옵션 등)
- **LoadingSpinner.tsx**: 로딩 스피너
- **LoadingScreen.tsx**: 전체 화면 로딩 컴포넌트
- **ImageLoadingSpinner.tsx**: 이미지 전용 로딩 스피너
- **ThemeToggle.tsx**: 다크모드 토글 버튼 (Light ↔ Dark)
- **Toast.tsx**: 토스트 알림 컴포넌트
- **ToastContainer.tsx**: 토스트 알림 컨테이너

### `containers/` - Container Components

- **ChatContainer.tsx**: 채팅 로직 (메시지 표시 + 전송)
- **SidebarContainer.tsx**: 사이드바 로직 (대화 목록 관리)

### `factories/` - Factory Pattern

#### MessageFactory.ts
- **역할**: Message 객체 생성 담당
- **기능**:
  - `createUserMessage`: User 메시지 생성
  - `createAssistantMessage`: Assistant 메시지 생성 (타이핑 애니메이션 포함)
  - `createOptimisticMessage`: 낙관적 메시지 생성 (즉시 UI 반영용)
  - `createMessagePair`: User + Assistant 메시지 쌍 생성

#### ConversationFactory.ts
- **역할**: Conversation 객체 생성 담당
- **기능**:
  - `createConversation`: 새 대화 생성 (ID, 타임스탬프, 첫 메시지)

### `repositories/` - Repository Pattern

#### MessageRepository.ts
- **역할**: 메시지 데이터 접근 계층
- **기능**:
  - `save`: 메시지 저장
  - `findById`: ID로 메시지 조회
  - `findByConversationId`: 대화 ID로 메시지 목록 조회
  - `findByConversationIdPaginated`: 페이지네이션된 메시지 조회 (무한 스크롤용)
  - `update`: 메시지 업데이트
  - `updateAnimationStatus`: 애니메이션 상태 업데이트
  - `delete`: 메시지 삭제
  - `removeOptimistic`: 낙관적 메시지 제거
  - `findAll`: 전체 메시지 조회 (개발용)
- **특징**: Dexie 래핑, 타입 변환, 에러 핸들링, Cursor 기반 페이지네이션

#### ConversationRepository.ts
- **역할**: 대화 데이터 접근 계층
- **기능**:
  - `save`: 대화 저장
  - `findById`: ID로 대화 조회
  - `findAll`: 모든 대화 조회 (최신순)
  - `update`: 대화 업데이트
  - `delete`: 대화 삭제
- **특징**: Dexie 래핑, 타입 변환, 에러 핸들링

### `services/` - Service Layer

#### MessageService.ts
- **역할**: 메시지 비즈니스 로직
- **기능**:
  - `saveMessageWithSync`: 메시지를 DB에 저장하고 Store와 동기화
  - `createMessagePair`: User + AI 메시지 쌍 생성 (Factory 위임)
  - `loadMessagesPaginated`: 페이지네이션된 메시지 목록 조회 (무한 스크롤용)
  - `removeOptimisticMessages`: 낙관적 메시지 제거 (Store 동기화)
- **특징**: Repository + Factory 조합, Store Actions 의존성 주입

#### ConversationService.ts
- **역할**: 대화 비즈니스 로직
- **기능**:
  - `saveConversationWithSync`: 대화를 DB에 저장하고 Store와 동기화
  - `createConversation`: 새 대화 생성 (Factory 위임)
  - `getConversations`: 대화 목록 조회 (Repository 위임)
- **특징**: Repository + Factory 조합, Hook 단순화

### `hooks/` - Custom Hooks

#### 채팅 관련
- **useChat.ts**: 메시지 전송 로직
- **useConversations.ts**: 대화 목록 관리
  - 대화 생성, 삭제, 제목 수정, 선택
  - **채팅 삭제**: 삭제 후 첫 번째 대화 자동 선택, 대화 없으면 새 대화 자동 생성
  - TanStack Query 기반 캐싱 및 낙관적 업데이트
- **useInfiniteChatMessages.ts**: 무한 스크롤 메시지 로딩 (20건 단위 페이지네이션)
  - TanStack Query의 `useInfiniteQuery` 사용
  - 카카오톡 스타일 역방향 로딩 (위로 스크롤 → 과거 메시지)
  - Cursor 기반 페이지네이션 (order 필드)
  - Store와 자동 동기화, 낙관적 메시지 병합
- **useTypedAnimation.ts**: 타이핑 애니메이션 (TypedJS 기반)
- **useAnimationCallbacks.ts**: 애니메이션 콜백

#### 기타
- **useSpeechRecognition.ts**: 음성 인식
- **useGreeting.ts**: 우선순위 기반 인사말 선택
- **useToast.ts**: 토스트 알림 관리

### `stores/` - Zustand Stores (Flux Pattern)

#### chatStore.ts
- **상태**: messages, conversations, UI state
- **액션**: Flux 패턴 (20개 액션 구현 완료)
  - sendMessageAction, receiveMessageAction
  - selectConversationAction, createConversationAction
  - updateMessageFeedbackAction (좋아요/싫어요)
  - setMessagesAction (무한 스크롤 결과 동기화)
  - removeOptimisticMessagesAction 등
- **미들웨어**: immer, devtools
- **특징**: 낙관적 업데이트, IndexedDB 동기화, Service Layer 통합

#### suggestionsStore.ts
- **상태**: suggestions (추천 질문)
- **액션**: setSuggestions, clearSuggestions
- **특징**: AI 추천 질문 관리

#### toastStore.ts
- **상태**: toasts (토스트 알림 배열)
- **액션**: addToast, removeToast, clearToasts
- **특징**: 토스트 알림 생명주기 관리

### `lib/` - Utilities

#### api.ts - Axios 설정
```typescript
// Python Chat AI 서버 (localhost:8000)
const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
});
```

#### dexie.ts - IndexedDB
- **버전 관리**: 3개 버전 스키마
- **테이블**: conversations, messages
- **기능**: 자동 마이그레이션, 중복 제거

#### wikiApi.ts - Confluence Wiki API
- **기능**: Confluence REST API 클라이언트
- **엔드포인트**: Spaces, Pages 조회

#### greetingUtils.ts - 인사말 유틸리티
- **조건 평가**: isPayday, isHoliday, isHolidayEve, isAnniversary
- **시간/요일**: getTimeCondition, getWeekdayCondition
- **필터링**: filterMatchingGreetings (현재 조건 매칭)
- **선택 로직**: selectRandomGreeting (우선순위 기반 랜덤)

#### logger.ts - 로깅
- **레벨**: dev, log, warn, error, store
- **환경**: 개발 환경에서만 출력
- **포맷**: 타임스탬프, 레벨, 색상

#### constants.ts - 상수
- API_CONFIG, CONVERSATION_CONFIG, UI_CONFIG 등 정의

### `constants/` - 상수 데이터

#### greetings.ts - 인사말 데이터
- **GREETINGS**: 22개 인사말 (우선순위: 3=이벤트, 1=요일/시간대, 0=기본)
- **HOLIDAYS**: 8개 공휴일 (MM-DD 형식)
- **ANNIVERSARIES**: 회사 기념일 목록
- **PAY_DAY**: 급여일 (기본값: 25)
- **참고**: 요일과 시간대는 동일 우선순위(1)로 랜덤 선택됨

### `types/` - TypeScript 타입

- **api.ts**: API 요청/응답 타입
- **chat.ts**: 채팅 관련 타입 (Message, Conversation, Theme)
  - `Theme`: `"light" | "dark"` (다크모드 테마 타입)
  - `Message.feedback`: `"good" | "bad" | null` (메시지 피드백)
- **database.ts**: IndexedDB 타입
- **voice.ts**: 음성 인식 타입
- **greeting.ts**: 인사말 타입 (GreetingCondition, GreetingData, GreetingResult, TimeRange)
- **factory.ts**: Factory 패턴 타입 (IMessageFactory, IConversationFactory)
- **repository.ts**: Repository 패턴 타입 (IRepository, RepositoryError)
- **service.ts**: Service Layer 타입 (IMessageService, IConversationService, ServiceError)

## 개발 가이드라인

### React Hooks 규칙
1. **의존성 배열**: 모든 의존성 명시
2. **선언 순서**: 의존성이 먼저 정의되어야 함
3. **중복 호출 방지**: 동일 훅을 여러 곳에서 호출 금지

### 타입 안정성
- **any 금지**: `unknown`, 구체적 타입 사용
- **함수 타입**: Call signature 대신 function type
- **타입 전용 import**: `import type` 사용

### 접근성 (a11y)
- **Semantic HTML**: 시맨틱 요소 우선
- **Role 지양**: 시맨틱 HTML로 대체 가능한 경우 role 사용 금지
- **키보드 지원**: 모든 인터랙션에 키보드 지원
- **ARIA 레이블**: 스크린 리더용 레이블

### 코드 품질
- **Biome**: 린팅 및 포맷팅
- **TypeScript**: strict mode
- **Container 패턴**: 로직과 UI 분리
- **Flux 패턴**: 단방향 데이터 플로우

## 주요 기능

### 채팅
- 메시지 전송/수신
- 타이핑 애니메이션
- 음성 입력
- 동적 인사말 (우선순위 기반)
- 메시지 피드백 (좋아요/싫어요)
- **형광펜 효과**: AI 메시지 내 키워드 하이라이트 (왼쪽→오른쪽 칠하기 애니메이션)
- **채팅 삭제**: 삭제 후 첫 번째 대화 자동 선택 또는 새 대화 자동 생성

### Wiki 통합
- Confluence 페이지 검색
- Space 브라우징
- PDF 다운로드

### 데이터 관리
- Zustand (전역 상태)
- IndexedDB (오프라인 지원)
- TanStack Query (서버 상태)

### 다크모드
- Light/Dark 테마 전환
- chatStore 상태 관리 (`ui.theme`)
- Tailwind CSS `class` 전략
- localStorage 영속성
- ThemeToggle 컴포넌트 (토글 버튼)

### 동적 인사말 시스템

우선순위와 조건 기반으로 사용자에게 맞춤형 인사말을 제공합니다.

#### 아키텍처
- **타입 정의**: `src/types/greeting.ts` (GreetingCondition, GreetingData, GreetingResult)
- **유틸리티**: `src/lib/greetingUtils.ts` (조건 평가, 필터링, 랜덤 선택)
- **데이터**: `src/constants/greetings.ts` (22개 인사말, 공휴일, 기념일)
- **훅**: `src/hooks/useGreeting.ts` (현재 조건 기반 인사말 선택)
- **컴포넌트**: `src/components/chat/Greeting.tsx` (인사말 표시)

#### 우선순위 시스템
```
Priority 3 (최우선) - 이벤트
├── 급여일 (25일)
├── 공휴일 전날
├── 공휴일
└── 회사 기념일

Priority 1 - 요일 & 시간대 (랜덤 선택)
├── 요일
│   ├── 월요일: "새로운 한 주의 시작 🌱"
│   ├── 화요일: "화요일 🚀"
│   ├── 수요일: "수요일! 🏞️"
│   ├── 목요일: "목요일 💡"
│   ├── 금요일: "불금 🎉"
│   └── 주말: "주말에 접속하셨네요 🌸"
└── 시간대
    ├── 06-09: "좋은 아침입니다 ☀️"
    ├── 09-12: "업무 시작! 💪"
    ├── 12-13: "점심시간 🍲"
    ├── 13-18: "오후에도 화이팅 ✨"
    ├── 18-20: "오늘도 수고 많으셨습니다 🌙"
    └── 20-24: "늦은 시간까지 고생하시네요 🌌"

Priority 0 (기본)
└── "사우님, 무엇을 도와드릴까요?"
```

#### 동작 방식
1. **조건 평가**: 현재 시간/날짜를 기준으로 모든 조건 확인
2. **필터링**: 매칭된 조건의 인사말만 필터링
3. **우선순위**: 가장 높은 우선순위 그룹 선택
4. **랜덤 선택**: 동일 우선순위 내에서 랜덤 선택
5. **결과 표시**: EmptyState에서 Greeting 컴포넌트로 표시

#### 사용 예시
```typescript
// useGreeting 훅 사용
const greeting = useGreeting();

// Greeting 컴포넌트에 전달
<Greeting greeting={greeting} />

// 결과 (동일 우선순위 내 랜덤 선택)
// - 월요일 오전 9시: "새로운 한 주의 시작 🌱" 또는 "업무 시작! 💪" (랜덤)
// - 화요일 점심: "화요일 🚀" 또는 "점심시간 🍲" (랜덤)
// - 급여일 (25일): "급여일입니다 💳" (이벤트가 최우선)
// - 공휴일: "즐거운 공휴일 보내세요 🎉" (이벤트가 최우선)
```

#### 확장 가능성
- 관리자 설정으로 공휴일/기념일 관리
- 동일 조건에 여러 메시지 추가
- 메시지 효과성 A/B 테스트
- 사용자별 맞춤 인사말

### 다크모드 시스템 상세

#### 아키텍처
- **타입 정의**: `src/types/chat.ts` (`Theme = "light" | "dark"`)
- **컴포넌트**: `src/components/ui/ThemeToggle.tsx`
- **상태 관리**: `src/stores/chatStore.ts` (`ui.theme`, `ui.resolvedTheme`)
- **테마 적용**: `app/providers.tsx` (HTML 클래스 제어)
- **스타일 정의**: `app/globals.css` (CSS 변수)

#### ThemeToggle 컴포넌트
```tsx
// 기본 토글 버튼
<ThemeToggle showLabel={false} />

// 라벨 포함 토글 버튼
<ThemeToggle showLabel={true} />

// 드롭다운 선택기
<ThemeToggleDropdown />
```

#### chatStore 테마 액션
```typescript
// 테마 설정
setThemeAction({ theme: "dark" }): void

// 테마 토글 (light ↔ dark)
toggleThemeAction(): void
```

#### 테마 적용 흐름
1. 사용자가 ThemeToggle 클릭
2. `setThemeAction({ theme })` 호출
3. chatStore의 `ui.theme` 업데이트
4. localStorage에 테마 저장
5. Providers의 useEffect가 변경 감지
6. `<html>` 태그에 `dark` 클래스 추가/제거
7. Tailwind의 `dark:` 클래스 활성화
8. globals.css의 `.dark` CSS 변수 적용

#### 컬러 시스템
**Light Mode:**
- Background: `#ffffff`, Foreground: `#171717`
- Primary: `#0ea5e9`, AI 메시지: `#f3f4f6`
- Sidebar: `#ffffff`

**Dark Mode:**
- Background: `#0a0a0a`, Foreground: `#ededed`
- Primary: `#38bdf8`, AI 메시지: `#1f2937`
- Sidebar: `#111827`

#### 사용 예시
```tsx
// SidebarPresentation에서 ThemeToggle 사용
import { ThemeToggle } from '@/components/ui/ThemeToggle';

<ThemeToggle
  showLabel={true}
  className="w-full gap-3 px-3 py-2"
/>

// 프로그래매틱 테마 변경
import { useChatActions } from '@/stores/chatStore';

const { setThemeAction } = useChatActions();
setThemeAction({ theme: "dark" });
```

#### 특징
- ✅ System 테마 제거 (Light/Dark만 유지)
- ✅ Tailwind `class` 전략 사용 (media 아님)
- ✅ localStorage 자동 저장 및 복원
- ✅ SSR hydration 경고 방지 (`suppressHydrationWarning`)
- ✅ 실시간 테마 전환 (새로고침 불필요)


### 타이핑 애니메이션 시스템

AI 메시지를 실시간으로 타이핑하는 듯한 효과를 제공하는 애니메이션 시스템입니다.

#### 아키텍처
- **라이브러리**: Typed.js (타이핑 애니메이션)
- **훅**: `src/hooks/useTypedAnimation.ts` (애니메이션 로직)
- **콜백**: `src/hooks/useAnimationCallbacks.ts` (상태 관리 콜백)
- **컴포넌트**: `src/components/chat/MessageBubble.tsx` (UI 통합)
- **상태 관리**: `chatStore.updateMessageAnimationStatusAction`

#### 구현 방식
```typescript
// useTypedAnimation.ts
export function useTypedAnimation({ messageId, content, onComplete }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<Typed | null>(null);

  useEffect(() => {
    if (!elementRef.current || !content) return;

    typedRef.current = new Typed(elementRef.current, {
      strings: [content],
      typeSpeed: UI_CONFIG.TYPING_SPEED,
      showCursor: false,
      onComplete: () => {
        updateMessageAnimationStatusAction({ id: messageId, status: "complete" });
        onComplete?.();
      },
    });

    return () => typedRef.current?.destroy();
  }, [messageId, content, onComplete]);

  return elementRef;
}
```

#### MessageBubble 통합
```typescript
// MessageBubble.tsx
export function MessageBubble({ message }) {
  const isTyping = message.animationStatus === "typing";
  const typedRef = useTypedAnimation({
    messageId: message.id,
    content: isAssistant && isTyping ? message.content : "",
  });

  return (
    <div>
      {isAssistant && isTyping ? (
        <div ref={typedRef} className="whitespace-pre-wrap text-sm" />
      ) : (
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      )}
    </div>
  );
}
```

#### 상태 흐름
1. AI 메시지 수신 → `animationStatus: "typing"`
2. Typed.js가 타이핑 애니메이션 시작
3. 타이핑 완료 → `animationStatus: "complete"`
4. IndexedDB 및 Store 동기화

### 음성 입력 시스템

Web Speech API를 활용한 한국어 음성 인식 시스템입니다.

#### 아키텍처
- **API**: Web Speech API (`SpeechRecognition`, `webkitSpeechRecognition`)
- **훅**: `src/hooks/useSpeechRecognition.ts` (음성 인식 로직)
- **컴포넌트**: `src/components/chat/VoiceInputButton.tsx` (음성 입력 버튼)
- **통합**: `src/components/chat/MessageInput.tsx` (메시지 입력과 통합)

#### 구현 방식
```typescript
// useSpeechRecognition.ts
export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechRecognitionState>({
    status: "idle",
    transcript: "",
    error: null,
  });

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setState({ status: "idle", transcript, error: null });
    };

    recognitionRef.current = recognition;
  }, []);

  return {
    transcript,
    isListening: state.status === "listening",
    startListening,
    stopListening,
    resetTranscript,
    isSupported: typeof window !== "undefined" && "webkitSpeechRecognition" in window,
  };
}
```

#### VoiceInputButton 사용
```typescript
// VoiceInputButton.tsx
export function VoiceInputButton({ onTranscript, disabled }) {
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript]);

  return (
    <Button
      onClick={() => isListening ? stopListening() : startListening()}
      className={isListening ? "animate-pulse" : ""}
    >
      {isListening ? "⏹" : "🎤"}
    </Button>
  );
}
```

#### 특징
- **한국어 지원**: `lang: "ko-KR"` 설정
- **실시간 전달**: transcript 변경 시 즉시 입력 필드에 반영
- **브라우저 감지**: 지원하지 않는 브라우저에서는 버튼 숨김
- **시각적 피드백**: 녹음 중 pulse 애니메이션

### 메시지 피드백 시스템

AI 메시지에 대한 사용자 피드백(좋아요/싫어요)을 수집하는 시스템입니다.

#### 아키텍처
- **타입**: `MessageFeedback = "like" | "dislike" | null`
- **컴포넌트**: `src/components/chat/MessageBubble.tsx` (피드백 버튼)
- **상태 관리**: `chatStore.updateMessageFeedbackAction`
- **저장소**: `messageRepository.updateFeedback` (IndexedDB)

#### 구현 방식
```typescript
// MessageBubble.tsx
export function MessageBubble({ message }) {
  const { updateMessageFeedbackAction } = useChatActions();

  const handleFeedback = async (feedback: MessageFeedback) => {
    try {
      // 같은 피드백을 다시 클릭하면 null로 설정 (토글)
      const newFeedback = message.feedback === feedback ? null : feedback;

      // Store 업데이트
      updateMessageFeedbackAction({ id: message.id, feedback: newFeedback });

      // IndexedDB 업데이트
      await messageRepository.updateFeedback(message.id, newFeedback);
    } catch (error) {
      logger.error("Failed to update feedback", error);
    }
  };

  return (
    <div>
      <p>{message.content}</p>

      {/* AI 메시지에만 피드백 버튼 표시 */}
      {isAssistant && !isOptimistic && !isTyping && (
        <div className="flex gap-1">
          <button
            onClick={() => handleFeedback("like")}
            className={message.feedback === "like" ? "text-blue-500" : "text-text-secondary"}
          >
            👍
          </button>
          <button
            onClick={() => handleFeedback("dislike")}
            className={message.feedback === "dislike" ? "text-red-500" : "text-text-secondary"}
          >
            👎
          </button>
        </div>
      )}
    </div>
  );
}
```

#### 특징
- **AI 메시지 전용**: 사용자 메시지에는 표시하지 않음
- **토글 기능**: 같은 버튼을 다시 클릭하면 피드백 취소
- **시각적 피드백**: 선택된 버튼은 색상 강조 (좋아요: 파란색, 싫어요: 빨간색)
- **동기화**: Store와 IndexedDB 동시 업데이트
- **타이핑 중 숨김**: 타이핑 애니메이션 중에는 버튼 숨김

개발 시 이 가이드라인을 따라주세요.
