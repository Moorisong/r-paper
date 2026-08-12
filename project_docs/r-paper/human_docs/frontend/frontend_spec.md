# 💻 3. 프론트엔드 아키텍처 명세 (`frontend_spec.md`)

본 문서는 **Haroo Paper** 프론트엔드의 구조적 디자인 패턴, 상태 관리 구조, 재사용 컴포넌트 목록, 그리고 비동기 API 통신 설계 방식을 상세히 설명합니다.

---

## 🏛️ 1. 프론트엔드 아키텍처 패턴

본 프로젝트는 React 기반의 **SPA (Single Page Application)** 아키텍처를 채택하고 있으며, UI 레이어와 데이터 비즈니스 로직을 격리하기 위해 **커스텀 훅(Custom Hooks) 패턴**을 활용하고 있습니다.

### 디렉토리 구조 및 컴포넌트 계층
```bash
src/
├── main.jsx          # React 앱 진입점
├── App.jsx           # AnimatePresence 애니메이션 및 라우트 선언
├── pages/            # 화면 페이지 단위 컴포넌트 (home, paper-view, not-found)
├── components/       # 재사용 가능한 UI 및 도메인 전용 컴포넌트
│   ├── layout/       # 레이아웃 컨테이너
│   ├── paper/        # 롤링페이퍼 전용 UI (메시지 카드, 리스트, 복사 모달 등)
│   └── ui/           # 범용 기초 디자인 시스템 위젯 (버튼, 인풋, 모달 등)
├── hooks/            # 비즈니스 로직 및 API 연동을 캡슐화한 커스텀 훅
├── services/         # Axios 통신 클라이언트 및 API 매핑
├── constants/        # 정적 텍스트 메시지, 테마 구조 정의, 한도 설정값
└── lib/              # 공통 포맷터, 클립보드 복사 등 순수 유틸리티
```

---

## 🔄 2. 글로벌/도메인 상태 관리 방식

Redux나 Zustand 같은 무거운 외부 전역 상태 관리 툴 대신, 개별 롤링페이퍼 단위의 상태가 독립적이므로 React 내장 Hook인 **`useState`, `useEffect`, `useCallback`**을 묶은 도메인 커스텀 훅을 통해 로컬 상태 관리를 수행합니다.

### 캡슐화된 3대 커스텀 훅

#### ① `useCreatePaper` (`hooks/use-create-paper.js`)
* **역할:** 신규 롤링페이퍼 생성 상태 관리.
* **상태:** `isLoading` (API 진행 상태), `error` (에러 메시지).
* **동작:** 생성 완료 시 브라우저 스토리지에 발행 증명 `creatorToken` 저장 후 상세 페이지 이동 처리.

#### ② `usePaper` (`hooks/use-paper.js`)
* **역할:** 개별 롤링페이퍼 정보(제목, 만료일 등) 조회.
* **상태:** `paper` (롤링페이퍼 메타 정보), `isLoading`, `error`.
* **동작:** `slug` 변경 감지 시 자동으로 GET 상세 API 호출.

#### ③ `useMessages` (`hooks/use-messages.js`)
* **역할:** 특정 롤링페이퍼에 수신된 메시지 리스트 관리 및 작성 처리.
* **상태:** `messages` (전체 로드된 메시지 배열), `page` (현재 페이지 번호), `hasMore` (추가 데이터 유무), `totalCount` (도착 메시지 총수), `isSending` (메시지 등록 전송 상태), `isLoading` / `isLoadingMore` (페이징 호출 상태).
* **동작:**
  * 새 메시지 등록 완료 시 화면이 깜빡이지 않도록 기존 리스트의 첫머리에 동적으로 새 메시지 인스턴스를 끼워 넣는 **Optimistic Update 유사 최적화** 적용.

---

## 🧱 3. 공통 및 재사용 UI 컴포넌트 명세

### 📂 `components/ui/` (공통 아토믹 위젯)
* **`Button.jsx`:** Tailwind와 `cn` 클래스 바인딩을 통해 스타일 변형(variant: primary, secondary, outline, ghost)과 `isLoading` 상태에 따른 스피너 및 비활성화를 자체 지원하는 고강도 버튼.
* **`Input.jsx`:** 글자수 제한 표시 및 에러 테두리 바인딩이 포함된 모던 입력 폼.
* **`Modal.jsx`:** 외부 클릭 시 닫힘 제어, Framer Motion 기반 부드러운 오버레이 팝업.
* **`LoadingSpinner.jsx`:** CSS 로테이션 애니메이션 기반의 부드러운 로딩 지시자.

### 📂 `components/paper/` (롤링페이퍼 도메인 위젯)
* **`MessageCard.jsx`:** 포스트잇 형태의 개별 메시지. 6가지 랜덤 파스텔톤 배경 테마 및 호버 효과 내장.
* **`MessageForm.jsx`:** 500자 제한 텍스트영역(Textarea) 및 제출 버튼을 포함한 작성 폼. 작성 중 모달을 닫아도 작성 데이터가 유지되도록 `sessionStorage` 기반 임시 저장(`draft_message_${paperId}`)을 지원하며, 메시지 전송 성공 시 자동 삭제됩니다.
* **`MessageList.jsx`:** 데이터 매핑 루프(Map) 및 비어있을 때의 엠프티 상태(Empty State) 일러스트/아이콘 처리.
* **`LinkCopyModal.jsx`:** 생성 성공 화면에서 카카오톡, 클립보드 링크 공유 기능과 닫기 방지(경고 안내) 연동.
* **`LinkWarningBanner.jsx`:** 주소를 아직 복사하지 않고 닫은 사용자 브라우저 상단에 상주하는 주황색 보존 권장 배너.

---

## 🌐 4. API 통신 및 에러 핸들링 구조

### Axios 클라이언트 설정 (`services/api.js`)
* **설정:** 환경 변수에서 로드한 백엔드 API 엔드포인트(`VITE_API_URL` 또는 기본 호스트)를 `baseURL`로 설정하여 모든 API 모듈이 이를 통하도 관리.
* **통신 명세:**
  * `paperApi.create(title)`: `POST /api/papers`
  * `paperApi.get(slug)`: `GET /api/papers/:slug`
  * `paperApi.getMessages(slug, page, limit)`: `GET /api/papers/:slug/messages?page=X&limit=Y`
  * `messageApi.create(slug, content)`: `POST /api/messages`

### 비동기 에러 처리 스키마
* 백엔드의 표준화된 에러 JSON 구조(`{ success: false, error: { code: '...', message: '...' } }`)를 해석합니다.
* API 호출 시 Axios HTTP `err.response.data.error.message`가 정의되어 있을 경우 이를 우선 추출하여 로컬 에러 상태(`error`)에 바인딩하고, 화면단 경고 UI로 즉시 변환시킵니다.
