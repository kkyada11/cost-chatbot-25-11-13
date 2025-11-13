# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Please respond in Korean (한국어) when communicating with users in this project.** This is a Korean translation platform project, and team members primarily communicate in Korean.

## Project Overview

This is a **Korean corporate expense claim AI chatbot** web application built with Next.js 15, React 19, and TypeScript. The project is designed to help company employees ask questions about expense claim processes, policies, and form completion in natural language and receive immediate responses.

**Extended Features**:

- **Confluence Wiki Integration**: Search and browse Confluence pages (계획 중)
- **PDF Generation Service**: PDF 생성 서비스 (향후 추가 예정)

### Business Requirements

- **Core Purpose**: Automate expense claim inquiries, provide 24/7 instant response service
- **Target Users**: All company employees (primary), HR/Finance teams (administrators)
- **Success Metrics**: 95%+ accuracy, <2s response time, 4.5/5.0 user satisfaction

## Development Commands

### Core Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build production app
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting

### Code Quality (Biome)

- `npm run biome:check` - Check code formatting and linting
- `npm run biome:check:write` - Check and auto-fix issues
- `npm run biome:format` - Format code with Biome
- `npm run biome:lint` - Lint code with Biome
- `npm run biome:lint:write` - Lint and auto-fix with Biome

## Technology Stack

### Core Framework

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling

### State Management & Data Handling

- **Zustand**: Flux pattern-based global state management
- **TanStack Query**: Server state management and caching
- **Axios**: HTTP client for Python API communication
- **Dexie**: IndexedDB wrapper for conversation history and offline support

### Backend Services

- **Python 3.11+**: Backend service runtime (Chat AI 서버)
- **Gemini API**: AI 모델 (기본)
- **Future**: PDF 생성, Confluence 통합 서비스 추가 예정

### Architecture Patterns

- **Container & Presentational (C&P) Pattern**: Component separation
- **Flux Pattern**: Unidirectional data flow with Zustand
- **Factory Pattern**: Object creation standardization (MessageFactory, ConversationFactory)
- **Repository Pattern**: Data access layer (MessageRepository, ConversationRepository)
- **Service Layer**: Business logic encapsulation (MessageService, ConversationService)

### Code Quality

- **Biome** for linting and formatting (configured for accessibility, performance, security)
  - `noDangerouslySetInnerHtml` 규칙 비활성화 (형광펜 효과 구현을 위해)
- **TypeScript** with strict mode enabled

## Project Structure

For detailed information about each directory, refer to the respective CLAUDE.md files:

- **[app/CLAUDE.md](app/CLAUDE.md)**: Next.js App Router, Layouts, Providers
- **[src/CLAUDE.md](src/CLAUDE.md)**: Components, Hooks, Stores, Utilities

```
cost-chatbot/
├── app/                          # Next.js App Router → See app/CLAUDE.md
│   ├── globals.css              # Global styles + Tailwind
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main Chat page
│   └── providers.tsx            # Client providers
├── src/                          # Core Application Logic → See src/CLAUDE.md
│   ├── components/              # Presentational Components
│   ├── containers/              # Container Components
│   ├── hooks/                   # Custom Hooks
│   ├── factories/               # Factory Pattern (Object Creation)
│   ├── repositories/            # Repository Pattern (Data Access)
│   ├── services/                # Service Layer (Business Logic)
│   ├── stores/                  # Zustand Stores
│   ├── lib/                     # Utilities
│   ├── assets/                  # Static Assets (Icons)
│   ├── constants/               # Constants Data
│   └── types/                   # TypeScript Types
├── public/                      # Static Files
│   └── assets/                  # Images, Fonts, etc.
└── docs/                        # Documentation
```

## Development Guidelines

### Code Standards

- Follow Biome configuration (2-space indentation, double quotes, semicolons)
- Use TypeScript strict mode
- Maintain accessibility standards (a11y rules enabled)
- Follow Next.js App Router conventions

### React Hooks 품질 규칙

- **useCallback/useMemo Dependencies**: 모든 의존성을 정확히 명시
- **Hook 선언 순서**: 함수가 선언되기 전에 사용되지 않도록 순서 조정
- **Exhaustive Dependencies**: 린터가 제안하는 모든 의존성 포함
- **중복 훅 호출 방지**: 동일한 커스텀 훅을 여러 컴포넌트에서 동시 호출 금지

### Container & Hook 사용 규칙

- **한 훅 한 Container 원칙**: 동일한 커스텀 훅은 하나의 Container에서만 사용
- **데이터 공유**: Container 간 데이터 공유는 Zustand store를 통해서만
- **Container 책임 분리**: 각 Container는 명확한 단일 책임을 가져야 함

### Import/Export 품질 규칙

- **정렬 순서**: React imports → 외부 라이브러리 → 내부 모듈 → 타입 imports
- **타입 전용 Import**: `import type`을 사용하여 타입만 import

### 타입 안정성 규칙

- **any 타입 금지**: `unknown`, 구체적 타입, 제네릭 사용
- **함수 타입**: Call signature 대신 function type 사용

### 접근성 (a11y) 강화 규칙

- **Semantic HTML First**: `<button>`, `<nav>`, `<main>` 등 시맨틱 요소 우선 사용
- **Avoid Unnecessary Role Attributes**: 시맨틱 HTML로 대체 가능한 경우 role 사용 금지
- **ARIA Attributes Only When Needed**: 추가 의미 정보가 필요할 때만 사용
- **Progressive Enhancement**: HTML 구조에 접근성을 내장

**Examples of What NOT to Do:**

```tsx
// ❌ Don't use role when semantic HTML is available
<div role="button" onClick={handleClick}>Click me</div>
<div role="navigation">...</div>

// ✅ Use semantic HTML elements instead
<button type="button" onClick={handleClick}>Click me</button>
<nav>...</nav>
```

## API Integration

### Chat AI API (localhost:8000)

Python backend for expense claim chatbot.

**Request:**

```json
{
  "message": "사용자 질문",
  "model": "gemini",
  "conversation_id": "conv-timestamp-randomstr"
}
```

**Response:**

```json
{
  "data": {
    "content": "AI 응답 내용",
    "related_questions": ["추천질문1", "추천질문2", "추천질문3"],
    "is_final": true,
    "format": "json"
  }
}
```

### Future APIs (계획 중)

- **Confluence Wiki API**: Wiki 페이지 검색 및 조회
- **PDF Generation API**: PDF 생성 서비스

## Current Status - MVP Development

### Project Phase: Phase 4 In Progress 🚧

현재 MVP(Minimum Viable Product) 개발 중 (전체 진행률: 약 75%)

**✅ 완료된 작업:**

- **Phase 1**: Next.js 프로젝트 구조 및 타입 정의 (100%)
- **Phase 2**: 핵심 인프라 구축 (100%)
  - Dexie IndexedDB, Zustand Store, API 클라이언트
- **Phase 3**: 커스텀 훅 구현 (100%)
  - useChat, useConversations, useTypingAnimation
- **아키텍처 패턴**: 3개 패턴 구현 완료 (100%)
  - Factory Pattern (MessageFactory, ConversationFactory)
  - Repository Pattern (MessageRepository, ConversationRepository)
  - Service Layer (MessageService, ConversationService)
- **UI 컴포넌트**: 주요 컴포넌트 구현 완료
- **다크모드**: Light/Dark 테마 전환 (100%)
- **토스트 알림**: 사용자 피드백 시스템 (100%)

**🚧 현재 진행 중:**

- **Phase 4**: UI 컴포넌트 구현 및 통합 (95% 완료)

**📋 MVP 범위:**

- ✅ **포함**: 기본 채팅, Python API 연동, IndexedDB 히스토리, 사이드바, 다크모드, 토스트 알림
- 🔜 **향후 추가**: Confluence Wiki 통합, PDF 생성, Electron 데스크톱 앱

### 구현된 핵심 기능

- 🗄️ **IndexedDB**: 5버전 스키마, 메시지 순서 보장 (timestamp 기반 order)
- 🔄 **Zustand 스토어**: Flux 패턴, 낙관적 업데이트, 20개 액션 완료
- 🎨 **타이핑 애니메이션**: 실시간 메시지 애니메이션
- 📱 **반응형 컴포넌트**: 모든 주요 UI 구현 완료
- 🏗️ **아키텍처 패턴**: Factory, Repository, Service Layer 완료
- 🏗️ **Container 패턴**: 로직과 UI 분리
- 🎤 **음성 입력**: Web Speech API
- 🎨 **UI 컴포넌트**: Toast, CustomMenu, Divider, LoadingGate 등
- 👋 **동적 인사말**: 우선순위 기반 조건별 인사말 시스템 (시간대, 요일, 이벤트)
- 🌙 **다크모드**: Light/Dark 테마 전환, localStorage 저장, Tailwind class 기반
- 👍 **메시지 피드백**: 좋아요/싫어요 기능, Store/IndexedDB 동기화
- 🖍️ **형광펜 효과**: AI 메시지 내 키워드 하이라이트, 애니메이션 (왼쪽→오른쪽 칠하기)
- 🗑️ **채팅 삭제**: 삭제 후 첫 번째 대화 자동 선택, 대화 없으면 새 대화 자동 생성
- ♾️ **무한 스크롤**: 20건 단위 메시지 페이지네이션, 카카오톡 스타일 역방향 로딩, 앵커 기반 스크롤 위치 유지, 타이핑 시작/완료 시 자동 스크롤

### API 서버 연동 정보

- **Chat AI 서버**: localhost:8000 ✅

## Development Approach

### Phase 1-3: Infrastructure ✅ Complete

- Next.js 15 + TypeScript setup
- Zustand store (Flux pattern)
- Dexie IndexedDB setup
- Custom hooks implementation

### Phase 4: UI Implementation 🚧 In Progress

- Component development
- Container pattern integration
- Search functionality

### Phase 5-6: Integration & Testing (Upcoming)

- Page integration
- End-to-end testing
- Python API integration testing

## 다크모드 시스템

### 아키텍처

- **테마 타입**: `"light" | "dark"` (System 제외)
- **상태 관리**: Zustand chatStore (`ui.theme`)
- **적용 방식**: Tailwind CSS `class` 전략 (`<html class="dark">`)
- **영속성**: localStorage 저장 및 복원

### 구현 위치

- **타입 정의**: `src/types/chat.ts` (Theme 타입)
- **컴포넌트**: `src/components/ui/ThemeToggle.tsx` (토글 버튼)
- **테마 적용**: `app/providers.tsx` (HTML 클래스 제어)
- **스타일**: `app/globals.css` (CSS 변수 정의)
- **상태 관리**: `src/stores/chatStore.ts` (setThemeAction, toggleThemeAction)

### 컬러 시스템

**Light Mode:**

- Background: `#ffffff`, Foreground: `#171717`
- Primary: `#0ea5e9`, AI 메시지: `#f3f4f6`
- Sidebar: `#ffffff`

**Dark Mode:**

- Background: `#0a0a0a`, Foreground: `#ededed`
- Primary: `#38bdf8`, AI 메시지: `#1f2937`
- Sidebar: `#111827`

### 사용 예시

```tsx
// ThemeToggle 사용
import { ThemeToggle } from '@/components/ui/ThemeToggle';

<ThemeToggle showLabel={true} />;
```

## Additional Resources

For detailed implementation guides and architecture information:

- **App Router**: See [app/CLAUDE.md](app/CLAUDE.md)
- **Components & Hooks**: See [src/CLAUDE.md](src/CLAUDE.md)
- **다크모드 시스템**: See [src/CLAUDE.md](src/CLAUDE.md#다크모드-시스템-상세) (아키텍처 및 사용법)
- **동적 인사말**: See [src/CLAUDE.md](src/CLAUDE.md#동적-인사말-시스템) (우선순위 기반)
- **무한 스크롤 시스템**: See [src/CLAUDE.md](src/CLAUDE.md#무한-스크롤-시스템) (카카오톡 스타일 페이지네이션)

개발 시 각 디렉토리의 CLAUDE.md를 참고하세요.
