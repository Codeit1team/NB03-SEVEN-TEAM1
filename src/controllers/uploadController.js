const uploadImage = (req, res) => {
  const files = [
    ...(req.files?.photos || []),
    ...(req.files?.photoUrl || []),
  ];

  if (files.length === 0) {
    return res.status(400).json({
      success: false,
      message: '업로드된 파일이 없습니다.',
    });
  }

  const BASE_URL = req.app.locals.BASE_URL;
  const urls = files.map(file => `${BASE_URL}/api/files/${file.filename}`);

  return res.json({ success: true, urls });
};

export default { uploadImage };