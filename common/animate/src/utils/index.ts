import { IAnimate } from "../types";
// 根据不同的触发源分组
export const getAnimateGroupByTriggerSource = (
  animateList: IAnimate[]
): Record<string, IAnimate[]> => {
  const group = animateList.reduce((prev, cur) => {
    const { triggerSource } = cur;
    if (!prev[triggerSource]) {
      prev[triggerSource] = [];
    }
    prev[triggerSource].push(cur);
    return prev;
  }, {} as Record<string, IAnimate[]>);
  return group;
};
