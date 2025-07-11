'use client';

import classNames from 'classnames/bind';
import Image from 'next/image';
import Card from "@/lib/components/Card";
import { EXERCISE_TYPE_MAP, Record, RecordItemClick } from '@/types/entities';
import placeholderImage from '@/public/assets/placeholder.svg';
import formatTime from '@/lib/formatTime';
import styles from './RecordModal.module.css';

const RecordModal = ({
  record,
  order,
  confirmButton,
}: {
  record: Record;
  order: number;
  confirmButton: RecordItemClick;
}) => {
  const cx = classNames.bind(styles);

  return (<div className={cx('modal-backdrop')} onClick={() => confirmButton(null)}>
    <div className={cx('modal-content')} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
      <Card className={cx('recordItem')}>
        {Array.isArray(record.photos) && record.photos.length > 0 ? (
          record.photos
            .filter((photo): photo is string => typeof photo === 'string')
            .slice(0, 5) // 최대 5개까지 표시
            .map((photo, index) => (
              <Image
                key={index}
                className={cx('image')}
                src={photo}
                alt={`record image ${index}`}
                width={352}
                height={206}
              />
            ))
        ) : (
          <Image
            className={cx('image')}
            src={placeholderImage}
            alt="placeholder image"
            width={352}
            height={206}
          />
        )}
        <div className={cx('distance')}>{record.distance}KM · {order}등</div>
        <div className={cx('footer')}>
          <div className={cx('info')}>
            {formatTime(record.time)} · {EXERCISE_TYPE_MAP[record.exerciseType]}
          </div>
          <div className={cx('author')}>{record.author.nickname}</div>
        </div>
      </Card>
      <button className={cx('confirmButton')} onClick={() => confirmButton(null)}>확인</button>
    </div>
  </div>)
}

export default RecordModal