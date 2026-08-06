# Frontend Agent Reference

## 📝 1. 연동 기획 명세 (`frontend_spec.md`, `ui_design_spec.md`, `frontend_env.md`)
본 서비스(Haroo Paper)는 React 기반의 SPA(Single Page Application)로, Vite 빌드 시스템과 Tailwind CSS를 사용하여 구축되었습니다. 
* 롤링페이퍼 생성, 개별 롤링페이퍼 공유 및 조회, 익명 메시지 작성 기능을 제공합니다.
* 전역 상태 대신 개별 단위의 Custom Hook (`useCreatePaper`, `usePaper`, `useMessages`)을 통해 상태를 관리합니다.
* 화면은 `Home`, `PaperView`, `NotFound`의 세 가지 주요 뷰로 나뉘며, 프레이머 모션(Framer Motion)을 통한 부드러운 애니메이션 전환을 포함합니다.
* 사용자의 주소 유실을 방지하기 위한 강제 링크 복사 유도 모달 및 경고 배너(UX)가 포함되어 있습니다.

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
프론트엔드 기능을 개발하거나 유지보수할 때 재사용 가능한 아키텍처 패턴을 따르고, 사용자 경험(UX) 및 스타일 일관성을 유지합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
* `src/main.jsx`, `src/App.jsx`: 진입점 및 라우팅 제어
* `src/pages/`: 화면 단위 페이지 (home, paper-view, not-found)
* `src/components/`: 재사용 UI 컴포넌트 (`ui/`, `layout/`, `paper/`)
* `src/hooks/`: 비즈니스 로직 Custom Hooks
* `src/services/`: API 통신(Axios) 클라이언트

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **의존성 설치 및 환경 설정**: `frontend_env.md` 명세에 따라 Vite 환경 구동(`npm run dev`).
2. **UI/UX 구현**: `components/ui/`에서 제공되는 기본 아토믹 위젯(Button, Input, Modal 등)을 조합하여 페이지를 구성.
3. **상태 바인딩**: 컴포넌트 내부에서 `hooks/`를 로드하여 로딩 상태(`isLoading`), 에러 표시줄, 데이터 매핑을 연결.
4. **API 연동 방어**: 낙관적 업데이트(Optimistic Update) 등의 기법을 적용하여 지연 없는 뷰 제공 유지.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 기준 300줄을 절대 초과할 수 없습니다. 컴포넌트나 훅이 비대해지면 즉시 하위 모듈이나 유틸리티로 구조를 분해하십시오.
- **[플랫폼 락]:** 오직 React + Tailwind + Vite 환경에서 구동되는 코드만 작성합니다. (모바일 네이티브 접근 금지)
- **[하드코딩 금지]:** API 주소는 반드시 `VITE_API_URL` 환경 변수를 통해 참조하며, 반복되는 메시지나 테마 등은 `constants/` 디렉토리에 분리하여 사용합니다.
