import { Modal, Radio } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import BoxSelect from './box-select';
import WorkCalendar from './work-calendar';

import './App.css';

function App() {

  const [selectDates, setSelectDates] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [dateType, setDateType] = useState<number | null>();
  const [dates, setDates] = useState<any>({});

  const selectDatesRef = useRef<string[]>([]);

  const workDays = useMemo(() => {
    return Object.keys(dates).filter(date => dates[date] === 1)
  }, [dates])

  const restDays = useMemo(() => {
    return Object.keys(dates).filter(date => dates[date] === 2)
  }, [dates]);

  const holidayDays = useMemo(() => {
    return Object.keys(dates).filter(date => dates[date] === 3)
  }, [dates]);

  useEffect(() => {
    selectDatesRef.current = selectDates;
  }, [selectDates]);

  return (
    <div>
      <WorkCalendar
        defaultWeekStartDay={0}
        workDays={workDays}
        holidayDays={holidayDays}
        restDays={restDays}
        selectDates={selectDates}
        year={new Date().getFullYear()}
      />
      <BoxSelect
        // 可框选区域
        sourceClassName='work-calendar'
        // 可框选元素的dom选择器，
        selectors='td.date[data-date]'
        // 框选元素改变时的回调，可以拿到框选中元素
        onSelectChange={(selectDoms) => {
          // 内部给td元素上设置了data-date属性，这样就可以从dom元素上拿到日期
          setSelectDates(selectDoms.map(dom => dom.getAttribute('data-date') as string))
        }}
        // 框选结束事件
        onSelectEnd={() => {
          // 如果有框选就弹出设置弹框
          if (selectDatesRef.current.length) {
            setOpen(true)
          }
        }}
      />
      <Modal
        title="设置日期类型"
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectDates([]);
          setDateType(null);
        }}
        onOk={() => {
          setOpen(false);
          selectDatesRef.current.forEach(date => {
            setDates((prev: any) => ({
              ...prev,
              [date]: dateType,
            }))
          })
          setSelectDates([]);
          setDateType(null);
        }}
      >
        <Radio.Group
          options={[
            { label: '工作日', value: 1 },
            { label: '休息日', value: 2 },
            { label: '节假日', value: 3 },
          ]}
          value={dateType}
          onChange={e => setDateType(e.target.value)}
        />
      </Modal>
    </div>
  )
}

export default App
