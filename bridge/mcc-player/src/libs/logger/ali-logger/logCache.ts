// 定义一个类型别名 TaskID，表示任务 ID，是一个数字类型
type TaskID = number;

// 定义一个泛型类 TaskArrayManager，用于管理任务数组
export class TaskArrayManager<T> {
  // 私有成员变量 _array，表示任务数组
  private _array: any[];
  // 私有成员变量 _tasks，表示任务 Map，用于存储已经被移除的任务
  private _tasks: Map<TaskID, { index: number; items: T[] }>;
  // 私有成员变量 _localStorageArrayKey，表示任务数组在 localStorage 中的 key
  private _localStorageArrayKey: string;
  // 私有成员变量 _localStorageTasksKey，表示任务 Map 在 localStorage 中的 key
  private _localStorageTasksKey: string;
  // 私有成员变量 _failureCount，表示任务失败的次数
  private _failureCount = 0;
  // 私有成员变量 MAX_FAILURE_COUNT，表示任务失败的最大次数
  private readonly MAX_FAILURE_COUNT = 10;
  // 私有成员变量 MAX_LOCAL_LOGS_COUNT，表示本地日志的最大数量
  private readonly MAX_LOCAL_LOGS_COUNT = 2000;

  // 构造函数，用于初始化任务数组和任务 Map
  constructor(
    localStorageArrayKey: string,
    localStorageTasksKey: string,
    initialArray: T[] = []
  ) {
    // 初始化任务 Map
    this._tasks = new Map<TaskID, { index: number; items: T[] }>();
    // 初始化任务数组在 localStorage 中的 key
    this._localStorageArrayKey = localStorageArrayKey;
    // 初始化任务 Map 在 localStorage 中的 key
    this._localStorageTasksKey = localStorageTasksKey;

    // 从 localStorage 中加载数组数据
    const localStorageArrayData = localStorage.getItem(
      this._localStorageArrayKey
    );
    if (localStorageArrayData) {
      // 如果 localStorage 中存在任务数组数据，则将其解析为数组并赋值给 _array
      this._array = JSON.parse(localStorageArrayData);
    } else {
      // 如果 localStorage 中不存在任务数组数据，则将初始数组赋值给 _array，并将其保存到 localStorage 中
      this._array = initialArray;
      this.saveArrayToLocalStorage();
    }

    // 从 localStorage 中加载任务数据
    const localStorageTasksData = localStorage.getItem(
      this._localStorageTasksKey
    );
    if (localStorageTasksData) {
      // 如果 localStorage 中存在任务数据，则将其解析为对象，并将其中的任务数组插入到 _array 中
      const tasksObj = JSON.parse(localStorageTasksData) as {
        [taskID: number]: { index: number; items: T[] };
      };
      for (const taskID in tasksObj) {
        this._array.splice(0, 0, ...tasksObj[taskID].items);
      }
      // 将 _array 保存到 localStorage 中
      this.saveArrayToLocalStorage();
    }
  }

  // 将任务数组保存到 localStorage 中
  private saveArrayToLocalStorage(): void {
    // ERROR 事件不存在localstorage
    const _array = this._array.filter(log => log.level !== 'error')
    try {
      localStorage.setItem(
        this._localStorageArrayKey,
        JSON.stringify(_array)
      );
    } catch(e) {
      if (e instanceof DOMException && e.code === DOMException.QUOTA_EXCEEDED_ERR) {
        if (localStorage.length === 0) {
            // localStorage 是满的，但是没有存储任何东西
            // 可能是在隐私模式下
        } else {
            // localStorage 是满的，并且至少存储了一些东西
            localStorage.removeItem(this._localStorageArrayKey)
        }
      }
    }
  }

  // 获取任务数组的长度
  get length(): number {
    return this._array.length;
  }

  // 将任务 Map 保存到 localStorage 中
  private saveTasksToLocalStorage(): void {
    const tasksObj: { [taskID: number]: { index: number; items: T[] } } = {};
    this._tasks.forEach((value, key) => {
      tasksObj[key] = value;
    });
    try {
      localStorage.setItem(this._localStorageTasksKey, JSON.stringify(tasksObj));
    } catch(e) {
      if (e instanceof DOMException && e.code === DOMException.QUOTA_EXCEEDED_ERR) {
        if (localStorage.length === 0) {
            // localStorage 是满的，但是没有存储任何东西
            // 可能是在隐私模式下
        } else {
            // localStorage 是满的，并且至少存储了一些东西
            localStorage.removeItem(this._localStorageTasksKey)
        }
      }
    }
    
  }

  // 从任务数组中移除一段元素，并返回一个新的任务 ID
  public spliceAndGetTaskID(index: number, deleteCount: number): TaskID {
    const removedItems = this._array.splice(index, deleteCount);
    const taskID = Date.now();

    if (removedItems.length > 0) {
      // 如果移除的元素数量大于 0，则将其插入到任务 Map 中，并将任务 Map 保存到 localStorage 中
      this._tasks.set(taskID, { index, items: removedItems.filter(log => log.level !== 'error') });
      this.saveTasksToLocalStorage();
    }

    // 将任务数组保存到 localStorage 中，并返回新的任务 ID
    this.saveArrayToLocalStorage();
    return taskID;
  }

  // 标记任务成功
  public taskSucceeded(taskID: TaskID): void {
    // 重置任务失败的次数，并从任务 Map 中删除该任务
    this._failureCount = 0;
    this._tasks.delete(taskID);
    // 将任务 Map 保存到 localStorage 中
    this.saveTasksToLocalStorage();
  }

  // 标记任务失败
  public taskFailed(taskID: TaskID): void {
    // 增加任务失败的次数
    this._failureCount++;
    const task = this._tasks.get(taskID);

    if (task) {
      // 如果任务存在，则将其插入到任务数组中，并从任务 Map 中删除该任务
      this._array.splice(task.index, 0, ...task.items);
      this._tasks.delete(taskID);
      // 将任务数组和任务 Map 保存到 localStorage 中
      this.saveArrayToLocalStorage();
      this.saveTasksToLocalStorage();
    }
    if (
      // 如果任务失败的次数超过了最大失败次数，并且任务数组的长度超过了最大本地日志数量
      this._failureCount >= this.MAX_FAILURE_COUNT &&
      this._array.length > this.MAX_LOCAL_LOGS_COUNT
    ) {
      // 则重置任务失败的次数，并清空任务数组，并将其保存到 localStorage 中
      this._failureCount = 0;
      this._array = [];
      this.saveArrayToLocalStorage();
    }
  }

  // 获取任务数组
  public getItems(): T[] {
    return this._array;
  }

  // 根据任务 ID 获取任务数组中的元素
  public getItemsByTaskID(taskID: TaskID): T[] {
    const task = this._tasks.get(taskID);

    if (task) {
      return task.items;
    }

    return [];
  }

  // 向任务数组中添加一个元素
  public addItem(item: T): void {
    this._array.push(item);
    this.saveArrayToLocalStorage();
  }
}
