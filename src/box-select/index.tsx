import { useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';
import { isRectangleIntersect } from './utils';

interface Props {
  selectors: string;
  sourceClassName: string;
  onSelectChange?: (selectDoms: Element[]) => void;
  onSelectEnd?: () => void;
  style?: React.CSSProperties,
}

function BoxSelect({
  selectors,
  sourceClassName,
  onSelectChange,
  style,
  onSelectEnd,
}: Props) {

  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const isPress = useRef(false);

  const startPos = useRef<any>();

  useEffect(() => {
    // 滚动的时候，框选框位置不变，但是元素位置会变，所以需要重新计算
    function scroll() {
      if (!isPress.current) return;
      setPosition(prev => ({ ...prev }));
    }

    // 鼠标按下，开始框选
    function sourceMouseDown(e: any) {
      isPress.current = true;
      startPos.current = { top: e.clientY, left: e.clientX };
      setPosition({ top: e.clientY, left: e.clientX, width: 1, height: 1 })
      // 解决误选择文本情况
      window.getSelection()?.removeAllRanges();
    }
    // 鼠标移动，移动框选
    function mousemove(e: MouseEvent) {
      if (!isPress.current) return;

      let left = startPos.current.left;
      let top = startPos.current.top;
      const width = Math.abs(e.clientX - startPos.current.left);
      const height = Math.abs(e.clientY - startPos.current.top);

      // 当后面位置小于前面位置的时候，需要把框的坐标设置为后面的位置
      if (e.clientX < startPos.current.left) {
        left = e.clientX;
      }

      if (e.clientY < startPos.current.top) {
        top = e.clientY;
      }

      setPosition({ top, left, width, height })
    }

    // 鼠标抬起
    function mouseup() {

      if(!isPress.current) return;

      startPos.current = null;
      isPress.current = false;
      // 为了重新渲染一下
      setPosition(prev => ({ ...prev }));

      onSelectEnd && onSelectEnd();
    }

    const sourceDom = document.querySelector(`.${sourceClassName}`);

    if (sourceDom) {
      sourceDom.addEventListener('mousedown', sourceMouseDown);
    }

    document.addEventListener('scroll', scroll);
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);

    return () => {
      document.removeEventListener('scroll', scroll);
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);

      if (sourceDom) {
        sourceDom.removeEventListener('mousedown', sourceMouseDown);
      }
    }
  }, [])

  useEffect(() => {
    const selectDoms: Element[] = [];
    const boxes = document.querySelectorAll(selectors);
    (boxes || []).forEach((box) => {
      // 判断是否在框选区域
      if (isRectangleIntersect({
        x: position.left,
        y: position.top,
        width: position.width,
        height: position.height,
      },
        box.getBoundingClientRect()
      )) {
        selectDoms.push(box);
      }
    });
    onSelectChange && onSelectChange(selectDoms);
  }, [position]);


  return createPortal((
    isPress.current && (
      <div
        className='fixed bg-[rgba(0,0,0,0.2)]'
        style={{
          border: '1px solid #666',
          ...style,
          ...position,
        }}
      />)
  ), document.body)
}


export default BoxSelect;