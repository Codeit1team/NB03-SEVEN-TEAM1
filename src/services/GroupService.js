import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const createTag = async (req, res, next) => {
  try {
    //태그 유효성 검사 넣어야하나?
    const { id: groupId } = req.params;
    const { name = [] } = req.body;

    const tagData = name.map((tagName) => ({
      name: tagName,
      groupId: Number(groupId),
    }))

    const tag = await prisma.tag.create({
      data: tagData
    })
  } catch (error) {
    if (error?.name === 'StructError') {
      return res.status(400).end()
    }
  }
}

export default { createTag }