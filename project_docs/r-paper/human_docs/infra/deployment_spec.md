# 🏠 6. 홈서버 및 배포 인프라 명세 (`deployment_spec.md`)

본 문서는 **Haroo Paper** 백엔드와 프론트엔드의 타겟 배포 인프라 사양 및 배포 자동화 셸 스크립트의 작동 로직을 다룹니다.

---

## 🖥️ 1. 배포 대상 인프라 환경 사양

* **운영체제:** Ubuntu Server (LTS)
* **웹서버 (Reverse Proxy):** Nginx (`www-data` 권한 적용)
* **인증서 관리:** Let's Encrypt SSL/TLS 적용 (`r-paper-web.haroo.site`)
* **Node 프로세스 관리자:** PM2

---

## 🛠️ 2. 서버 SSH 접속 환경 정보

배포 스크립트는 실행 옵션에 따라 로컬망(사내/가정) 및 외부망(원격) 접속 경로를 동적으로 스위칭합니다.

| 접속 모드 | 대상 IP/호스트 | SSH 포트 | 접속 계정 (User) |
| :--- | :--- | :---: | :--- |
| **로컬 배포 (기본값)** | `192.168.0.6` | `22` | `ksh` |
| **원격 배포 (`--external` 옵션)** | `125.190.25.48` | `2222` | `ksh` |

---

## 📂 3. 서버 디렉토리 구조 및 권한 매핑

### 🟢 Backend (PM2 구동부)
* **소스 경로:** `/home/ksh/r-paper/backend`
* **프로세스 제어:** PM2 클러스터 런타임 제어 (`pm2 restart all` 호출)

### 🔵 Frontend (Nginx 정적 파일 호스팅부)
* **배포 루트 디렉토리:** `/home/ksh/srv/r-paper-web`
* **웹 루트 경로 (Nginx Root):** `/home/ksh/srv/r-paper-web/dist`
* **백업 경로:** `/home/ksh/srv/r-paper-web/backups` (과거 빌드 백업본 5개 순환 유지)
* **권한 규격:** 소유자 `www-data:www-data`, 디렉토리 및 파일 권한 `755` (Nginx 접근권한 보장)

---

## 🚀 4. 원클릭 배포 자동화 프로세스

### ① Backend 배포 프로세스 (`backend/deploy-backend.sh`)
로컬 컴퓨터(Mac)에서 아래 명령을 내려 서버의 백엔드를 업데이트합니다.
```bash
# 로컬 배포
./deploy-backend.sh

# 원격 포트/IP 배포
./deploy-backend.sh --external
```
* **작동 메커니즘:**
  1. SSH 포트 연결 테스트 및 타겟 서버 접속.
  2. 서버 상의 `/home/ksh/r-paper/backend` 폴더로 이동.
  3. Git 브랜치 감지 후 `git pull` 자동 수행.
  4. `npm install`을 호출하여 신규 패키지 및 보안 패치 종속성 설치.
  5. PM2 프로세스 재시작 명령(`pm2 restart all`) 원격 터미널 실행.

### ② Frontend 배포 프로세스 (`frontend/deploy-frontend.sh`)
로컬에서 빌드 후 서버로 압축 전송하여 가동 중인 서비스 중단(Zero-downtime Nginx reload) 없이 배포를 끝마칩니다.
```bash
# 전체 빌드 및 서버 배포 과정 일괄 수행
./deploy-frontend.sh --full
```
* **작동 메커니즘:**
  1. **로컬 빌드:** `npm run build`를 실행하여 정적 번들 `dist/` 생성.
  2. **압축:** Mac 전용 메타데이터 쓰레기 파일을 지우고 압축 (`tar -czf dist.tar.gz dist/`).
  3. **전송:** SSH `scp` 프로토콜을 통해 서버 임시 디렉토리 `/tmp/`로 압축본 전달.
  4. **원격 백업:** 서버에 가동 중이던 기존 `dist/` 폴더를 타임스탬프(`dist_backup_YYYYMMDD_HHMMSS`)와 함께 백업 디렉토리로 이동. (최근 5개의 백업만 남겨두고 초과분 자동 폐기)
  5. **압축 해제:** 압축파일을 `/home/ksh/srv/r-paper-web/dist`로 해제 이동.
  6. **권한 수정:** 소유자를 `www-data:www-data`로 교체하고 권한을 `755`로 설정.
  7. **웹서버 재가동:** `nginx -t`로 설정을 자가 진단한 뒤 정상인 경우 `systemctl reload nginx`를 무중단 실행.

---

## 🔄 5. 비상 롤백(Rollback) 정책

프론트엔드 배포에 심각한 오류가 생겼을 경우, 서버의 백업 폴더를 뒤져 수 초 내에 구버전으로 즉각 롤백할 수 있습니다.
```bash
./deploy-frontend.sh --rollback
```
* **동작:** 서버의 사용 가능한 백업 리스트(최근 10개)를 날짜순으로 나열해 보여준 뒤, 사용자가 롤백할 백업 폴더명(예: `dist_backup_20260620_130000`)을 콘솔에 입력하면, 즉시 가동 중인 `dist/`를 지우고 백업본으로 복사 대체 후 Nginx를 무중단 리로드합니다.

---

## 🔒 6. Nginx 설정 파일 매핑 정보

Nginx가 static 웹 리소스를 서비스하기 위해 로드하는 설정 구조입니다.
* **설정 파일 실체:** `/etc/nginx/sites-available/r-paper-web.haroo.site`
* **활성화 링크:** `/etc/nginx/sites-enabled/r-paper-web.haroo.site`
