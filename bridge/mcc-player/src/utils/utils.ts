/**
 * @description: 获取url参数
 * @param {string} url  url
 * @param {string} key 对应key
 * @return {*}
 */
export function getUrlParams(url: string, key?: string): string | Record<string, string> {
  const searchParams = new URLSearchParams(url.split('?')[1]);

  if (key) {
    return searchParams.get(key) || '';
  }

  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}


export function transformData(data: any[]): Record<string, any> {
  const result: Record<string, any> = {};

  for (const item of data) {
    if(item.pageId) {
      result[item.pageId] = item;
    }
  }

  return result;
}


/**
 * @description: 对比两个对象是否完全一样
 * @param {*} obj1
 * @param {*} obj2
 * @return {*}
 */
export function areObjectsEqual(obj1:unknown, obj2: unknown) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
  // 检查对象的类型
  // if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
  //   return false;
  // }

  // // 获取两个对象的属性键数组
  // const keys1 = Object.keys(obj1);
  // const keys2 = Object.keys(obj2);

  // // 检查属性键数量是否相等
  // if (keys1.length !== keys2.length) {
  //   console.log('对比新老数据区别为', keys1.length, keys2.length)
  //   return false;
  // }

  // // 检查每个属性值
  // for (const key of keys1) {
  //   const value1 = obj1[key];
  //   const value2 = obj2[key];

  //   // 递归比较对象或数组的属性值
  //   if (typeof value1 === 'object' && typeof value2 === 'object') {
  //     if (!areObjectsEqual(value1, value2)) {
  //       console.log('对比新老数据区别为',key, value1, value2)
  //       return false;
  //     }
  //   } else if (value1 !== value2) {
  //     console.log('对比新老数据区别为',key, value1, value2)
  //     return false;
  //   }
  // }

  // return true;
}


/**
 * @description: 字符串替换为指定值
 * @param {string} template 整个资源路径
 * @param {object} replacements 要替换的值
 * @return {*}
 */
export function replacePlaceholders(template: string, replacements: { [x: string]: any; }) {
  return template.replace(/{(.*?)}/g, (match, key) => replacements[key] || match);
}



export function deepClone<T>(obj: T): T {
  // 如果不是对象，或者是 null，直接返回原对象
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 创建一个容器，用于存放新的对象
  let copy: any;

  // 检查对象是数组还是对象，并创建一个新的数组或对象
  if (Array.isArray(obj)) {
    copy = [];
  } else {
    copy = {};
  }

  // 遍历对象的所有可枚举属性
  for (const key in obj) {
    // 确保属性是对象本身的，而不是继承的
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 递归拷贝所有属性
      copy[key] = deepClone(obj[key]);
    }
  }

  return copy;
}

/**
 * @description: 删除对象中 key 或value中无用字段
 * @param {T} obj
 * @return {*}
 */

export function cleanObject<T extends object>(obj: T): T {
  // 创建一个新对象来存储清理后的键值对
  const cleanedObj = {} as T;
  
  // 遍历原始对象中的每个键值对
  Object.entries(obj).forEach(([key, value]) => {
    // 检查键和值是否不为空或undefined
    if (key && value !== undefined && value !== '') {
      // 如果键和值都有效，将它们添加到新对象中
      cleanedObj[key as keyof T] = value;
    }
  });

  // 返回已清理的对象
  return cleanedObj;
}

