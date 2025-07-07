import { PrismaClient } from "@prisma/client";
import { isPasswordValid } from '#utils/passwordUtil.js';
import deleteUploadedFiles from "#utils/deleteUploadedFiles.js";

const prisma = new PrismaClient();

const getUser = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const { authorNickname, authorPassword } = req.body;
    const user = await prisma.participant.findUnique({
      where: {
        groupId_nickname: {
          groupId,
          nickname: authorNickname
        }
      },
    });

    if (!user) {
      if (req.files.photos) await deleteUploadedFiles(req.files.photos);
      return res.status(401).json({ message: '그룹에 존재하지않는 참여자 입니다' });
    }
    const isValid = await isPasswordValid(authorPassword, user.password);
    if (!isValid) {
      if (req.files.photos) await deleteUploadedFiles(req.files.photos);
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
    }
    req.body.authorId = user.id
    next();
  } catch (err) {
    if (req.files.photos) await deleteUploadedFiles(req.files.photos);
    err.status = 500;
    err.message = '서버 통신에 문제가 생겼습니다';
    next(err);
  }
};

export default getUser;
