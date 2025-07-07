const PORT = process.env.PORT || 3001;

const uploadImage = (req, res) => {
  const photos = req.files?.photos || [];
  const photoUrl = req.files?.photoUrl || [];
  const files = [...photos, ...photoUrl];

  if (files.length === 0) {
    return res.status(400).json({ success: false, message: '업로드된 파일이 없습니다.' });
  }

  const urls = files.map(file =>
  `http://localhost:${PORT}/api/uploads/${file.filename}`
);

  return res.json({ success: true, urls });
};

export default { uploadImage };