import GroupService from "#services/GroupService.js";
import { grantLike100Badge } from "#utils/grantGroupBadge.js";

const PORT = process.env.PORT || 3001

const createGroup = async (req, res, next) => {
  try {
    if (req.files?.photoUrl?.[0]) {
      req.body.photoUrl = `http://localhost:${PORT}/uploads/${req.files.photoUrl[0].filename}`;
    }
    
    const group = await GroupService.createGroup(req.body);
    return res.status(201).json(group);
  } catch (error) {
    error.status = 400;
    error.message = '그룹 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

const getGroups = async (req, res, next) => {
  try {
    const { page, limit, order, orderBy, search } = req.query;
    const groups = await GroupService.getGroups(page, limit, order, orderBy, search);

    // tags: Tag[] → string[] 변환
    const groupsWithTags = groups.map(group => ({
      ...group,
      tags: group.tags ? group.tags.map(tag => tag.name) : [],
    }));

    return res.json(groupsWithTags);
  } catch (error) {
    error.status = 500;
    error.message = "그룹 목록을 가져오는 데 실패했습니다";
    next(error);
  }
}

const getGroupDetail = async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const group = await GroupService.getGroupDetail(groupId);
    return res.json(group);
  } catch (error) {
    error.status = 404;
    error.message = "그룹 조회에 실패했습니다. 해당하는 기록이 없습니다.";
    next(error);
  }
}

const likeGroup = async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId);
    await GroupService.likeGroup(groupId);
    await grantLike100Badge(groupId);
    return res.sendStatus(204);
  } catch (error) {
    error.status = 404;
    error.message = "요청이 잘못 되었습니다. 해당 그룹은 없습니다"
    next(error);
  }
}

const unlikeGroup = async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId);
    await GroupService.unlikeGroup(groupId);
    return res.sendStatus(204);
  } catch (error) {
    error.status = 404;
    error.message = "요청이 잘못 되었습니다. 해당 그룹은 없습니다"
    next(error);
  }
}

export default { 
  createGroup,
  getGroups,
  getGroupDetail,
  likeGroup,
  unlikeGroup
};