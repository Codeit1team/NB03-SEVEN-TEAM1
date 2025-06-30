import { PrismaClient } from "@prisma/client";
import { isPasswordValid } from '#utils/passwordUtil.js';

const prisma = new PrismaClient();

export const getUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { authorNickname, authorPassword } = req.body;
    const user = await prisma.participant.findUnique({
      where: {
        groupId_nickname:{
          groupId: id,
          nickname: authorNickname
        }
      },
    });

    if (!user) {
      return res.status(401).json({ message: '그룹에 존재하지않는 참여자 입니다' });
    }
    const isValid = await isPasswordValid(authorPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
    }
    req.body.authorId = id
    next();
  } catch (err) {
    err.status = 500;
    err.message = '서버 통신에 문제가 생겼습니다';
    next(err);
  }
};