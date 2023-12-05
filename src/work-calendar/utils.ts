import { Lunar } from 'lunar-typescript';

/**
 * 日期信息
 */
export interface DateInfo {
  /**
   * 年
   */
  year: number;
  /**
   * 月
   */
  month: number;
  /**
   * 日
   */
  day: number;
  /**
   * 日期
   */
  date: Date;
  /**
   * 农历日
   */
  cnDay: string;
  /**
   * 农历月
   */
  cnMonth: string;
  /**
   * 农历年
   */
  cnYear: string;
  /**
   * 节气
   */
  jieQi: string;
  /**
   * 是否当前月
   */
  isCurMonth?: boolean;
  /**
   * 星期几
   */
  week: number;
  /**
   * 节日名称
   */
  festivalName: string;
}

/**
 * 月份的所有周
 */
export interface MonthWeek {
  /**
   * 月
   */
  month: number;
  /**
   * 按周分组的日期
   */
  weeks: DateInfo[][];
}

const festivalMap: any = {
  '1-1': '元旦',
  '4-4': '清明节',
  '5-1': '劳动节',
  '10-1': '国庆节',
};

/**
 * 获取给定日期的信息。
 * @param date - 要获取信息的日期。
 * @param isCurMonth - 可选参数，指示日期是否在当前月份。
 * @returns 包含有关日期的各种信息的对象。
 */
export const getDateInfo = (date: Date, isCurMonth?: boolean): DateInfo => {
  // 从给定日期创建 农历 对象
  const lunar = Lunar.fromDate(date);

  // 获取 Lunar 对象中的农历日、月和年
  const cnDay = lunar.getDayInChinese();
  const cnMonth = lunar.getMonthInChinese();
  const cnYear = lunar.getYearInChinese();

  // 获取农历节日
  const festivals = lunar.getFestivals();

  // 获取 Lunar 对象中的节气
  const jieQi = lunar.getJieQi();

  // 从日期对象中获取年、月和日
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // 创建包含日期信息的对象
  return {
    year,
    month,
    day,
    date,
    cnDay,
    cnMonth,
    cnYear,
    jieQi,
    isCurMonth,
    week: date.getDay(),
    festivalName: festivals?.[0] || festivalMap[`${month + 1}-${day}`],
  };
};

function getDay(date: Date, weekStartDay: number) {
  // 获取给定日期是星期几
  const day = date.getDay();
  // 根据给定的周开始日，计算出星期几在第一天的偏移量
  if (weekStartDay === 1) {
    if (day === 0) {
      return 6;
    } else {
      return day - 1;
    }
  }
  return day;
}

/**
 * 返回给定年份和月份的周数组。
 * 每个周是一个天数数组。
 *
 * @param year - 年份。
 * @param month - 月份 (0-11)。
 * @param weekStartDay - 一周的起始日 (0-6) (0: 星期天, 6: 星期六)。
 * @returns 给定月份的周数组。
 */
const getMonthWeeks = (year: number, month: number, weekStartDay: number) => {
  // 获取给定月份的第一天
  const start = new Date(year, month, 1);

  // 这里为了支持周一或周日在第一天的情况，封装了获取星期几的方法
  const day = getDay(start, weekStartDay);

  const days = [];

  // 获取给定月份的前面的空白天数，假如某个月第一天是星期3，并且周日开始，那么这个月前面的空白天数就是3
  // 如果是周一开始，那么这个月前面的空白天数就是2
  // 用上个月日期替换空白天数
  for (let i = 0; i < day; i += 1) {
    days.push(getDateInfo(new Date(year, month, -day + i + 1)));
  }

  // 获取给定月份的天数
  const monthDay = new Date(year, month + 1, 0).getDate();

  // 把当月日期放入数组
  for (let i = 1; i <= monthDay; i += 1) {
    days.push(getDateInfo(new Date(year, month, i), true));
  }

  // 获取给定月份的最后一天
  const endDate = new Date(year, month + 1, 0);
  // 获取最后一天是星期几
  const endDay = getDay(endDate, weekStartDay);

  // 和前面一样，如果有空白位置就用下个月日期补充上
  for (let i = endDay; i <= 5; i += 1) {
    days.push(getDateInfo(new Date(year, month + 1, i - endDay + 1)));
  }

  // 按周排列
  const weeks: DateInfo[][] = [];
  for (let i = 0; i < days.length; i += 1) {
    if (i % 7 === 0) {
      weeks.push(days.slice(i, i + 7));
    }
  }

  // 默认每个月都有6个周，如果没有的话就用下个月日期补充。
  while (weeks.length < 6) {
    const endDate = weeks[weeks.length - 1][6];
    weeks.push(
      Array.from({length: 7}).map((_, i) => {
        const newDate = new Date(endDate.date);
        newDate.setDate(newDate.getDate() + i + 1)
        return getDateInfo(newDate);
      })
    );
  }
  return weeks;
};

/**
 * 获取年份的所有周，按月排列
 * @param year 年
 * @param weekStartDay 周开始日 0为周日 1为周一
 * @returns
 */
export const getYearWeeks = (year: number, weekStartDay = 0): MonthWeek[] => {
  const weeks = [];
  for (let i = 0; i <= 11; i += 1) {
    weeks.push({month: i, weeks: getMonthWeeks(year, i, weekStartDay)});
  }
  return weeks;
};

/**
 * 格式化日期，把Date转换为'MM-DD'，不满10前面补零
 */
export function formatDate(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [
    date.getFullYear(),
    month < 10 ? `0${month}` : month,
    day < 10 ? `0${day}` : day,
  ].join('-');
}
