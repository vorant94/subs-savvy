import dayjs from "dayjs";

export const startOfMonth = dayjs(new Date()).startOf("month").toDate();
