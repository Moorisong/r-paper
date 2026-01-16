# 💌 Haroo Paper - 마음을 전하는 온라인 롤링페이퍼

**Haroo Paper**는 로그인 없이 누구나 쉽고 빠르게 롤링페이퍼를 만들고 친구들과 공유할 수 있는 웹 서비스입니다. 소중한 마음을 담은 메시지를 주고받아보세요!


## ✨ 주요 기능

- **👆 간편한 생성**: 로그인 없이 3초 만에 나만의 롤링페이퍼를 만들 수 있습니다.
- **🔗 쉬운 공유**: 생성된 링크만 있으면 누구나 들어와서 메시지를 남길 수 있습니다.
- **🎨 감성적인 디자인**: 부드러운 애니메이션과 깔끔한 UI로 사용자 경험을 높였습니다.
- **🛡️ 링크 보관 UX**: 링크를 잃어버리지 않도록 강력한 복사 유도 시스템(모달, 배너)을 제공합니다.
- **⏱️ 자동 소멸**: 모든 데이터는 생성 후 10일 뒤에 자동으로 삭제되어 부담 없이 사용할 수 있습니다.

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React Hooks (Custom Hooks)
- **Networking**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Security**: CORS, Helmet, Rate Limiting

### DevOps & Tools
- **Deployment**: Nginx, PM2
- **Automation**: Shell Scripts (`deploy-frontend.sh`, `deploy-server.sh`)

## 📂 프로젝트 구조

```bash
r-paper/
├── backend/            # Express 서버 및 API
│   ├── models/         # MongoDB 스키마 (RollingPaper, Message)
│   ├── routes/         # API 라우트
│   └── server.js       # 서버 진입점
├── frontend/           # React 클라이언트
│   ├── src/
│   │   ├── components/ # 재사용 가능한 UI 컴포넌트
│   │   ├── hooks/      # 커스텀 훅 (API 통신 등)
│   │   ├── pages/      # 라우트 페이지
│   │   └── constants/  # 상수 및 메시지 관리
│   └── vite.config.js  # Vite 설정
├── docs/               # 기획 및 설계 문서
├── nginx/              # Nginx 설정 파일
└── scripts/            # 배포 스크립트
```

## 🚀 설치 및 실행 방법

### 1. 레포지토리 클론
```bash
git clone https://github.com/Start-Haroo/r-paper.git
cd r-paper
```

### 2. 환경 변수 설정
**Backend (.env)**
`backend/.env` 파일을 생성하고 다음 내용을 입력하세요.
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

**Frontend (.env)**
`frontend/.env` 파일을 생성하고 다음 내용을 입력하세요.
```env
VITE_API_URL=http://localhost:5001
```

### 3. 패키지 설치 및 실행

**Backend**
```bash
cd backend
npm install
npm run dev
# Server running on http://localhost:5001
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```


