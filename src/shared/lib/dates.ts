import dayjs from "dayjs";

export const startOfMonth = dayjs(new Date()).startOf("month").toDate();

export const startOfYear = dayjs(new Date()).startOf("year").toDate();
