import dayjs from "dayjs";

export const formatTime = (time: Date | string) => {
  return dayjs(time).format("YYYY年MM月DD日 HH:mm");
};
