import { Mode } from "../shared";
import { CoursewareEvent, CoursewareCommand } from "../utils";

export class PostMessageClient {
    private listeners: any[];
    private channel: any;
    private isMain: boolean;
    private isPreview: boolean;

    constructor({mode,player}) {
        this.listeners = [];
        if(player == "preview"){
            // 本地模拟用 BroadcastChannel 类似教学场景的广播
            this.channel = new BroadcastChannel('Signalling');
        } else {
            this.channel = {
                sendMessage: (data:any) => {
                    console.log("file: PostMessageClient.ts:18 ~ PostMessageClient ~ constructor ~ data:", data);
                    return new Promise((resolve) => {
                        (window.microApp as unknown as any).forceDispatch(data, resolve);
                    });
                },
            };
        }
        this.isPreview = player == "preview" ? true : false;

        this.isMain = mode == Mode.Sender ? true : false;
        if(this.isPreview) {
            this.channel.onmessage = (event) => {
                const data = event.data;
                this.listeners.forEach((listener) => {
                    listener(data);
                });
            };
        } else {
            const mainDataListener = (info: {type, param, timestamp}) => {
                if(info.type === CoursewareCommand.TransferMessageReceive){
                    console.log("file: PostMessageClient.ts:36 ~ PostMessageClient ~ mainDataListener ~ info:", info);
                    this.listeners.forEach((listener) => {
                        console.log("file: PostMessageClient.ts:47 ~ PostMessageClient ~ this.listeners.forEach ~ listener:", listener);
                        listener(info.param);
                    });
                }
            };
            window.microApp.addDataListener(mainDataListener,true);
        }
    }

    // 发送端发送消息
    public sendWithRetry(message: any) {
        if (!this.isMain) {
            return;
        }
        if(this.isPreview){
            this.channel.postMessage(message);
        } else {
            const data = {type:CoursewareEvent.TransferMessageSend,param:message,timestamp: message.timeStamp};
            this.channel.sendMessage(data);
            message.marked = true;
        }
        return Promise.resolve({ isOk: true });
    }

    // 接收端接收消息
    public onMessage(callback: (message: any) => void) {
        // if (this.isMain) {
        //     return;
        // }

        this.listeners.push(callback);

        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    public close() {
        this.channel.close();
    }
}