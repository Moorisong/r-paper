# 📝 백엔드 환경 및 세팅 구성 (`backend_env.md`)

본 문서는 **Haroo Paper** 프로젝트의 백엔드 개발 및 빌드 환경 구성을 위한 기술 세팅 사양을 다룹니다.

---

## 🛠️ 1. 개발 런타임 및 프레임워크 버전

* **런타임 환경:** Node.js (CommonJS 패키지 모델)
* **주요 웹 프레임워크:** Express.js (`v5.2.1` 이상)
* **데이터베이스 ORM:** Mongoose (`v9.1.3` 이상)

---

## 📦 2. 핵심 의존성 패키지 명세

### 🟢 Backend Dependencies (`backend/package.json`)
* **`express` (^5.2.1):** REST API 서버 구동 및 엔드포인트 라우팅
* **`mongoose` (^9.1.3):** MongoDB와의 데이터 매핑 및 ODM 모델 정의
* **`cors` (^2.8.5):** 프론트엔드 도메인 등의 외부 요청을 허용하기 위한 CORS(Cross-Origin Resource Sharing) 설정
* **`express-rate-limit` (^8.2.1):** 무차별 요청(Brute Force / DoS) 방지를 위한 IP 기반 요청 횟수 제한 미들웨어
* **`dotenv` (^17.2.3):** 외부 `.env` 설정 파일 로드
* **`nodemon` (devDependencies, ^3.1.11):** 코드 변경 시 자동으로 서버 프로세스를 재구동하는 개발 유틸리티

---

## 🚀 3. 로컬 개발 및 구동 명령어 레시피

### 🟢 Backend 실행
```bash
cd backend
npm install
npm run dev # nodemon 기반 실시간 갱신 구동
```
* **구동 확인 포트:** 기본값 `http://localhost:5000` (또는 지정된 포트)

---

## 🔑 4. 필수 환경 변수 (`.env`) 명세

보안과 직결되는 환경 변수 목록으로, 실제 운영 서버의 민감한 비밀번호 정보(값)는 여기에 작성하지 않습니다.

### 🟢 Backend 환경 변수 (`backend/.env`)
* **`PORT`**: 백엔드 API 서버가 리스닝할 포트 번호 (예: `5000` 또는 `5001`)
* **`MONGODB_URI`**: MongoDB Atlas 또는 로컬 MongoDB 인스턴스의 연결 문자열 (URI)
* **`ADMIN_API_KEY`**: 관리자 권한용 API(차단 정보 조회, 통계 등) 인증에 사용할 시크릿 키 문자열
