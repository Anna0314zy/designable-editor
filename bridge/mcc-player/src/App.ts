import "./App.css";
import microApp from "@ld/micro-app"; 
import mccPlayer from "@/components/player";
import { PageType } from "@/components/page/type";
import { SET_CURRENT_PAGE, SET_INIT_PARAM, HIDE_GAME } from "@/components/page/const";
import axios from "axios";
window.timeStart = new Date().getTime();

declare global {
  interface Window {
    timeStart: number;
    mccEnv: any
  }
}
microApp.start({
  /**
   * 自定义fetch
   * @param {string} url 静态资源地址
   * @param {object} options fetch请求配置项
   * @param {string|null} appName 应用名称
   * @returns Promise<string>
   */
  fetch(url, options) {
    axios.defaults.headers.common["Accept"] = "*/*";
    return axios({ url, ...options }).then((res) => {
      return res.data;
    });
  }
});

class App {
  player: mccPlayer;
  rootElement: HTMLElement;
  mccContainer!: HTMLElement;
  microApps: any[] = [];
  courseMicroApp!: HTMLElement;
  cocosMicroApp!: HTMLElement;
  constructor(rootElement: HTMLElement) {
    this.player = new mccPlayer();
    this.rootElement = rootElement;
    this.createContainer();
    // 放在下一个事件循环中执行，保证元素创建完毕
    Promise.resolve().then(() => {
      this.init();
    });
  }

  createContainer() {
    this.mccContainer = document.createElement("div");
    this.mccContainer.className = "mcc-container";
    this.rootElement.appendChild(this.mccContainer);
  }

  init() {
    this.player.on(SET_CURRENT_PAGE, (data: { pageType: number }) => {
      if (data.pageType === PageType.GAME_PAGE) {
        this.setGameVisible(true);
      } else {
        this.setGameVisible(false);
      }
      this.player.gameManager.changeGamePage();
    });
    this.player.on(
      SET_INIT_PARAM,
      (data: { courseWareWidth: number; courseWareHeight: number }) => {
        const { courseWareWidth, courseWareHeight } = data;
        if(courseWareWidth) {
          this.mccContainer.style.width = courseWareWidth + "px";
          this.mccContainer.style.height = courseWareHeight + "px";
        }
      }
    );

    // 隐藏游戏
    this.player.on(HIDE_GAME, () => {
      this.setGameVisible(false);
    })

    // 如果是被嵌入的时
    this.player.getInitParams(
      this.setCoursewareUrl.bind(this) as any,
      this.setGameUrl.bind(this) as any
    );
    // microApp.addGlobalDataListener(dataListener, true);


    // function dataListener(data: any) {
    //   console.log("mcc-player全局数据", data);
    // }
  }

  /**
   * @description: 课件与游戏展示隐藏切换
   * @param {boolean} visible
   * @return {*}
   */
  setGameVisible(visible: boolean) {
    if (visible) {
      if(this.courseMicroApp) {
        this.courseMicroApp.className = 'element-hidden'
      }
      if(this.cocosMicroApp) {
        this.cocosMicroApp.className = 'element-visible'
      }
    } else {
      if(this.courseMicroApp) {
        this.courseMicroApp.className = 'element-visible';
      }
      if(this.cocosMicroApp) {
        this.cocosMicroApp.className = 'element-hidden'
      }
    }
  }

  async setCoursewareUrl(url: string): Promise<void> {
    if (this.courseMicroApp) {
      microApp.unmountApp("course");
    }
    await microApp.renderApp({
      name: "course",
      url,
      inline: true,
      container: this.mccContainer,
      lifeCycles: {
        created: () => {
          console.log("micro-app元素被创建");
        },
        beforemount: () => {
          console.log("即将被渲染");
        },
        mounted: () => {
          console.log("渲染完毕");
          microApp.router.attachToURL("course");
          // this.player.nativeBridge.CourseReady();
          // this.player.receiveStoreData();
        },
        unmount: () => {
          console.log("已经卸载");
        },
        error: (e) => {
          this.player.pageManage.aliLogSend({
            name: 'load_status',
            type: 'fail',
            message: e,
            option: {
              loadTime: Date.now() - window.timeStart
            }
          })
          console.log("渲染出错");
        },
      },
    });
    this.courseMicroApp = document.querySelector(
      "micro-app[name=course]"
    )! as HTMLElement;
    this.courseMicroApp.style.position = 'relative'
  }

  async setGameUrl(url: string) {
    if (this.cocosMicroApp) {
      await microApp.unmountApp("cocos");
    }
    await microApp.renderApp({
      name: "cocos",
      url,
      inline: true,
      container: this.mccContainer,
      disableSandbox: true,
      lifeCycles: {
        created: () => {
          console.log("micro-app cocos 元素被创建");
        },
        beforemount: () => {
          console.log("即将被渲染");
        },
        mounted: () => {
          console.log("游戏主包渲染完毕");
          microApp.router.attachToURL("cocos");
        },
        unmount: () => {
          console.log("已经卸载");
        },
        error: () => {
          console.log("渲染出错");
        },
      },
    });
    this.cocosMicroApp = document.querySelector(
      "micro-app[name=cocos]"
    )! as HTMLElement;
    this.cocosMicroApp.className = 'element-hidden'
    this.cocosMicroApp.style.position = 'absolute'
    this.cocosMicroApp.style.top = '0'
    this.cocosMicroApp.style.left = '0'

  }
}

export default App;
