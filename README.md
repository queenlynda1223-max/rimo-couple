# RIMO - 커플 미니홈 플랫폼

커플을 위한 디지털 공간 제공 서비스로, 개인 미니룸과 공동 커플룸을 통해 소통과 추억 공유를 지원합니다.

## 기능

- **회원가입/로그인** - 이메일 기반 인증 (JWT)
- **미니미** - 아바타 커스터마이징 (표정, 헤어, 의상)
- **미니룸** - 개인 공간 꾸미기 (배경, 상태 메시지)
- **커플룸** - 초대 코드로 연결, 함께 꾸미는 공유 공간
- **게시판** - 글 작성/수정/삭제
- **일정 관리** - 캘린더 기반 일정 등록
- **할 일** - 체크리스트 관리
- **실시간 동기화** - WebSocket 기반

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 14, React, Tailwind CSS, TanStack Query, Zustand |
| Backend | NestJS, TypeORM, PostgreSQL |
| Real-time | Socket.IO |
| Auth | JWT, bcrypt |

## 시작하기

### 사전 요구사항

- Node.js 18+
- Docker & Docker Compose (PostgreSQL용)

### 설치

```bash
# 1. DB 실행
docker-compose up -d

# 2. 의존성 설치
cd backend && npm install
cd ../frontend && npm install

# 3. 백엔드 실행 (http://localhost:4000)
cd backend && npm run start:dev

# 4. 프론트엔드 실행 (http://localhost:3000)
cd frontend && npm run dev
```

### 환경 변수

`backend/.env` 파일에서 설정할 수 있습니다:

| 변수 | 기본값 | 설명 |
|------|--------|------|
| DATABASE_HOST | localhost | PostgreSQL 호스트 |
| DATABASE_PORT | 5432 | PostgreSQL 포트 |
| DATABASE_USER | rimo_user | DB 사용자 |
| DATABASE_PASSWORD | rimo_password | DB 비밀번호 |
| DATABASE_NAME | rimo_db | DB 이름 |
| JWT_SECRET | rimo-jwt-secret | JWT 시크릿 키 |
| PORT | 4000 | 백엔드 포트 |
| FRONTEND_URL | http://localhost:3000 | 프론트엔드 URL |

## 프로젝트 구조

```
rimo_project/
├── backend/              # NestJS 백엔드
│   └── src/
│       ├── auth/         # 인증 모듈
│       ├── users/        # 사용자 모듈
│       ├── minime/       # 미니미 모듈
│       ├── rooms/        # 룸 관리 모듈
│       ├── posts/        # 게시판 모듈
│       ├── schedules/    # 일정 모듈
│       ├── todos/        # 할 일 모듈
│       ├── media/        # 미디어 업로드 모듈
│       ├── gateway/      # WebSocket 게이트웨이
│       └── entities/     # TypeORM 엔티티
├── frontend/             # Next.js 프론트엔드
│   └── src/
│       ├── app/          # App Router 페이지
│       ├── components/   # 공통 컴포넌트
│       ├── lib/          # API, 유틸리티
│       ├── store/        # Zustand 스토어
│       └── types/        # TypeScript 타입
└── docker-compose.yml    # Docker 설정
```
