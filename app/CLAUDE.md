# App Directory - Next.js App Router

이 디렉토리는 Next.js 15 App Router 기반의 애플리케이션 진입점입니다.

## 디렉토리 구조

```
app/
├── chat/                    # 채팅 페이지 라우트
│   ├── [conversationId]/    # 동적 대화 ID 라우트
│   │   └── page.tsx         # 특정 대화 페이지
│   ├── layout.tsx           # 채팅 레이아웃 (사이드바 포함)
│   └── page.tsx             # 기본 채팅 페이지
├── globals.css              # 전역 스타일 + Tailwind CSS
├── layout.tsx               # Root Layout
├── page.tsx                 # 메인 홈 페이지 (리다이렉트)
└── providers.tsx            # Client-side Providers
```

## 핵심 파일 설명

### `layout.tsx` - Root Layout
- **역할**: 애플리케이션의 최상위 레이아웃
- **기능**:
  - HTML 구조 정의 (`<html>`, `<body>`)
  - Metadata 설정 (title, description)
  - Providers 컴포넌트 래핑
- **중요 사항**:
  - 모든 페이지에 공통으로 적용됨
  - `lang="ko"` 설정 (한국어 애플리케이션)
  - `suppressHydrationWarning`: 다크모드 적용으로 인한 hydration 경고 방지

### `page.tsx` - 메인 홈 페이지
- **역할**: 루트 페이지 (리다이렉트)
- **기능**: `/chat` 페이지로 리다이렉트

### `chat/layout.tsx` - 채팅 레이아웃
- **역할**: 채팅 페이지 레이아웃
- **기능**:
  - 사이드바 (대화 목록)
  - 메인 콘텐츠 영역
  - 대화 삭제 기능
  - Electron 타이틀바 (Electron 환경)
- **특징**: `"use client"` 컴포넌트

### `chat/page.tsx` - 기본 채팅 페이지
- **역할**: 대화 선택 없이 접근 시 표시
- **기능**: ChatContainer 렌더링

### `chat/[conversationId]/page.tsx` - 특정 대화 페이지
- **역할**: URL 파라미터로 특정 대화 표시
- **기능**:
  - TanStack Query 캐시 초기화
  - 대화 전환 로깅
  - ChatContainer 렌더링

### `providers.tsx` - Client Providers
- **역할**: Client-side 전역 Provider 설정
- **포함**:
  - TanStack Query Provider (서버 상태 관리)
  - 테마 적용 로직 (HTML 클래스 제어)
  - 대화 목록 초기화
  - 개발 모드 devUtils 초기화
- **중요 사항**:
  - `"use client"` 디렉티브 필수
  - Zustand store는 Provider 불필요 (자체적으로 전역 상태 관리)
- **테마 적용 로직**:
  - chatStore의 theme 상태 구독
  - theme 변경 시 `<html>` 태그에 `dark` 클래스 추가/제거
  - 초기 테마 적용 (localStorage에서 복원)

### `globals.css` - 전역 스타일
- **포함**:
  - Tailwind CSS 디렉티브 (`@import "tailwindcss"`)
  - CSS 변수 기반 디자인 시스템
  - 다크모드 CSS 변수 (`[data-theme="dark"]`, `.dark`)
  - 하이라이트 애니메이션 (`highlight-flash` 클래스)
  - **형광펜 효과** (`.highlight` 클래스):
    - 노란색 배경 (Light: `rgba(251, 191, 36, 0.3)`, Dark: `rgba(251, 191, 36, 0.25)`)
    - 왼쪽→오른쪽 칠하기 애니메이션 (`highlightSwipe`, 0.6초)
    - AI 메시지 내 키워드 강조용
  - 커스텀 스크롤바 스타일
- **Tailwind v4**: 새로운 구성 방식 사용
- **다크모드 구현**:
  - `:root` - Light 모드 CSS 변수 정의
  - `.dark` - Dark 모드 CSS 변수 재정의
  - 디자인 토큰: Primary, AI/User 메시지, Sidebar 컬러
  - 타이포그래피, 간격, 애니메이션 토큰

## 개발 가이드라인

### Next.js 15 App Router 규칙
- **Server Components**: 기본적으로 서버 컴포넌트
- **Client Components**: `"use client"` 디렉티브 필요
- **API Routes**: `route.ts` 파일로 정의
- **Dynamic Routes**: `[param]` 폴더 구조

### 접근성 (Accessibility)
- **Semantic HTML**: `<button>`, `<nav>`, `<main>` 등 시맨틱 요소 사용
- **Role 속성 지양**: 시맨틱 HTML로 대체 가능한 경우 role 사용 금지
- **ARIA 레이블**: 스크린 리더를 위한 적절한 레이블 제공

## 주요 기술 스택
- **Next.js 15**: App Router
- **React 19**: 최신 React 버전
- **TypeScript**: strict mode
- **Tailwind CSS v4**: 유틸리티 CSS

## API Routes

현재 App Router에는 API routes가 정의되어 있지 않습니다. 백엔드 통신은 Next.js API routes 대신 직접 Python 서버(localhost:8000)와 통신합니다.

향후 추가 예정:
- `app/api/`: Next.js API Routes (Python 서버 프록시 등)

## 관련 디렉토리
- **src/**: 핵심 애플리케이션 로직 (Components, Hooks, Stores, Factories, Repositories, Services)
- **public/**: 정적 파일 (이미지, 아이콘, 로딩 애니메이션 등)
- **docs/**: 프로젝트 문서

개발 시 이 가이드라인을 따라주세요.
