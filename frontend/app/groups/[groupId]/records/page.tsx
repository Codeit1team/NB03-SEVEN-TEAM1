import { PaginationQuery } from '@/types/pagination';
import GroupDetail from '../components/GroupDetail';
import GroupTab from '../components/GroupTab';
import RecordList from './components/RecordList';
import RecordTabHeader from './components/RecordTabHeader';
import { getGroupAction } from '../../actions';
import { getRecordsAction } from './actions';
import { getRanksAction } from '../rank/actions';
import { RankDuration } from '@/types/entities';

const GroupRecordsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<PaginationQuery>;
}) => {
  const groupId = Number((await params).groupId);
  const group = await getGroupAction(groupId);

  const paginationQuery = (await searchParams) as PaginationQuery;

  const { data: records, total: recordsTotal } = await getRecordsAction(
    groupId,
    paginationQuery
  );

  const ranks = await getRanksAction(groupId, RankDuration.WEEKLY);

  return (
    <>
      <GroupDetail group={group} />
      <GroupTab groupId={groupId} selectedTab="records">
        <RecordTabHeader
          groupId={groupId}
          recordsTotal={recordsTotal}
          initialQuery={paginationQuery}
        />
      </GroupTab>
      <RecordList
        groupId={groupId}
        paginationQuery={paginationQuery}
        initialValues={records}
        total={recordsTotal}
        ranks={ranks}
      />
    </>
  );
};

export default GroupRecordsPage;
