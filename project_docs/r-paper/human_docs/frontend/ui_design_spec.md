# 🎨 2. 페이지별 UI 구조 및 비즈니스 로직 (`ui_design_spec.md`)

본 문서는 **Haroo Paper**의 클라이언트 페이지 라우팅 구조, 개별 화면의 기능 범위, 그리고 디자인 시스템 사양을 명세합니다.

---

## 🗺️ 1. 서비스 사이트맵 및 라우팅 구조

React Router Dom (`v7.12.0`) 기반으로 구현된 페이지 라우트 리스트는 다음과 같습니다.

| 경로 (Path) | 연결 컴포넌트 | 화면 정의 | 주요 기능 |
| :--- | :--- | :--- | :--- |
| `/` | `Home` | 홈 (메인 화면) | 롤링페이퍼 생성 양식 및 유효성 검사 |
| `/paper/:slug` | `PaperView` | 롤링페이퍼 공유/상세 화면 | 롤링페이퍼 메시지 목록 조회, 메시지 작성 모달, 링크 복사 유도 시스템 |
| `*` | `NotFound` | 404 에러 화면 | 존재하지 않는 경로 요청 시 안내 및 홈 이동 |

---

## 💻 2. 페이지별 핵심 기능 및 비즈니스 로직 요약

### ① 홈 화면 (`home.jsx`)
* **역할:** 로그인 없이 제목을 입력하여 새 롤링페이퍼를 신속하게 발행하는 입구 페이지.
* **비즈니스 로직:**
  * **제목 글자수 제한:** 입력 양식에서 글자수 한도(`LIMITS.titleMaxLength` = 40자) 실시간 검사 및 우측 하단 카운터 표시.
  * **API 연동:** `useCreatePaper` 커스텀 훅을 사용해 서버에 `POST /api/papers` 요청.
  * **크리에이터 토큰 로컬 저장:** 발행 성공 시 반환되는 `creatorToken`을 브라우저 로컬 스토리지(`creator_token_${slug}`)에 즉시 저장하여 향후 해당 기기에서의 본인 메시지 작성을 차단(주인은 쓸 수 없음)하는 보안 장치 마련.
  * **화면 전환:** 성공 시 생성된 롤링페이퍼 경로인 `/paper/:slug?new=true`로 자동 리다이렉트.

### ② 롤링페이퍼 공유 및 상세 화면 (`paper-view.jsx`)
* **역할:** 생성된 롤링페이퍼를 확인하고, 타인에게 공유하거나 타인이 남긴 메시지를 감상/작성하는 본 화면.
* **비즈니스 로직:**
  * **사용자 권한 검사:** `localStorage` 내 `creator_token_${slug}` 존재 여부를 기반으로 `isCreator` 상태 식별.
    * `isCreator === true` (주인): "메시지 남기기" 버튼이 숨겨지며, 대신 "롤링페이퍼 주인은 메시지를 작성할 수 없어요"라는 공유 유도 안내 카드 노출.
    * `isCreator === false` (방문자): 플로팅 펜 버튼 또는 하단 "메시지 남기기" 버튼을 통해 타인에게 익명 메시지 작성 가능.
  * **강력한 링크 복사 유도 시스템 (UX):**
    * 신규 생성 후 첫 진입 시(`?new=true`), 브라우저에 `LinkCopyModal` 팝업을 강제 표시하여 카카오톡이나 SNS 전송용 주소 복사 권장.
    * 만약 사용자가 주소를 복사하지 않고 닫았을 때(`onDismissWithoutCopy`), 상단에 고정된 붉은색/주황색 계열의 경고 배너(`LinkWarningBanner`)를 영구 노출하여 뒤로 가기 전에 주소 유실을 방지.
  * **메시지 페이징 조회:** 10개 단위로 정렬된 익명 메시지 표시. "더 보기" 버튼 클릭 시 `loadMore` 트리거로 비동기 무한 스크롤 형태의 목록 추가 렌더링.
  * **비동기 메시지 제출:** `MessageForm` 모달을 통해 메시지를 작성하며, 작성 즉시 `sendMessage` API를 요청하고 완료 시 모달 닫기 및 리스트 자동 갱신.

### ③ 404 Not Found 화면 (`not-found.jsx`)
* **역할:** 잘못된 URL에 진입한 사용자에게 친근한 404 애니메이션(Framer Motion)과 메인으로 돌아가는 버튼 제공.

---

## 🎨 3. 디자인 시스템 및 테마 스펙

프로젝트 내 구현된 UI는 `Tailwind CSS` 기반으로 정의된 공통 클래스 및 테마 맵을 사용합니다.

### 폰트 및 타이포그래피
* **기본 서체:** `NanumSquare`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
* **텍스트 가중치:** Normal(400), Bold(700), Extrabold(800)

### 🎨 테마 팔레트 (`frontend/src/constants/themes.js`)
방문 시마다 테마를 다채롭게 지원하기 위해 다음과 같은 6대 기본 테마 팔레트 프리셋을 제공하고 있습니다.

| 테마 ID | 테마 이름 | 배경 그라디언트 | 주요 버튼 스타일 |
| :--- | :--- | :--- | :--- |
| `theme_basic` | Basic | Gray (from-gray-50 to-gray-100) | Gray / Dark (bg-gray-900) |
| `theme_sunset` | Sunset | Pink/Orange (from-[#FFF0F0] to-[#FFDAB9]) | Red/Orange (from-orange-400 to-rose-500) |
| `theme_ocean` | Ocean | Cyan/Blue (from-[#F0F8FF] to-[#B2EBF2]) | Blue (from-cyan-500 to-blue-600) |
| `theme_forest` | Forest | Green (from-[#F1F8E9] to-[#C8E6C9]) | Green (from-emerald-500 to-green-600) |
| `theme_lavender` | Lavender | Purple (from-[#F3E5F5] to-[#CE93D8]) | Indigo/Purple (from-purple-400 to-indigo-500) |
| `theme_mint` | Mint | Teal/Mint (from-[#E0F2F1] to-[#80CBC4]) | Mint (from-teal-400 to-emerald-500) |

### ✉️ 메시지 카드 스타일
각 메시지 포스트잇은 단조로움을 피하기 위해 다음과 같은 고유 테마별 레프트 보더(Left-border Accent) 효과를 적용받습니다.
* **`card-purple`:** 옅은 퍼플 배경 + `#667eea` 4px 좌측 선
* **`card-pink`:** 옅은 핑크 배경 + `#ec4899` 4px 좌측 선
* **`card-blue`:** 옅은 블루 배경 + `#3b82f6` 4px 좌측 선
* **`card-green`:** 옅은 그린 배경 + `#22c55e` 4px 좌측 선
* **`card-orange`:** 옅은 오렌지 배경 + `#f59e0b` 4px 좌측 선
* **`card-teal`:** 옅은 틸 배경 + `#14b8a6` 4px 좌측 선
