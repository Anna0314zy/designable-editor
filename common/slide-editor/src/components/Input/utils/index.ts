/*
 * @Date: 2023-12-01 10:19:48
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-05 11:18:04
 * @FilePath: /slide-editor/src/utils/index.ts
 */
export function areObjectsEqual(obj1, obj2) {
  // 检查对象的类型
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  // 获取两个对象的属性键数组
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 检查属性键数量是否相等
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 检查每个属性值
  for (let key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    // 递归比较对象或数组的属性值
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      if (!areObjectsEqual(value1, value2)) {
        return false;
      }
    } else if (value1 !== value2) {
      return false;
    }
  }

  return true;
}

export function deepClone(obj) {
  // 检查对象的类型
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 创建一个新的对象或数组
  const clone = Array.isArray(obj) ? [] : {};

  // 遍历对象的属性
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 递归进行深拷贝
      clone[key] = deepClone(obj[key]);
    }
  }

  return clone;
}

export function generateUUID() {
  const timestamp = new Date().getTime();
  const randomPart = Math.random().toString(36).substr(2, 5);
  
  return `${timestamp}-${randomPart}`;
}