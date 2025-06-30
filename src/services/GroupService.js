import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const createTag = async (req, res, next) => {
  try {
    //태그 유효성 검사 넣어야하나?
    const { id: groupId } = req.params;
    let { tagName } = req.body;

    if (typeof tagName === 'string') {
      tagName = [tagName]
    }

    const createdTags = []

    for (const name of tagName) {
      const tag = await prisma.tag.create({
        data: {
          name,
          groups: { connect: { id: Number(groupId) } }
        }
      })
      createdTags.push(tag)
    }

    return res.status(201).json(createdTags)
  } catch (error) {
    if (error?.name === 'StructError') {
      return res.status(400).end()
    }
  }
}

export default { createTag }