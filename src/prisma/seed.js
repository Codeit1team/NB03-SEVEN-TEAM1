import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const main = async () => {
  await prisma.record.deleteMany({})

  const oldGroups = await prisma.group.findMany({ select: { id: true } })
  for (const group of oldGroups) {
    await prisma.group.update({
      where: { id: group.id },
      data: { tags: { set: [] } },
    })
  }

  await prisma.tag.deleteMany({})
  await prisma.participant.deleteMany({})
  await prisma.group.deleteMany({})

  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Participant_id_seq" RESTART WITH 1;')
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Group_id_seq" RESTART WITH 1;')
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Record_id_seq" RESTART WITH 1;')
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Tag_id_seq" RESTART WITH 1;')

  const groupTags = [
    ['러닝', '건강', '아침'],
    ['자전거', '월루좋아'],
    ['수영', '시원해요'],
    ['수영', '자전거'],
    ['태그1', '태그2', '러닝'],
  ]

  const tagSet = new Set(groupTags.flat())
  const tagMap = {}
  for (const name of tagSet) {
    tagMap[name] = await prisma.tag.create({ data: { name } })
  }

  // 7. 해시 예시
  const hashExample = [
    '$2a$10$GA3d/3lmqt3XxEgg2yCTreP/ccMEgZuWVeV2HXmAbFZ8K36RMNata', // 고양이좋아
    '$2a$10$Sg3T8td/UafnHwQ7nyYVy.N8hQjyNehZicbKfvC1XLy7qbBsBQGMS', // 김치찌개
    '$2a$10$Peg43X4UiEzfdxUdntNBG.DQCmtXHaZhgNB.dhFCsUaymTj0lcDlK', // 비빔밥
    '$2a$10$fk.7wqVDH.YCzin1qUiUqe/k6D6ZIW5rLRprcLjK/8NmLKTh2mzsa', // 만두
    '$2a$10$lmaXBAqoDmKF5/8uiXPrh.pMr1kMg47biaKaDuRi0jbnnbCbBtKrG', // 라면
    '$2a$10$1ObpeVrqGQFTyWsIhQ3AGOjyLSbfM5AFFjV3.nZ8PFl22a6LShVka', // 슈퍼노바
  ]

  const [user1, user2, user3, user4, user5, user6] = await Promise.all([
    prisma.participant.create({ data: { nickname: '고양이좋아', password: hashExample[0] } }),
    prisma.participant.create({ data: { nickname: '김치찌개', password: hashExample[1] } }),
    prisma.participant.create({ data: { nickname: '육회비빔밥', password: hashExample[2] } }),
    prisma.participant.create({ data: { nickname: '고기만두', password: hashExample[3] } }),
    prisma.participant.create({ data: { nickname: '이터널리턴', password: hashExample[4] } }),
    prisma.participant.create({ data: { nickname: '슈퍼노바', password: hashExample[5] } }),
  ])

  const groupDatas = [
    {
      name: '얼리버드',
      description: '출근 전에 뛰어요',
      photoUrl: 'https://example.com/photo.png',
      goalRep: 50,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 10,
      ownerId: user1.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10', 'RECORD_100'],
      tags: groupTags[0],
    },
    {
      name: '월루 좋아',
      description: '재택하면서 몰래 실내 자전거를 타요',
      photoUrl: 'https://example.com/photo2.png',
      goalRep: 60,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 5,
      ownerId: user3.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10'],
      tags: groupTags[1],
    },
    {
      name: '어푸어푸',
      description: '수영 그룹입니다.\n근데 이거 줄바꿈 되나요?',
      photoUrl: 'https://example.com/photo3.png',
      goalRep: 70,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 15,
      ownerId: user4.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10'],
      tags: groupTags[2],
    },
    {
      name: '좋아요가 100개인 그룹',
      description: '좋아요 배지 테스트',
      photoUrl: 'https://example.com/photo4.png',
      goalRep: 40,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 100,
      ownerId: user5.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10', 'LIKE_100'],
      tags: groupTags[3],
    },
    {
      name: '배지가 다 있는 그룹',
      description: '매우 풍성함',
      photoUrl: 'https://example.com/photo5.png',
      goalRep: 120,
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 150,
      ownerId: user6.id,
      recordCount: 0,
      badges: ['PARTICIPATION_10', 'RECORD_100', 'LIKE_100'],
      tags: groupTags[4],
    },
  ]

  const groupList = []
  for (const g of groupDatas) {
    const group = await prisma.group.create({
      data: {
        name: g.name,
        description: g.description,
        photoUrl: g.photoUrl,
        goalRep: g.goalRep,
        discordWebhookUrl: g.discordWebhookUrl,
        discordInviteUrl: g.discordInviteUrl,
        likeCount: g.likeCount,
        ownerId: g.ownerId,
        recordCount: g.recordCount,
        badges: g.badges,
        tags: {
          connect: g.tags.map(tagName => ({ id: tagMap[tagName].id }))
        },
      }
    })
    groupList.push(group)
  }

  const ownedGroupPairs = [
    [user1, groupList[0]],
    [user3, groupList[1]],
    [user4, groupList[2]],
    [user5, groupList[3]],
    [user6, groupList[4]],
  ]
  for (const [user, group] of ownedGroupPairs) {
    await prisma.participant.update({
      where: { id: user.id },
      data: { ownedGroup: { connect: { id: group.id } } },
    })
  }

  await prisma.record.createMany({
    data: [
      {
        exerciseType: 'RUN',
        description: '아침 러닝 5km',
        time: 1800000,
        distance: 5.0,
        photos: ['https://example.com/run1.png'],
        authorId: user1.id,
      },
      {
        exerciseType: 'BIKE',
        description: '자전거 10km',
        time: 2700000,
        distance: 10.0,
        photos: ['https://example.com/bike1.png'],
        authorId: user2.id,
      },
      {
        exerciseType: 'SWIM',
        description: '수영 5km',
        time: 1800000,
        distance: 5.0,
        photos: ['https://example.com/swim1.png'],
        authorId: user3.id,
      },
      {
        exerciseType: 'RUN',
        description: '아침 러닝 5km(2)',
        time: 1800000,
        distance: 5.0,
        photos: ['https://example.com/run2.png'],
        authorId: user4.id,
      },
      {
        exerciseType: 'RUN',
        description: '아침 러닝 5km(3)',
        time: 1800000,
        distance: 5.0,
        photos: ['https://example.com/run3.png'],
        authorId: user5.id,
      },
      {
        exerciseType: 'BIKE',
        description: '라이딩 기록',
        time: 2100000,
        distance: 7.0,
        photos: ['https://example.com/bike2.png'],
        authorId: user6.id,
      },
    ],
  })

  console.log('🌱 Seed Complete')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })