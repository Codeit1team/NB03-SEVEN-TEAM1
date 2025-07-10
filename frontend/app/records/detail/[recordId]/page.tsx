import { getRecordDetail } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function RecordDetailPage({
  params,
}: {
  params: { recordId: string };
}) {
  try {
    const recordId = Number(params.recordId);
    const record = await getRecordDetail(recordId);

    return (
      <main>
        <h1>기록 상세</h1>
        <p>운동 종류: {record.exerciseType}</p>
        <p>설명: {record.description}</p>
        <p>시간: {record.time}분</p>
        <p>거리: {record.distance}km</p>
        <p>작성자: {record.author.nickname}</p>

        {/* <div>
          {record.photos.map((url, index) => 
            <img
            key={index}
            src={url}
            alt={`기록 이미지 ${index + 1}`}
            width={400}
            height={250}
            />
          ))}
        </div> */}
      </main>
    );
  } catch (error) {
    notFound(); // 404 페이지로 보냄
  }
}
