# 📝 1. 프로젝트 환경 및 세팅 구성 (`project_env.md`)

본 문서는 **Haroo Paper** 프로젝트의 개발 및 빌드 환경 구성을 위한 기술 세팅 사양을 다룹니다.

---

## 🛠️ 1. 개발 런타임 및 프레임워크 버전

### 🟢 Backend (서버)
* **런타임 환경:** Node.js (CommonJS 패키지 모델)
* **주요 웹 프레임워크:** Express.js (`v5.2.1` 이상)
* **데이터베이스 ORM:** Mongoose (`v9.1.3` 이상)

### 🔵 Frontend (클라이언트)
* **런타임 환경:** Node.js (Vite 빌드 도구 기반 ES Module 시스템)
* **라이브러리:** React (`v19.2.0`), React DOM (`v19.2.0`)
* **라우팅:** React Router Dom (`v7.12.0`)

---

## 📦 2. 핵심 의존성 패키지 명세

### 🟢 Backend Dependencies (`backend/package.json`)
* **`express` (^5.2.1):** REST API 서버 구동 및 엔드포인트 라우팅
* **`mongoose` (^9.1.3):** MongoDB와의 데이터 매핑 및 ODM 모델 정의
* **`cors` (^2.8.5):** 프론트엔드 도메인 등의 외부 요청을 허용하기 위한 CORS(Cross-Origin Resource Sharing) 설정
* **`express-rate-limit` (^8.2.1):** 무차별 요청(Brute Force / DoS) 방지를 위한 IP 기반 요청 횟수 제한 미들웨어
* **`dotenv` (^17.2.3):** 외부 `.env` 설정 파일 로드
* **`nodemon` (devDependencies, ^3.1.11):** 코드 변경 시 자동으로 서버 프로세스를 재구동하는 개발 유틸리티

### 🔵 Frontend Dependencies (`frontend/package.json`)
* **`react` & `react-dom` (^19.2.0):** 컴포넌트 렌더링 및 UI 조작
* **`react-router-dom` (^7.12.0):** SPA 클라이언트 사이드 라우팅 및 뷰 전환
* **`axios` (^1.13.2):** 백엔드 API와의 HTTP 통신 클라이언트
* **`tailwindcss` & `@tailwindcss/postcss` (^4.1.18):** 스타일링 및 CSS 빌드 유틸리티
* **`framer-motion` (^12.26.2):** 페이지/모달 전환 및 상호작용 애니메이션 제공
* **`vite` (devDependencies, ^7.2.4):** 개발 서버 작동 및 빌드 시스템 번들러
* **`eslint` (devDependencies, ^9.39.1):** 정적 코드 분석 및 린팅 툴

---

## 🚀 3. 로컬 개발 및 구동 명령어 레시피

### 🟢 Backend 실행
```bash
cd backend
npm install
npm run dev # nodemon 기반 실시간 갱신 구동
```
* **구동 확인 포트:** 기본값 `http://localhost:5000` (또는 지정된 포트)

### 🔵 Frontend 실행
```bash
cd frontend
npm install
npm run dev # Vite 개발 서버 구동
```
* **구동 확인 주소:** 기본값 `http://localhost:5173`

---

## 🔑 4. 필수 환경 변수 (`.env`) 명세

보안과 직결되는 환경 변수 목록으로, 실제 운영 서버의 민감한 비밀번호 정보(값)는 여기에 작성하지 않습니다.

### 🟢 Backend 환경 변수 (`backend/.env`)
* **`PORT`**: 백엔드 API 서버가 리스닝할 포트 번호 (예: `5000` 또는 `5001`)
* **`MONGODB_URI`**: MongoDB Atlas 또는 로컬 MongoDB 인스턴스의 연결 문자열 (URI)
* **`ADMIN_API_KEY`**: 관리자 권한용 API(차단 정보 조회, 통계 등) 인증에 사용할 시크릿 키 문자열

### 🔵 Frontend 환경 변수 (`frontend/.env`)
* **`VITE_API_URL`**: 프론트엔드에서 API 요청을 보낼 대상 백엔드 서버의 주소 (예: `http://localhost:5000`)
