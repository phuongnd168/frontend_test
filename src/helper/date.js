// utils/date.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatVNDate(dateStr) {
    const isoStr = dateStr.replace(" ", "T") + "Z"; 
  return dayjs(isoStr)
    .tz("Asia/Ho_Chi_Minh")
    .format("DD/MM/YYYY HH:mm");
}
