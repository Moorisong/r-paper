# 📝 프론트엔드 환경 및 세팅 구성 (`frontend_env.md`)

본 문서는 **Haroo Paper** 프로젝트의 프론트엔드 개발 및 빌드 환경 구성을 위한 기술 세팅 사양을 다룹니다.

---

## 🛠️ 1. 개발 런타임 및 프레임워크 버전

* **런타임 환경:** Node.js (Vite 빌드 도구 기반 ES Module 시스템)
* **라이브러리:** React (`v19.2.0`), React DOM (`v19.2.0`)
* **라우팅:** React Router Dom (`v7.12.0`)

---

## 📦 2. 핵심 의존성 패키지 명세

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

### 🔵 Frontend 환경 변수 (`frontend/.env`)
* **`VITE_API_URL`**: 프론트엔드에서 API 요청을 보낼 대상 백엔드 서버의 주소 (예: `http://localhost:5000`)
