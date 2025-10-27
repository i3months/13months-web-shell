# 🧠 13months-web-shell

> 브라우저에서 실행되는 **개인용 Web Shell (CLI 포트폴리오)**  
> 리눅스 명령어 기반 인터페이스로, 나를 소개하는 새로운 방식의 자기소개 셸 환경.

---

## 🚀 개요

**13months-web-shell**은 기본적인 리눅스 명령어(`ls`, `cd`, `pwd`, `echo`, `clear` 등)를 제공하며,  
개인화된 명령어(`linkedin`, `blog`, `hobby`, `career` 등)를 통해  
**나를 소개하거나 링크를 연결하는 Web CLI 포트폴리오**입니다.

예시 이미지:

![screenshot](./docs/demo.png)

> 💡 "나를 소개하는 셸" — 이력서보다 직관적인, 대화형 포트폴리오를 목표로 합니다.

---

## 🧩 주요 기능

| 기능               | 설명                                                               |
| ------------------ | ------------------------------------------------------------------ |
| 기본 리눅스 명령어 | `ls`, `cd`, `pwd`, `echo`, `clear` 등 지원                         |
| 개인 명령어        | `linkedin`, `blog`, `career`, `help` `hobby` 등 나만의 커맨드 등록 |
| 명령어 확장성      | 별도의 `custom-commands.ts` 파일 수정만으로 추가 가능              |
| 브라우저 호환      | 모든 명령은 React 환경에서 작동                                    |
| 경량 아키텍처      | FSD 기반 구조 + 단방향 의존성 유지                                 |

---

## 🛠 기술 스택

| 구분                 | 기술                                |
| -------------------- | ----------------------------------- |
| **Frontend**         | React 18.3+                         |
| **Language**         | TypeScript 5.4+                     |
| **Bundler**          | Vite 5.x                            |
| **Package Manager**  | pnpm 9.x                            |
| **Styling**          | TailwindCSS 3.4+, shadcn/ui         |
| **Router**           | React Router DOM 6.26+              |
| **State Management** | React Context API                   |
| **Icons**            | lucide-react                        |
| **Lint/Format**      | ESLint, Prettier, TypeScript ESLint |
| **Test**             | Vitest + React Testing Library      |
| **Deployment**       | Vercel / Netlify                    |
| **Optional**         | xterm.js (터미널 효과용)            |

---

## 🧱 아키텍처 — FSD (Feature-Sliced Design)

**FSD(Feature-Sliced Design)** 를 기반으로 기능 단위로 책임을 분리하고,  
레이어 간 **단방향 의존성**을 강제하여 확장성과 유지보수성을 극대화합니다.

### 📂 레이어 구조 (상→하 의존)

app → 앱 진입점 및 전역 설정 (Provider, Router, Layout)
pages → 페이지 조립 (도메인 UI 조합 + 라우팅 연결)
features → 사용자 인터랙션 / 비즈니스 로직 (폼, 플로우 등)
entities → 도메인 모델 / 훅 / 맵퍼 / API / UI (엔티티 중심)
shared → 공통 유틸 / UI

> **의존성 규칙:** `shared → entities → features → pages → app`  
> (역참조 금지!)

---

## 🧭 UniScope FSD 가이드라인 적용

### 1️⃣ `index.ts` 규칙

- 각 레이어/도메인 루트에 반드시 `index.ts` 생성
- **외부 모듈은 `index.ts`만 import** (내부 구조 직접 접근 금지)
- 외부 노출 최소화 (캡슐화 원칙)

### 2️⃣ 네이밍 컨벤션

| 구분                | 규칙             | 예시                                  |
| ------------------- | ---------------- | ------------------------------------- |
| 디렉토리            | `kebab-case`     | `command-runner/`, `custom-commands/` |
| React 컴포넌트 파일 | `PascalCase.tsx` | `TerminalShell.tsx`                   |
| 기능 슬라이스명     | 동사+명사        | `execute-command`, `command-history`  |

### 3️⃣ pages / widgets 규칙

- `pages/`, `widgets/` 하위에는 **`ui/`와 `index.ts`만 존재**
- 로직(`model`, `api`, `state`)은 해당 레이어로 이동

### 4️⃣ 상태 관리 규칙

- 전역 상태: `app/providers/`의 **React Context**
- 도메인/피처 상태: 해당 레이어 내부에 **co-locate**
- 불필요한 전역화 지양 (local state 우선)

### 5️⃣ 타입 / 모델 규칙

- 로컬 전용 타입, Props → 해당 기능 폴더에 co-locate
- API 타입 분리:

_.request.ts → API 요청 DTO
_.response.ts → API 응답 DTO
_.domain.ts → Domain 모델
_.map.ts → DTO ↔ Domain 매핑

### 6️⃣ 디자인 시스템 규칙

- **shadcn/ui 기반 커스텀 시스템** 사용
- `shared/ui` → atomic 컴포넌트만 배치
- 도메인 의미 포함 시 `entities` 또는 `features`에 배치
- **YAGNI 원칙 준수:** 지금 필요 없는 추상화는 하지 않는다

---

## 🗂 디렉토리 구조 예시

src/
├── app/
│ ├── providers/
│ │ ├── theme-provider.tsx
│ │ └── command-context.tsx
│ ├── router/
│ │ └── app-router.tsx
│ └── index.tsx
│
├── pages/
│ ├── terminal/
│ │ ├── ui/
│ │ │ └── TerminalPage.tsx
│ │ └── index.ts
│ └── index.ts
│
├── widgets/
│ ├── shell/
│ │ ├── ui/
│ │ │ ├── Shell.tsx
│ │ │ ├── CommandLine.tsx
│ │ │ └── OutputArea.tsx
│ │ └── index.ts
│ └── index.ts
│
├── features/
│ ├── execute-command/
│ │ ├── model/
│ │ │ ├── execute.ts
│ │ │ ├── built-in.ts
│ │ │ └── command-parser.ts
│ │ └── index.ts
│ └── index.ts
│
├── entities/
│ ├── command/
│ │ ├── model/
│ │ │ └── custom-commands.ts
│ │ └── index.ts
│ └── index.ts
│
├── shared/
│ ├── ui/
│ │ ├── terminal/
│ │ │ ├── Prompt.tsx
│ │ │ └── Cursor.tsx
│ ├── lib/
│ │ └── open-link.ts
│ └── index.ts
│
└── index.ts

---

## 💾 커스텀 명령어 관리

```ts
// src/entities/command/model/custom-commands.ts
export const customCommands = [
  { name: "linkedin", type: "link", value: "https://linkedin.com/in/13months" },
  { name: "blog", type: "link", value: "https://13months.tistory.com" },
  { name: "hobby", type: "text", value: "🎹 Piano, 📸 Photography, 💻 Coding" },
  {
    name: "career",
    type: "text",
    value: "Frontend Engineer | Kakao Tech Campus",
  },
];
```

thai@crypto:/ $ help
Available commands: ls, cd, pwd, clear, linkedin, blog, hobby, career

thai@crypto:/ $ linkedin
→ Opening LinkedIn profile in new tab...

thai@crypto:/ $ hobby
🎹 Piano, 📸 Photography, 💻 Coding

thai@crypto:/ $ clear
[Screen cleared]

명령 자동완성 (Tab)

명령 이력 (↑, ↓)

테마 전환 (dark, light, matrix)

환경변수(export, set, env) 관리

ASCII 애니메이션 로고 추가
