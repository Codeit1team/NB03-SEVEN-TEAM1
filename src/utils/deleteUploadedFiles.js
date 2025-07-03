import { promises as fs } from 'fs';

const deleteUploadedFiles = async (files) => {
  if (!files || files.length === 0) return;

  for (const file of files) {
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error('파일 삭제 실패:', error);
    }
  }
};

export default deleteUploadedFiles;