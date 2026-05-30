/**
 * cocosGameMessage
 * 用于游戏与mcc之间的通信
 */

(function (global: any) {
    global['cocosGameMessage'] = {
        handle: {},

        on(eventName: string, cb: Function, target: any) {
            if (!target) {
                console.log('注册监听失败，target 必须是继承自Component 的组件，且不能为空!');
                return;
            }
    
            if (this.hasEvent(eventName, cb, target)) {
                return;
            }
    
            if (!this.handle[eventName]) {
                this.handle[eventName] = [];
            }
            const data: any = { func: cb, target};
            this.handle[eventName].push(data);
        },
    
        off(eventName: string, cb: Function, target: any) {
            const list = this.handle[eventName];
            if (!list || list.length <= 0) {
                return;
            }
            for (let i = 0; i < list.length; i++) {
                const event = list[i];
                if (cb == event.func && target == event.target) {
                    list.splice(i, 1);
                    break;
                }
            }
        },
    
        dispatch(eventName: string, ...args: any) {
            const list = this.handle[eventName];
            if (!list || list.length <= 0) {
                return;
            }
            for (let i = 0; i < list.length; i++) {
                const event = list[i];
                if (!event.target) {
                    continue;
                }
                event.func.apply(event.target, args);
            }
        },
    
        removeAll(target?: any) {
            if (target) {
                for (let key in this.handle) {
                    let list = this.handle[key];
                    for (let i = 0, l = list.length; i < l; i++) {
                        let event = list[i];
                        if (event.target == target) {
                            list.splice(i, 1);
                            if (l > 0) {
                                l--;
                            }
                            i--;
                        }
                    }
                }
            } else {
                this.handle = {};
            }
        },
    
        hasEvent(eventName: string, cb: Function, target?: any): boolean {
            const list = this.handle[eventName];
            if (!list || list.length <= 0) {
                return false;
            }
            for (let i = 0; i < list.length; i++) {
                const event = list[i];
                if (cb == event.func && target == event.target) {
                    return true;
                }
            }
            return false;
        }
    };
})(typeof window == 'undefined' ? global : window);
