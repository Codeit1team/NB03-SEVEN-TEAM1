import GroupService from "#services/GroupService";
import ParticipantService from "#services/ParticipantService";

const createGroup = async (req, res, next) => {
  try {
    const result = await GroupService.createGroup(req.body);
    return res.status(201).json(result);
  } catch (error) {
    error.status = 400;
    error.message = '기록 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

export default groupController = {
  createGroup
};

// const {owner: { nickname, password }, tags, photoUrl, ...groupData} = req.body;
//     const hashedPassword = await hashPassword(password);

//     const group = await GroupService.createGroup(groupData);
//     const owner = await ParticipantService.createParticipant({
//       nickname,
//       hashedPassword,
//     });