import Image from "next/image";
import { addBlue } from "@/../public/icons/icons";
import Checkbox from "./Checkbox";
import DashboardCardLayout from "./DashboardCardLayout";
import DashboardCardTitle from "../DashboardCardTitle";

interface IChecklistCardProps {
  date: Date | undefined;
}

export default function ChecklistCard(props: IChecklistCardProps) {
  const { date } = props;
  console.log("date:", date);

  return (
    <DashboardCardLayout>
      <DashboardCardTitle title="체크리스트">
        <span className="text-main-500 text-sm font-medium leading-snug">2/3</span>
        <button className="ml-auto">
          <Image src={addBlue} alt="" width={24} height={24} />
        </button>
      </DashboardCardTitle>

      <ul className="mt-4">
        {[1, 2, 3].map((item, index) => (
          <TodoItem key={index} />
        ))}
      </ul>
    </DashboardCardLayout>
  );
}

function TodoItem() {
  const isChecked = true;

  return (
    <li className="flex justify-between items-center py-2 rounded-sm">
      <form className="flex justify-start items-center gap-2" action={""}>
        <button>
          <Checkbox isChecked={isChecked} />
        </button>
        <div className="text-gray-900 text-sm font-medium leading-tight">2강 듣고 과제노트 작성하기</div>
      </form>
    </li>
  );
}