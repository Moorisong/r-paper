# ⚙️ 4. 백엔드 아키텍처 및 API 명세 (`backend_spec.md`)

본 문서는 **Haroo Paper** 백엔드 서비스의 구성 패턴, 클라이언트 노출 API 엔드포인트 명세, 보안 위협 통제(Rate Limiting/IP 차단) 및 관리자 기능 명세를 정의합니다.

---

## 🏛️ 1. 백엔드 아키텍처 개요

본 백엔드는 Node.js & Express 프레임워크 기반의 단일 컨트롤러/라우터 계층 구조로 이루어져 있으며, MongoDB와의 연동을 위해 Mongoose ODM을 채택하고 있습니다.

### 디렉토리 구조 및 역할
* **`server.js`:** 서버 엔트리 포인트. 데이터베이스 접속, 글로벌 미들웨어(CORS, JSON Parser, Rate Limit) 등록 및 라우터 주입.
* **`routes/`:** 비즈니스 컨트롤러가 매핑된 Express 라우터 모듈군.
* **`models/`:** MongoDB 콜렉션 스키마 모델.
* **`constants/`:** 에러 코드 메시지 및 환경 설정값 리스트.
* **`utils/`:** 슬러그 생성기 등 독립 헬퍼 모듈.

---

## 🛡️ 2. 인증/인가 및 어뷰징 차단 미들웨어 구조

### ① 글로벌 Rate Limiting (`express-rate-limit`)
* **설정:** `windowMs`: 15분, `max`: 100회 (단일 IP당 15분 내 최대 100회 요청으로 제한).
* **특이사항:** `app.set('trust proxy', 1)` 설정을 적용하여, Nginx reverse proxy 배후에서 작동 시 실제 클라이언트의 외부 IP 주소를 신뢰하고 식별 가능하도록 조치.

### ② 정밀 어뷰징 자동 차단 로직 (IP Blacklist & IP Activity)
단순 미들웨어를 넘어 백엔드 라우터 레벨에서 정밀 IP 활동을 감적하여 자동 차단하는 다단계 보안 필터를 장착하고 있습니다.

#### [롤링페이퍼 생성 통제 필터]
1. **블랙리스트 조회:** 요청 IP가 `IpBlacklist` DB에 있는지 최우선 확인. 존재 시 `403 IP_BLACKLISTED` 즉각 거부.
2. **일일 한도 검사:** 오늘 생성 횟수가 `DAILY_PAPER_LIMIT` (10회)에 도달했는지 확인. 초과 시 `429 DAILY_LIMIT_EXCEEDED` 거부.
3. **단기 생성 임계값 검사 (인메모리 세션):**
   * 1분 내 생성 시도 3회 이상 시 `429 PAPER_RATE_LIMIT_1MIN` 거부.
   * 5분 내 생성 시도 6회 이상 시 `429 PAPER_RATE_LIMIT_5MIN` 거부.
4. **자동 차단(Auto Ban) 연동:** 3번 단기 임계값 위반 발생 시 즉시 해당 IP의 위반 횟수를 `IpActivity`에 누적 기록하고 차단 규칙 작동:
   * **최근 24시간 내 위반 횟수 5회 이상:** 7일간 장기 차단 (`expiresAt` = 현재 + 168시간).
   * **오늘 위반 횟수 3회 이상:** 24시간 단기 차단 (`expiresAt` = 현재 + 24시간).

#### [메시지 작성 통제 필터]
1. **역할 필터 (주인 작성 금지):** 요청 바디에 `creatorToken`이 존재하면 `403 CREATOR_NOT_ALLOWED` 거부 (생성자는 본인의 롤링페이퍼에 작성 불가).
2. **단기 작성 임계값 검사 (인메모리 세션):**
   * 1분 내 메시지 작성 3회 이상 시 `429 MESSAGE_RATE_LIMIT_1MIN` 거부.
   * 5분 내 메시지 작성 5회 이상 시 `429 MESSAGE_RATE_LIMIT_5MIN` 거부.
3. **중복 내용 도배 방지:** 직전에 전송한 메시지와 동일한 내용으로 연속 전송을 시도할 경우 `400 DUPLICATE_CONTENT` 거부.

### ③ 관리자 API 인증 미들웨어 (`adminAuth`)
* **동작:** `/api/admin/*` 하위 경로에 진입 시 HTTP Header의 `x-admin-api-key` 값을 확인.
* **대조값:** 환경 변수 `ADMIN_API_KEY` (지정되지 않은 경우 하드코딩된 기본값 `r-paper-admin-secret-key-2024` 사용). 불일치 시 `401 ADMIN_UNAUTHORIZED` 즉시 반환.

---

## 🌐 3. API 엔드포인트 명세

### 📬 일반 사용자 API (Public API)

#### 1. 롤링페이퍼 생성
* **엔드포인트:** `POST /api/papers`
* **요청 바디:** `{ "title": "페이퍼 제목" }` (생략 가능, 최대 40자)
* **응답 (210 Created):**
  ```json
  {
    "success": true,
    "data": {
      "slug": "AbCDeFg1",
      "title": "페이퍼 제목",
      "theme": "theme_basic",
      "expiresAt": "2026-06-30T13:00:00.000Z",
      "creatorToken": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
  ```

#### 2. 롤링페이퍼 메타 정보 조회
* **엔드포인트:** `GET /api/papers/:slug`
* **응답 (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "slug": "AbCDeFg1",
      "title": "페이퍼 제목",
      "theme": "theme_basic",
      "expiresAt": "2026-06-30T13:00:00.000Z",
      "createdAt": "2026-06-20T13:00:00.000Z"
    }
  }
  ```

#### 3. 특정 페이퍼의 메시지 페이징 목록 조회
* **엔드포인트:** `GET /api/papers/:slug/messages?page=1&limit=10`
* **응답 (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "messages": [
        {
          "_id": "60b9b3e1b3f1c1234567890a",
          "content": "메시지 내용입니다.",
          "createdAt": "2026-06-20T13:10:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalCount": 1,
        "hasMore": false
      }
    }
  }
  ```

#### 4. 메시지 남기기
* **엔드포인트:** `POST /api/messages`
* **요청 바디:** `{ "slug": "AbCDeFg1", "content": "남길 텍스트", "creatorToken": null }`
* **응답 (211 Created):**
  ```json
  {
    "success": true,
    "data": {
      "message": {
        "_id": "60b9b3e1b3f1c1234567890a",
        "content": "남길 텍스트",
        "createdAt": "2026-06-20T13:10:00.000Z"
      }
    }
  }
  ```

---

### 👑 관리자 전용 API (Admin API, `x-admin-api-key` 필수)

#### 1. 블랙리스트 전체 조회
* **엔드포인트:** `GET /api/admin/blacklist?page=1&limit=20`

#### 2. 특정 IP 수동 차단 등록
* **엔드포인트:** `POST /api/admin/blacklist`
* **요청 바디:** `{ "ip": "1.2.3.4", "description": "악성 도배 유저 차단", "durationHours": 24 }`

#### 3. 특정 IP 차단 해제
* **엔드포인트:** `DELETE /api/admin/blacklist/:ip`

#### 4. 금일 통계 대시보드 데이터 조회
* **엔드포인트:** `GET /api/admin/stats`
* **반환 항목:** 오늘 생성된 전체 페이퍼 수, 오늘 발생한 총 레이트 리밋 위반 수, 오늘 접속한 유니크 IP 수, 누적 블랙리스트 등록 수, 오늘 생성 및 위반이 가장 많은 헤비 유저/위반 IP TOP 10.

#### 5. 특정 IP의 최근 상세 이력 조회
* **엔드포인트:** `GET /api/admin/ip/:ip`
* **반환 항목:** 블랙리스트 차단 여부/사유, 최근 7일간 일별 생성 및 위반 횟수, 이 IP가 작성/생성한 누적 페이퍼 수.
