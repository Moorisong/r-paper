# Backend Agent Reference

## ROLLING_PAPER_SPEC.md (docs/planning/ROLLING_PAPER_SPEC.md)

# RollingPacer – 10일 자동 소멸 롤링페이퍼 웹서비스 기획 문서

## 5. 자동 삭제 정책 (Backend Focus)
- 생성 10일 후 자동 삭제 (TTL Index)
- Message는 RollingPaper 삭제 시 연쇄 삭제되거나 접근 불가 처리

## 6. 데이터베이스 설계 (MongoDB)
### RollingPaper
- `slug` (Unique, 8 chars)
- `theme` (String) - 단일 테마 사용 (theme_basic)
- `expiresAt` (TTL Index)
### Message
- `paperId` (Reference)

## 7. 서버 아키텍처
- Backend: Express
- DB: MongoDB Atlas

## 14. 생성자 메시지 작성 제한
- **생성자**는 메시지 작성 불가 (방문자만 가능)
- 생성 시 `creatorToken` 발급 -> 클라이언트 저장
- 메시지 작성 API 요청 시 `creatorToken` 있으면 거부 (403)

---

## AI 작업 지침 (Backend)

### 목적
- 안정적이고 유지보수가 필요 없는 백엔드 API 서버 구축
- 자동 소멸(TTL) 로직 확인

### 작업 단계
1. **환경 설정**: Node.js/Python 등 서버 환경 및 DB(MongoDB) 연결
    - **환경변수**: 프로젝트 루트의 `.env` 파일에서 `MONGODB_URI` 로드
2. **DB 스키마 정의**:
    - `RollingPaper` (TTL 인덱스 필수, `theme` 필드 - 단일 테마 사용)
    - `Message`
3. **API 구현**:
    - `POST /api/papers`: 제목(선택) -> slug 생성 -> 저장 -> **`creatorToken` 반환 (UUID)**
    - `GET /api/papers/:slug`: 조회 (만료되었으면 404)
    - `GET /api/papers/:slug/messages`: 메시지 목록 조회
    - `POST /api/messages`: 메시지 저장 (paperId 검증). **요청에 `creatorToken` 포함 시 403 Forbidden 리턴**
4. **배포/운영 고려**:
    - CORS 설정
    - Rate Limiting (간단한 IP 기반)

### 주의사항
- **복잡한 인증/인가 로직 구현 금지**
- **운영자 API 만들지 말 것** (DB 직접 접속 관리 전제)
- TTL 인덱스가 정확히 설정되었는지 확인
- Slug 생성 시 충돌 처리 (Retry 로직 등)
- **테마는 단일 테마(theme_basic)만 사용** - 랜덤 테마 시스템 없음
