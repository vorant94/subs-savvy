import dayjs from "dayjs";

export const startOfYear = dayjs(new Date()).startOf("year").toDate();
