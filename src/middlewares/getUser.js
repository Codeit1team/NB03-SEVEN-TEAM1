import { PrismaClient } from "@prisma/client";
import { isPasswordValid } from '#utils/passwordUtil.js';

const prisma = new PrismaClient();

export const getUser = async (req, res, next) => {
  const { authorNickname, authorPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        nickname: authorNickname,
      },
    });

    if (!user) {
      return res.status(401).json({ message: '그룹에 존재하지않는 참여자 입니다다' });
    }

    if (!isPasswordValid(authorPassword, user.password)) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
    }

    req.body.authorId = user.id;
    next();
  } catch (err) {
    err.status = 500;
    err.message = '서버 통신에 문제가 생겼습니다';
    next(err);
  }
};