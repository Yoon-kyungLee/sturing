import DashboardCardPaginationLayout from "./DashboardCardPaginationLayout";
import DashboardCardTitle from "../DashboardCardTitle";
import WriteBoardLink from "./WriteBoardLink";
import TaskItem from "./TaskItem";
import NoBoard from "./NoBoard";

const SAMPLE_TASK_LIST = [{}, {}];

export default function TaskCard() {
  return (
    <DashboardCardPaginationLayout hasMore={true}>
      <DashboardCardTitle title="과제 게시판">
        <WriteBoardLink />
      </DashboardCardTitle>

      <ul className="flex flex-col gap-[1px] bg-gray-300">
        {SAMPLE_TASK_LIST?.length > 0 ? SAMPLE_TASK_LIST.map((item, index) => <TaskItem key={index} />) : <NoBoard />}
      </ul>
    </DashboardCardPaginationLayout>
  );
}