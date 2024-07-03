import { MoodMiniToggle } from "@/components/commons/toggle/MoodToggle";
import { USER_FAVORITE_FIELD_TYPE } from "@/constant/study";

interface StudyMoodToggleProps {
  selectedMood: string[];
  handleMoodToggle: (mood: string) => void;
}

export default function StudyMoodToggle({ selectedMood, handleMoodToggle }: StudyMoodToggleProps) {
  return (
    <div className="flex gap-[6px] flex-wrap">
      {Object.keys(USER_FAVORITE_FIELD_TYPE).map((key) => (
        <MoodMiniToggle
          key={key}
          src={USER_FAVORITE_FIELD_TYPE[key].src}
          alt={USER_FAVORITE_FIELD_TYPE[key].alt}
          isActive={selectedMood.includes(USER_FAVORITE_FIELD_TYPE[key].alt)}
          onClick={() => handleMoodToggle(USER_FAVORITE_FIELD_TYPE[key].alt)}>
          {USER_FAVORITE_FIELD_TYPE[key].alt}
        </MoodMiniToggle>
      ))}
    </div>
  );
}