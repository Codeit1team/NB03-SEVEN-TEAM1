import { AxiosError } from 'axios';
import {
  Group,
  GroupCreate,
  GroupDelete,
  GroupJoin,
  GroupUpdate,
  Rank,
  RankDuration,
  Record,
  RecordCreate,
} from '@/types/entities';
import { PaginationQuery, PaginationResponse } from '@/types/pagination';
import { axios } from './axios';

export const DEFAULT_GROUPS_PAGINATION_QUERY: PaginationQuery = {
  page: 1,
  limit: 6,
  order: 'desc',
  orderBy: 'createdAt',
  search: '',
};

const logError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const response = error.response;
    if (response) {
      console.error(
        `[프론트] ${response.config.method?.toUpperCase()} ${
          response.config.url
        } ${response.status}`
      );
      console.error(response.data);
    }
  }
};

export const getGroups = async (
  query: PaginationQuery
): Promise<PaginationResponse<Group>> => {
  try {
    const response = await axios.get('/groups', {
      params: {
        ...DEFAULT_GROUPS_PAGINATION_QUERY,
        ...query,
      },
    });
    const { data, total } = response.data;
    return { data, total };
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getGroup = async (groupId: number): Promise<Group> => {
  try {
    const response = await axios.get(`/groups/${groupId}`);
    const group = response.data;
    return group;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const createGroup = async (group: GroupCreate): Promise<Group> => {
  try {
    const response = await axios.post('/groups', group);
    const createdGroup = response.data;
    return createdGroup;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const updateGroup = async (
  groupId: number,
  group: GroupUpdate
): Promise<Group> => {
  try {
    const response = await axios.patch(`/groups/${groupId}`, group);
    const updatedGroup = response.data;
    return updatedGroup;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const deleteGroup = (groupId: number, data: GroupDelete) => {
  return axios.delete(`/groups/${groupId}`, { data }).catch((error) => {
    logError(error);
    throw error;
  });
};

export const joinGroup = async (
  groupId: number,
  data: GroupJoin
): Promise<void> => {
  try {
    await axios.post(`/participants/${groupId}`, data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const leaveGroup = async (
  groupId: number,
  data: GroupJoin
): Promise<void> => {
  try {
    await axios.delete(`/participants/${groupId}`, {
      data
    });
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const likeGroup = async (groupId: number): Promise<void> => {
  try {
    await axios.post(`/groups/like/${groupId}`);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const unlikeGroup = async (groupId: number): Promise<void> => {
  try {
    await axios.delete(`/groups/like/${groupId}`);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const DEFAULT_RECORDS_PAGINATION_QUERY: PaginationQuery = {
  page: 1,
  limit: 6,
  order: 'desc',
  orderBy: 'createdAt',
  search: '',
};

export const getRecords = async (
  groupId: number,
  query: PaginationQuery
): Promise<PaginationResponse<Record>> => {
  try {
    const response = await axios.get(`/records/${groupId}`, {
      params: {
        ...DEFAULT_RECORDS_PAGINATION_QUERY,
        ...query,
      },
    });
    const { data, total } = response.data;
    return { data, total };
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const createRecord = async (
  groupId: number,
  record: RecordCreate
): Promise<Record> => {
  try {
    const response = await axios.post(`/records/${groupId}`, record);
    const createdRecord = response.data;
    return createdRecord;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getRecord = async (recordId: number): Promise<Record> => {
  try {
    const response = await axios.get(`/records/detail/${recordId}`);
    const data = response.data;
    return data;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getRanks = async (
  groupId: number,
  duration: RankDuration
): Promise<Rank[]> => {
  try {
    const response = await axios.get(`/records/ranking/${groupId}`, {
      params: { duration },
    });
    const ranks: Rank[] = response.data;
    return ranks;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const uploadImage = async (
  files: File[],
  isSingle: boolean = false
): Promise<{
  urls: string[];
}> => {
  try {
    const formData = new FormData();
    if (isSingle) {
      formData.append('photoUrl', files[0]);
    } else {
      files.forEach((file) => formData.append('photos', file));
    }
    const response = await axios.postForm('/uploads', formData);
    const { urls } = response.data;
    return { urls };
  } catch (error) {
    logError(error);

    if (error instanceof AxiosError &&
      error.response?.data?.message &&
      typeof error.response.data.message === 'string'
    ) {
      throw new Error(error.response.data.message);
    }

    if (
      error instanceof AxiosError &&
      error.response?.status === 413
    ) {
      throw new Error('파일 용량은 1MB 이하만 가능합니다.');
    }

    throw error;
  }
};