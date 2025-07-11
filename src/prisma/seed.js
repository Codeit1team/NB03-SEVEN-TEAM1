import dotenv from 'dotenv';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 환경 변수 로드
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;
const BASE_URL = isProd
  ? process.env.BASE_URL
  : `${process.env.BASE_URL_DEV}:${PORT}`;

// 이미지 경로 생성 (0~11.png)
const testImages = Array.from({ length: 11 }, (_, i) => `${BASE_URL}/api/files/${i}.png`);

const main = async () => {
  // 기존 데이터 초기화 및 시퀀스 리셋
  await prisma.record.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.participant.deleteMany({});
  await prisma.tag.deleteMany({});

  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Participant_id_seq" RESTART WITH 1;');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Group_id_seq" RESTART WITH 1;');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Record_id_seq" RESTART WITH 1;');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Tag_id_seq" RESTART WITH 1;');

  // 테스트용 해시 배열
  const hashExample = [
    '$2a$10$SKxnFpbrTvpj4SCad/4vgeOksAzvskS/x0o09z.CO52ZcH3FaLW4m', // 1234 - 고양이좋아
    '$2a$10$ooYN9QFXzJz9vMMdgo1zJOa4QIE2at4WrJxHhI6cPMaynOgnsis9G', // 250709 - 김치찌개
    '$2a$10$VUIL12brtxJjKyLxBxJYZuPrOaMwD02F1H1aArd8EbLIK9KNUxk5.', // 124065 - 육회비빔밥
    '$2a$10$oTiLKKrLCfsL1cNMtsfpxOniYQByGJFERpj29dJXIR9cbU2OFmL3C', // 1q2w3e - 고기만두
    '$2a$10$mFS/JkxuDHX0HWfEMUIbP.9WIFFOQUw73NKRMdJoTFaWZdgS5dyaK', // 1q2w - 이터널리턴
    '$2a$10$zQnlzGtMbweWLATYckD80OIy6084Pzu.9lNDMaIdnoYUrvuV7Vcnm', // sktt1faker - 슈퍼노바
  ]

  // participant 생성(6)
  const user1 = await prisma.participant.create({
    data: {
      nickname: '고양이좋아',
      password: hashExample[0],
    },
  })

  const user2 = await prisma.participant.create({
    data: {
      nickname: '김치찌개',
      password: hashExample[1],
    },
  })

  const user3 = await prisma.participant.create({
    data: {
      nickname: '육회비빔밥',
      password: hashExample[2],
    },
  })

  const user4 = await prisma.participant.create({
    data: {
      nickname: '고기만두',
      password: hashExample[3],
    },
  })

  const user5 = await prisma.participant.create({
    data: {
      nickname: '이터널리턴',
      password: hashExample[4],
    },
  })

  const user6 = await prisma.participant.create({
    data: {
      nickname: '슈퍼노바',
      password: hashExample[5],
    },
  })

  // tag 생성(9)
  await prisma.tag.createMany({
    data: [
      { name: '러닝' },
      { name: '건강' },
      { name: '아침' },
      { name: '자전거' },
      { name: '월루좋아' },
      { name: '수영' },
      { name: '시원해요' },
      { name: '태그1' },
      { name: '태그2' },
    ],
    skipDuplicates: true,
  });

  // group 생성(5)
  const group1 = await prisma.group.create({
    data: {
      name: '얼리버드',
      description: '출근 전에 뛰어요',
      photoUrl: testImages[0],
      goalRep: 50,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 10,
      tags: { connect: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      ownerId: user1.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10', 'RECORD_100'],
    },
  });

  const group2 = await prisma.group.create({
    data: {
      name: '월루 좋아',
      description: '재택하면서 몰래 실내 자전거를 타요',
      photoUrl: testImages[1],
      goalRep: 60,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 5,
      tags: { connect: [{ id: 4 }, { id: 5 }] },
      ownerId: user3.id,
      recordCount: 0,
      badges: [],
    },
  });

  const group3 = await prisma.group.create({
    data: {
      name: '🌀또🌀물보라를🌀일으켜🌀',
      description: '..다.다다..🐬...다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다......다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다...🌀일으켜🌀🌀 ..다.다다..🐬...다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다......다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀 ..다.다다..🐬...다다다...🌀🌀또🌀물보라를🌀일으켜🌀🌀',
      photoUrl: testImages[2],
      goalRep: 70,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 15,
      tags: { connect: [{ id: 6 }, { id: 7 }] },
      ownerId: user4.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10'],
    },
  });

  const group4 = await prisma.group.create({
    data: {
      name: '좋아요가 100개인 그룹',
      description: '좋아요 배지 테스트',
      photoUrl: testImages[3],
      goalRep: 40,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 100,
      tags: { connect: [{ id: 6 }, { id: 4 }] },
      ownerId: user5.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10', 'LIKE_100'],
    },
  });

  const group5 = await prisma.group.create({
    data: {
      name: '배지가 다 있는 그룹',
      description: '매우 풍성함',
      photoUrl: testImages[4],
      goalRep: 120,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 150,
      tags: { connect: [{ id: 8 }, { id: 9 }, { id: 1 }] },
      ownerId: user6.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10', 'RECORD_100', 'LIKE_100'],
    },
  });

  // 참가자 groupId 할당
  await Promise.all([
    prisma.participant.update({ where: { id: user1.id }, data: { groupId: group1.id } }),
    prisma.participant.update({ where: { id: user2.id }, data: { groupId: group1.id } }),
    prisma.participant.update({ where: { id: user3.id }, data: { groupId: group2.id } }),
    prisma.participant.update({ where: { id: user4.id }, data: { groupId: group3.id } }),
    prisma.participant.update({ where: { id: user5.id }, data: { groupId: group4.id } }),
    prisma.participant.update({ where: { id: user6.id }, data: { groupId: group5.id } }),
  ]);

  // record 생성(6)
    await prisma.record.createMany({
    data: [
      {
        exerciseType: 'run',
        description: '아침 러닝 5km',
        time: 1800,
        distance: 5.0,
        photos: [testImages[5]],
        authorId: user1.id,
      },
      {
        exerciseType: 'bike',
        description: '자전거 10km',
        time: 3600,
        distance: 10.0,
        photos: [testImages[6]],
        authorId: user2.id,
      },
      {
        exerciseType: 'swim',
        description: '수영 5km',
        time: 1400,
        distance: 5.0,
        photos: [testImages[7]],
        authorId: user3.id,
      },
      {
        exerciseType: 'run',
        description: '아침 러닝 5km(2)',
        time: 1800,
        distance: 5.0,
        photos: [testImages[8]],
        authorId: user4.id,
      },
      {
        exerciseType: 'run',
        description: '아침 러닝 5km(3)',
        time: 1200,
        distance: 5.0,
        photos: [testImages[9]],
        authorId: user5.id,
      },
      {
        exerciseType: 'bike',
        description: '라이딩 기록',
        time: 2100,
        distance: 7.0,
        photos: [testImages[10]],
        authorId: user6.id,
      },
    ],
  })

  console.log('🌱 Seed Complete');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });