# Backend Agent Reference

## 📝 1. 연동 기획 명세 (`backend_spec.md`, `database_schema.md`, `backend_env.md`)
본 서비스(Haroo Paper)는 Node.js와 Express 프레임워크를 기반으로 구성된 단일 컨트롤러/라우터 계층의 백엔드를 사용합니다.
* MongoDB 및 Mongoose ODM을 사용하여 데이터베이스와 연동합니다.
* 전역 및 라우터 레벨의 정밀 어뷰징 차단(Rate Limiting & IP Blacklist) 필터 메커니즘을 포함하여 도배와 과부하를 방지합니다.
* 관리자 기능을 위한 시크릿 키 기반 인증(`x-admin-api-key`)을 제공합니다.
* 데이터베이스는 롤링페이퍼 및 메시지에 대해 Mongoose의 강력한 TTL 인덱스를 적용하여 일정 기간 후 데이터를 자동 삭제합니다.

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
백엔드 로직의 안정성과 무결성을 지키고, 보안 취약점과 시스템 과부하를 방지하기 위해 엄격한 라우팅 규칙 및 스키마 기반 접근 방식을 준수합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
* `backend/server.js`: 진입점, 글로벌 미들웨어 및 라우터 주입
* `backend/routes/`: 도메인별 라우터 분리
* `backend/models/`: MongoDB 콜렉션 Mongoose 스키마
* `backend/constants/`: 에러 코드 메시지 및 상수값
* `backend/utils/`: 범용 헬퍼 유틸리티 모듈

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **의존성 설치 및 환경 설정**: `backend_env.md` 명세에 따라 Express 환경 구동(`npm run dev`).
2. **모델 구성**: `models/` 내부에 Mongoose 스키마를 구성하고 필드 및 TTL, 복합 인덱스를 올바르게 정의합니다.
3. **라우팅 추가**: `routes/`에 라우터를 등록할 때 필수로 어뷰징 필터나 인증 미들웨어(Rate Limit)를 적용합니다.
4. **로직 처리 및 예외 전파**: 표준 JSON 에러 구조(`{ success: false, error: { code, message } }`)에 맞추어 클라이언트에 응답을 전송합니다.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 기준 300줄을 절대 초과할 수 없습니다. 라우터 파일이 방대해지면 컨트롤러와 서비스 계층으로 로직을 분리하십시오.
- **[플랫폼 락]:** 오직 Node.js + Express 환경의 코드로 구성합니다.
- **[하드코딩 금지]:** 데이터베이스 접속 URI(`MONGODB_URI`)나 포트 번호 등은 `.env` 및 `process.env`를 통해서만 접근 가능해야 합니다.
