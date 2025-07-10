'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import { useInView } from 'react-intersection-observer';
import Card from '@/lib/components/Card';
import { EXERCISE_TYPE_MAP, Record, RecordItemClick } from '@/types/entities';
import placeholderImage from '@/public/assets/placeholder.svg';
import formatTime from '@/lib/formatTime';
import { PaginationQuery } from '@/types/pagination';
import { getRecordsAction, getRecordAction } from '../actions';
import styles from './RecordList.module.css';
import RecordModal from './RecordModal';

const cx = classNames.bind(styles);

const RecordItem = ({ record, onClick }: { record: Record, onClick?: RecordItemClick }) => {
  return (
    <Card className={cx('recordItem')} onClick={() => { onClick?.(record.id) }}>
      <Image
        className={cx('image')}
        src={record.photos[0] ?? placeholderImage}
        alt="record image"
        width={352}
        height={206}
      />
      <div className={cx('distance')}>{record.distance}KM</div>
      <div className={cx('footer')}>
        <div className={cx('info')}>
          {formatTime(record.time)} · {EXERCISE_TYPE_MAP[record.exerciseType]}
        </div>
        <div className={cx('author')}>{record.author.nickname}</div>
      </div>
    </Card>
  );
};

const RecordList = ({
  groupId,
  paginationQuery,
  initialValues = [],
  total,
}: {
  groupId: number;
  paginationQuery: PaginationQuery;
  initialValues: Record[];
  total: number;
}) => {
  const [records, setRecords] = useState(initialValues);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [isModal, setIsModal] = useState(false);
  const [page, setPage] = useState(paginationQuery?.page ?? 1);
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const clickRecordItem: RecordItemClick = useCallback(async (recordId) => {
    let record = null
    if (recordId) {
      record = await getRecordAction(recordId)
    }
    
    setIsModal(!isModal)
    setSelectedRecord(record)
  }, [isModal])

  const loadMore = useCallback(async () => {
    const { data: next } = await getRecordsAction(groupId, {
      ...paginationQuery,
      page: page + 1,
    });
    setRecords((prev) => [...prev, ...next]);
    setPage(page + 1);
  }, [groupId, paginationQuery, page]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  useEffect(() => {
    setRecords(initialValues);
    setPage(paginationQuery?.page ?? 1);
  }, [initialValues, paginationQuery]);

  const hasNext = records.length < total;

  return (
    <div className={cx('recordList')}>
      {records.map((record) => (
        <RecordItem key={record.id} record={record} onClick={clickRecordItem} />
      ))}
      {hasNext && <div ref={ref} />}

      {isModal && selectedRecord && <RecordModal record={selectedRecord} confirmButton={clickRecordItem} />}
    </div>
  );
};

export default RecordList;
