import { promises as fs } from 'fs';

const deleteUploadedFiles = async (files) => {
  if (!files) return;

  // req.files 형태인 경우 (예: { photoUrl: [file1, file2] })
  if (typeof files === 'object' && !Array.isArray(files)) {
    for (const fieldName in files) {
      const fieldFiles = files[fieldName];
      if (Array.isArray(fieldFiles)) {
        for (const file of fieldFiles) {
          try {
            await fs.unlink(file.path);
          } catch (error) {
            console.error('파일 삭제 실패:', error);
          }
        }
      }
    }
    return;
  }

  // 배열인 경우
  if (Array.isArray(files)) {
    for (const file of files) {
      try {
        await fs.unlink(file.path);
      } catch (error) {
        console.error('파일 삭제 실패:', error);
      }
    }
  }
};

export default deleteUploadedFiles;