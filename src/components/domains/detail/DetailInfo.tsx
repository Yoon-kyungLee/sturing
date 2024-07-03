import Image from "next/image";

interface DetailInfoProps {
  icon: { src: string; alt: string };
  title: string;
  content: string;
  isWhite?: boolean;
}

export default function DetailInfo({ icon, title, content, isWhite = false }: DetailInfoProps) {
  return (
    <>
      <li
        className={`list-none flex items-center gap-[11px] text-[14px] font-medium  leading-[150%] ${
          isWhite ? "text-white" : "text-gray-800"
        }`}>
        <div className="flex items-center w-[62px] gap-[7px]">
          <Image src={icon.src} alt={icon.alt} width={18} height={18} />
          <p>{title}</p>
        </div>
        <p>{content}</p>
      </li>
    </>
  );
}