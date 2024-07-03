import { useEffect, useState } from "react";
import Title from "../commons/Title";
import Subtitle from "../commons/Subtitle";
import ImageUpload from "./ImageUpload";
import StudyTitle from "./StudyTitle";
import StudyIntroduction from "./StudyIntroduction";
import StudyExample from "./StudyExample";
import ProgressWay from "./ProgressWay";

interface StudyContentProps {
  onIntroduceChange: (image: string, title: string, introduction: string, progressWay: string) => void;
}

export default function StudyContent({ onIntroduceChange }: StudyContentProps) {
  const [image, setImage] = useState<string>();
  const [fileToRead, setFileToRead] = useState<File | null>(null);
  const [studyTitle, setStudyTitle] = useState<string>("");
  const [studyIntroduction, setStudyIntroduction] = useState<string>("");
  const [selectedProgressWay, setSelectedProgressWay] = useState("");
  const [address, setAddress] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file?.size > 1 * 1024 * 1024) {
      alert("파일 크기는 1MB를 초과할 수 없습니다.");
      return;
    }
    setFileToRead(file);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputTitle = e.target.value;
    if (inputTitle.length <= 24) {
      setStudyTitle(inputTitle);
    }
  };

  const handleIntroductionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textareaIntroduction = e.target.value;
    if (textareaIntroduction.length <= 500) {
      setStudyIntroduction(textareaIntroduction);
    }
  };

  const handleProgressWayToggle = (progressWay: string) => {
    setSelectedProgressWay(progressWay);
  };

  useEffect(() => {
    if (!fileToRead) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage = reader.result as string;
      setImage(newImage);
    };

    reader.readAsDataURL(fileToRead);
    setFileToRead(null);
  }, [fileToRead, setImage]);

  useEffect(() => {
    onIntroduceChange(image ?? "", studyTitle, studyIntroduction, selectedProgressWay);
  }, [image, studyTitle, studyIntroduction, selectedProgressWay]);

  return (
    <div className="w-full px-[22px] py-[16px] flex-col gap-5 inline-flex">
      <Title>스터디에 대해 소개해 주세요.</Title>
      <div className="flex-col justify-start items-start gap-3 inline-flex">
        <Subtitle>스터디 대표 사진</Subtitle>
        <ImageUpload handleFileChange={handleFileChange} image={image} setImage={setImage} />
      </div>
      <div className="flex-col gap-3 inline-flex">
        <Subtitle>스터디 제목</Subtitle>
        <StudyTitle studyTitle={studyTitle} handleTitleChange={handleTitleChange} />
      </div>
      <div className="flex-col gap-2 inline-flex">
        <Subtitle>스터디 소개</Subtitle>
        <StudyIntroduction studyIntroduction={studyIntroduction} handleIntroductionChange={handleIntroductionChange} />
      </div>
      <StudyExample />
      <ProgressWay
        selectedProgressWay={selectedProgressWay}
        onClickToggle={handleProgressWayToggle}
        address={address}
        setAddress={setAddress}
      />
    </div>
  );
}