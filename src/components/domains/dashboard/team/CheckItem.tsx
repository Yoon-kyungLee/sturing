"use client";
import { toggleCheckItemAction } from "@/lib/database/action/dashboard";
import Checkbox from "../Checkbox";
import { useParams } from "next/navigation";

interface ICheckItemProps {
  checkItem: any;
}

export function CheckItem(props: ICheckItemProps) {
  const { checkItem } = props;
  const { _id: checkItemId, isChecked } = checkItem;

  const { id: studyId } = useParams();

  if (!studyId) return <></>;
  return (
    <li className="flex justify-between items-center py-2 rounded-sm">
      <div className="flex justify-start items-center gap-2">
        <form className="text-[0px]" action={toggleCheckItemAction}>
          <input type="hidden" name="checkItemId" value={checkItemId} />
          <input type="hidden" name="studyId" value={studyId} />
          <Checkbox isChecked={isChecked} type="checkList" />
        </form>
        <div className="text-gray-900 text-sm font-medium leading-tight">{checkItem.content}</div>
      </div>
      {/* @todo 리액션 추후 개발
      <form>
        <label
          className={`flex justify-center items-center gap-1 w-[38px] h-[22px] rounded-3xl border text-xs cursor-pointer ${
            isIncludingMe ? "border-main-500 bg-main-100 text-gray-1000" : "border-gray-200 bg-gray-100 text-gray-300"
          }`}
          htmlFor={""}>
          <input
            className="appearance-none absolute"
            id={""}
            type="checkbox"
            checked={isChecked}
            onChange={onChangeChecked}
          />
          <span>👍</span>
          <span>10</span>
        </label>
      </form> */}
    </li>
  );
}