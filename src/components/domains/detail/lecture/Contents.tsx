import TabMenuLinkUnderlined from "@/components/commons/TabMenuLinkUnderlined";

import LectureInfo from "./LectureInfo";
import LectureRatings from "./LectureRatings";
import LectureRelatedStudies from "./LectureRelatedStudies";
import { LectureData } from "@/app/lecture/[id]/page";

interface ContentsProps {
  lectureData: LectureData;
}

export default function Contents({ lectureData }: ContentsProps) {
  return (
    <div className="mb-[73px]">
      <nav className="flex justify-between items-center gap-3 bg-white sticky top-0 left-0 z-sticky">
        <TabMenuLinkUnderlined title="강의소개" isCurrent={true} href="#lectureInfo" />
        <TabMenuLinkUnderlined title="스터디" isCurrent={false} href="#related_study" />
        <TabMenuLinkUnderlined title="평점" isCurrent={false} href="#rating" />
      </nav>
      <div className="px-4 sm:overflow-y-auto">
        <LectureInfo lectureData={lectureData} />
        <LectureRelatedStudies lectureData={lectureData} />
        <LectureRatings lectureData={lectureData} />
      </div>
    </div>
  );
}
