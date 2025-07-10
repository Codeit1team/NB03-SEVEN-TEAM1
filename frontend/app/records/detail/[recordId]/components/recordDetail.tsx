'use client';

import Image from 'next/image';
import styles from './RecordDetail.module.css';
import { Record } from '@/types/entities';
import formatTime from '@/lib/formatTime';
import classNames from 'classnames/bind';
import placeholderImage from '@/public/assets/placeholder.svg';

const cx = classNames.bind(styles);

const RecordDetail = ({ record }: { record: Record }) => {
  return (
    <div className={cx('recordDetail')}>
      <h2>기록 상세</h2>

      <div className={cx('imageGallery')}>
        {record.photos.length > 0 ? (
          record.photos.map((url, idx) => (
            <Image
              key={idx}
              src={url}
              alt={`record photo ${idx + 1}`}
              width={400}
              height={250}
              unoptimized // 개발 중엔 필수
            />
          ))
        ) : (
          <Image
            src={placeholderImage}
            alt="placeholder"
            width={400}
            height={250}
          />
        )}
      </div>

      <div className={cx('info')}>
        <p><strong>운동 종류:</strong> {record.exerciseType}</p>
        <p><strong>설명:</strong> {record.description}</p>
        <p><strong>시간:</strong> {formatTime(record.time)}</p>
        <p><strong>거리:</strong> {record.distance}km</p>
        <p><strong>작성자:</strong> {record.author.nickname}</p>
      </div>
    </div>
  );
};

export default RecordDetail;
