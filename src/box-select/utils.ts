interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function isRectangleIntersect(rect1: Rect, rect2: Rect) {
  // 获取矩形1的左上角和右下角坐标
  const x1 = rect1.x;
  const y1 = rect1.y;
  const x2 = rect1.x + rect1.width;
  const y2 = rect1.y + rect1.height;

  // 获取矩形2的左上角和右下角坐标
  const x3 = rect2.x;
  const y3 = rect2.y;
  const x4 = rect2.x + rect2.width;
  const y4 = rect2.y + rect2.height;

  // 如果 `rect1` 的左上角在 `rect2` 的右下方（即 `x1 < x4` 和 `y1 < y4`），并且 `rect1` 的右下角在 `rect2` 的左上方（即 `x2 > x3` 和 `y2 > y3`），那么这意味着两个矩形相交，函数返回 `true`。
  // 否则，函数返回 `false`，表示两个矩形不相交。
  if (x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3) {
    return true;
  } else {
    return false;
  }
}
