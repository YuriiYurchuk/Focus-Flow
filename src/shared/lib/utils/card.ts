import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const formatDeadline = (
  deadline: Timestamp | Date | null | undefined
): string | null => {
  if (!deadline) return null;

  const date = deadline instanceof Timestamp ? deadline.toDate() : deadline;
  return formatDistanceToNow(date, { locale: uk, addSuffix: true });
};
