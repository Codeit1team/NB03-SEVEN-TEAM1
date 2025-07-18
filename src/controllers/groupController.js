import GroupService from "#services/GroupService.js";
import { grantLike100Badge } from "#utils/grantGroupBadge.js";
import handleServerError from "#utils/handleServerError.js";

// 그룹 생성
const createGroup = async (req, res, next) => {
  try {
    const group = await GroupService.createGroup(req.body);
    return res.status(201).json(group);
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 그룹 생성에 실패했습니다.'));
  }
}

const getGroups = async (req, res, next) => {
  try {
    const { page, limit, order, orderBy, search } = req.query;
    const { data: groups, total } = await GroupService.getGroups(page, limit, order, orderBy, search);
    return res.json({ data: groups, total });
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 그룹 목록을 가져오는데 실패했습니다.'));
  }
}

const getGroupDetail = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await GroupService.getGroupDetail(groupId);
    return res.json(group);
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 그룹 ID 조회에 실패했습니다.'));
  }
}

const updateGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await GroupService.updateGroup(groupId, req.body);
    return res.json(group);
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 그룹 업데이트에 실패했습니다.'));
  }
}

const deleteGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    await GroupService.deleteGroup(groupId, req.body.ownerPassword);
    return res.sendStatus(204);
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 그룹 삭제에 실패했습니다.'));
  }
}

const likeGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    await GroupService.likeGroup(groupId);
    await grantLike100Badge(groupId);
    return res.sendStatus(204);
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 추천이 실패했습니다.'));
  }
}

const unlikeGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    await GroupService.unlikeGroup(groupId);
    return res.sendStatus(204);
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 좋아요 취소에 실패했습니다.'));
  }
};

export default {
  createGroup,
  getGroups,
  getGroupDetail,
  updateGroup,
  deleteGroup,
  likeGroup,
  unlikeGroup
}