# NB03-SEVEN-TEAM1

##### [팀 협업 문서](https://docs.google.com/spreadsheets/d/1RjmFuiSnZA_rl31L6QnpKLuEhtjjX0h8l22q1DcvuAw/edit?usp=sharing)

팀원 구성
[조영욱](https://github.com/youngwookjo) 
[박재성](https://github.com/qkrwotjd1731)
[김나연](https://github.com/luciakim22)
[유진호](https://github.com/selentia)
  
프로젝트 소개   
운동 인증과 그룹 활동, 랭킹 시스템을 결합한 건강 커뮤니티 플랫폼 SEVEN의 백엔드 시스템 구축
<br>프로젝트 기간: 2025.06.26 ~ 2025.07.15

기술 스택   
| 구분          | 사용 기술 및 도구                                                    |
|---------------|---------------------------------------------------------------------|
| Backend       | Express.js, PrismaORM, helmet, dotenv, multer, axios, bcrypt        |
| Database      | PostgreSQL                                                          |
| Server        | Nginx                                                               |
| 공통 Tool     | Git & Github, Discord, Google Sheet, Google Docs, Postman           |

팀원별 구현 기능 상세

| 이름     | 구현 기능 |
|----------|-----------|
| **조영욱** | • 기록 정보 유효성 검사  <br> • 기록 등록  <br> • 기록 목록 조회  <br> • 기록 랭킹 조회  <br> • 그룹 추천(좋아요/취소) 
| **박재성** | • 그룹 정보 유효성 검사 <br> • 그룹 등록  <br> • 그룹 목록 조회  <br> • 그룹 상세 조회  <br> • 그룹 수정  <br> • 그룹 삭제  <br> • 그룹 참여(유저 추가)  <br> • 그룹 참여 취소
| **김나연** | • 태그 유효성 검사 <br> • 기록 상세 조회  <br> • 태그 목록 조회  <br> • 태그 상세 조회
| **유진호** | • 프로젝트 환경 구축 및 관리(app.js, Prisma, alias, 환경변수, 배포/도메인)  <br> • 공통 함수/유틸/미들웨어/에러핸들러 작성  <br> • 그룹 배지 부여 함수  <br> • 프론트/배포 환경 연결  <br> • 목데이터 스크립트 추가  <br> • DB 연결  <br> • upload 미들웨어 작성/추가 처리 |


Tree
```
┌── .env
├── .env.example
├── .gitignore
├── jsconfig.json
├── package-lock.json
├── package.json
├── README.md
├── src
│   ├── app.js
│   ├── controllers
│   │   ├── groupController.js
│   │   ├── rankingController.js
│   │   └── recordController.js
│   ├── middlewares
│   │   ├── errorHandler.js
│   │   ├── getUser.js
│   │   ├── upload.js
│   │   ├── validateGroup.js
│   │   ├── validateParticipant.js
│   │   ├── validatePassword.js
│   │   └── validateRecord.js
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes
│   │   ├── groupRoutes.js
│   │   ├── rankingRoutes.js
│   │   ├── recordRoutes.js
│   │   └── tagRoutes.js
│   ├── services
│   │   ├── GroupService.js
│   │   ├── RankingService.js
│   │   └── RecordService.js
│   └── utils
│       ├── deleteUploadedFiles.js
│       ├── grantGroupBadge.js
│       ├── passwordUtil.js
│       └── sendDiscordWebhook.js
└── uploads
```


## 구현 홈페이지  
[SEVEN](https://seven.mimu.live/)  


## 프로젝트 회고록
[최종발표자료](https://docs.google.com/presentation/d/1qzsbEA9enE0oHnuUmQvsZSGckHp4L70ZbRnQZVFCXwc/edit?usp=sharing)
