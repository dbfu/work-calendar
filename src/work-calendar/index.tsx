import { Radio } from 'antd';
import { useMemo, useState } from "react";

import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';

import { DateInfo, formatDate, getYearWeeks } from './utils';


function WorkCalendar({
  defaultWeekStartDay,
  restDays,
  workDays,
  holidayDays,
  workDayBgColor = '#ffffff',
  holidayDayBgColor = '#DFE2FB',
  restDayBgColor = '#eeeeee',
  selectDates,
  year,
}: {
  defaultWeekStartDay: 0 | 1,
  restDays?: string[],
  workDays?: string[],
  holidayDays?: string[],
  workDayBgColor?: string,
  holidayDayBgColor?: string,
  restDayBgColor?: string
  selectDates: string[],
  year: number
}) {

  const [curYear, setCurYear] = useState(year);
  const [weekStartDay, setWeekStartDay] = useState(defaultWeekStartDay);

  let titles = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  if (weekStartDay === 1) {
    titles = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  }

  const weeks = useMemo(() => {
    return getYearWeeks(curYear, weekStartDay);
  }, [curYear, weekStartDay])

  // 渲染单元格
  function cellRender(item: DateInfo) {

    // 非本月
    if (!item.isCurMonth) {
      return (
        <td
          className='rounded-[10px] h-[45px] text-center text-[#aaa] select-none'
          key={item?.date?.getTime()}
        >
          <div className='text-[15px]'>
            {item?.day}
          </div>
          <div className='text-[11px]'>
            {item?.cnDay}
          </div>
        </td>
      )
    }

    // 不同的日期类型，给不同背景色
    let backgroundColor = workDayBgColor;
    if (selectDates.includes(formatDate(item.date))) {
      backgroundColor = '#abcdff';
    } else if ((workDays || []).includes(formatDate(item.date))) {
      backgroundColor = workDayBgColor;
    } else if ((holidayDays || []).includes(formatDate(item.date))) {
      backgroundColor = holidayDayBgColor;
    } else if (item.week === 0 || item.week === 6 || (restDays || []).includes(formatDate(item.date))) {
      backgroundColor = restDayBgColor;
    }

    return (
      <td
        className='date rounded-[12px] h-[45px] text-[#46464b] text-center select-none'
        key={item?.date?.getTime()}
        style={{ background: backgroundColor }}
        data-date={formatDate(item.date)}
      >
        <div className='text-[15px]'>
          {item?.day}
        </div>
        <div className='text-[11px]'>
          {item.festivalName || item.jieQi || (item?.cnDay === '初一' ? `${item?.cnMonth}月` : item?.cnDay)}
        </div>
      </td>
    )
  }

  return (
    <div className='p-[20px]'>
      <div className='flex'>
        <div className='flex-1 flex gap-[20px]'>
          <div className='flex items-center gap-[10px]'>
            <div className='w-[16px] h-[16px] rounded-[50%]' style={{ border: '1px solid #eee', backgroundColor: workDayBgColor }} />
            <div>工作日</div>
          </div>
          <div className='flex items-center gap-[10px]'>
            <div className='w-[16px] h-[16px] rounded-[50%] bg-[#eee]' style={{ backgroundColor: restDayBgColor }} />
            <div>休息日</div>
          </div>
          <div className='flex items-center gap-[10px]'>
            <div className='w-[16px] h-[16px] rounded-[50%] bg-[#DFE2FB]' style={{ backgroundColor: holidayDayBgColor }} />
            <div>节假日</div>
          </div>
        </div>
        <div className='flex-1 flex items-center justify-center gap-[20px]'>
          <CaretLeftOutlined onClick={() => setCurYear(curYear - 1)} className='text-[#000] font-bold cursor-pointer' />
          <span className='font-bold text-[#000] text-[18px] select-none'>
            {curYear}
          </span>
          <CaretRightOutlined onClick={() => setCurYear(curYear + 1)} className='text-[#000] font-bold cursor-pointer' />
        </div>
        <div className='flex-1 flex justify-end items-center'>
          <label> 周起始日：</label>
          <Radio.Group
            options={[{ label: '周一', value: 1 }, { label: '周日', value: 0 }]}
            optionType="button"
            buttonStyle="solid"
            value={weekStartDay}
            onChange={(e) => setWeekStartDay(e.target.value)}
          />
        </div>
      </div>
      <div
        className='mt-[40px] flex-wrap grid grid-cols-4 justify-items-center gap-y-[20px] work-calendar'
      >
        {weeks.map((month) => (
          <div key={month.month}>
            <table className='border-spacing-[4px] border-separate'>
              <colgroup>
                {titles.map((item) => (
                  <col key={item} width="45px" />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th
                    className='text-[#46464b] font-bold select-none'
                    colSpan={7}
                    style={{ textAlign: 'center' }}
                  >
                    {month.month + 1}月
                  </th>
                </tr>
                <tr>
                  {titles.map((item) => (
                    <th
                      key={item}
                      className='text-[#46464b] font-semibold text-center select-none'
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {month.weeks.map((item, index) => {
                  return (
                    <tr key={index}>
                      {item.map((o) => {
                        return cellRender(o);
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkCalendar;