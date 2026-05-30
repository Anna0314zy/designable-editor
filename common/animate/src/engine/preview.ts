import { AnimateEngine } from "./edit";
import { IAnimate, AnimationType, AnimationTrigger, AnimationStatus } from "../types";
import { getAnimateGroupByTriggerSource } from "../utils";
import { LogAct, LogName, ResourceType } from "../componments/constant";

const WORKSPACE = "workspace";

/**
 * 预览动画引擎类，继承自AnimateEngine
 *
 * @export
 * @class PreviewAnimateEngine
 * @extends {AnimateEngine}
 */
export class PreviewAnimateEngine extends AnimateEngine {
  /**
   * @description 工作区ID
   * @private
   * @type {string}
   * @memberof PreviewAnimateEngine
   */
  private workspaceId: string;
  /**
   * @description 当前页动画列表
   * @private
   * @type {IAnimate[]}
   * @memberof PreviewAnimateEngine
   */
  private animateList: IAnimate[] = [];
  /**
   * @description 动画目标元素的映射
   * @private
   * @type {Record<string, HTMLElement>}
   * @memberof PreviewAnimateEngine
   */
  private animateTargetElMap: Record<string, HTMLElement> = {};
  /**
   * @description 动画触发源元素的映射
   * @private
   * @type {Record<string, HTMLElement>}
   * @memberof PreviewAnimateEngine
   */
  private animateTriggerSourceElMap: Record<string, HTMLElement> = {};
  /**
   * @description 动画列表按触发源分组
   * @private
   * @type {Record<string, IAnimate[]>}
   * @memberof PreviewAnimateEngine
   */
  private animateGroupByTriggerSource: Record<string, IAnimate[]> = {};
  /**
   * @description 动画执行索引按触发源分组
   * @private
   * @type {Record<string, number>}
   * @memberof PreviewAnimateEngine
   */
  private animateRunnerIndexGroupByTriggerSourceMap: Record<string, number> =
    {};
  eventArr: any;

  animatePlayArr: any[] = [];

  animateStatusArr: any[] = [];

  sendChangeMessage: any;
  // 记录播放完成的动画
  animatePlayRecord: any;

  changeElement: any;

  registerMsg: any;

  sendLog: any;


  /**
   * 创建一个PreviewAnimateEngine实例
   *
   * @param {IAnimate[]} animateList 动画列表
   * @param {string} workspaceId 工作区ID
   * @memberof PreviewAnimateEngine
   */
  constructor({sendChangeMessage, registerMsg, sendLog}) {
    super();
    this.sendChangeMessage = sendChangeMessage;
    this.registerMsg = registerMsg
    this.sendLog = sendLog ? sendLog : null
  }

  public init(props) {
    const { animateList, workspaceId } = props;
    console.log("file: preview.ts:73 ~ PreviewAnimateEngine ~ init ~ animateList:", animateList)
    this.workspaceId = workspaceId;
    this.animateList = animateList;
    // 在进行分组之前需要把所有的动画都按照触发源排序
    // 但是需要把所有的 Auto 类型的动画放到最后，然后根据不同的触发源分组
    this.animateGroupByTriggerSource = this.moveAutoAnimationsToEnd(
      getAnimateGroupByTriggerSource(animateList)
    );
    // const { triggerMap, triggerSourceMap } = this.getAnimateElMap(animateList);
    // console.log("file: preview.ts:81 ~ PreviewAnimateEngine ~ init ~ triggerMap, triggerSourceMap:", triggerMap, triggerSourceMap)
    // this.animateTargetElMap = triggerMap;
    // this.animateTriggerSourceElMap = triggerSourceMap;
    this.animatePlayRecord = []
    this.animatePlayArr = [];
    this.animateStatusArr = [];
    this.animateRunnerIndexGroupByTriggerSourceMap = {};
    this.setupInitialStates();
    this.bindAnimateElementEvent();
    this.addAnimateController();
  }

  public ready(queue) {
    // this.bindAnimateElementEvent();
    this.runAutoPlayAnimate(queue);
  }

  public reset() {
    this.workspaceId = "";
    this.animateList = [];
    this.animateTargetElMap = {};
    this.animateTriggerSourceElMap = {};
    this.animateGroupByTriggerSource = {};
    this.animateRunnerIndexGroupByTriggerSourceMap = {};
    this.animatePlayArr = [];
    this.animateStatusArr = [];
    this.animatePlayRecord = []
  }

  /**
   * 把自动播放的动画移动到最后
   *
   * @private
   * @param {Record<string, IAnimate[]>} animateGroupByTriggerSource 按触发源分组的动画列表
   * @returns {Record<string, IAnimate[]>} 移动后的动画列表
   * @memberof PreviewAnimateEngine
   */
  private moveAutoAnimationsToEnd(
    animateGroupByTriggerSource: Record<string, IAnimate[]>
  ): Record<string, IAnimate[]> {
    return Object.keys(animateGroupByTriggerSource).reduce((prev, cur) => {
      const animateList = animateGroupByTriggerSource[cur];
      const autoAnimateList = animateList.filter(
        (animate) => animate.trigger === AnimationTrigger.Auto
      );
      const otherAnimateList = animateList.filter(
        (animate) => animate.trigger !== AnimationTrigger.Auto
      );
      prev[cur] = [...otherAnimateList, ...autoAnimateList].map(
        (animate, index) => {
          const ani = { ...animate };
          ani.sort = index;
          return ani;
        }
      );
      return prev;
    }, {} as Record<string, IAnimate[]>);
  }

  /**
   * 运行自动播放的动画
   *
   * @private
   * @memberof PreviewAnimateEngine
   */
  private runAutoPlayAnimate(queue) {
    const ids = queue.map(item => item.id)
    const animateList = this.animateList.filter(
      (animate) => animate.trigger === AnimationTrigger.Auto && !ids.includes(animate.id)
    );
    console.log("file: preview.ts:149 ~ PreviewAnimateEngine ~ runAutoPlayAnimate ~ animateList:", animateList)
    animateList.forEach((animate) => {
      this.playSingleAnimate(animate);
    });
  }
  /**
   * @description 根据id获取动画对象
   * @param {string} id
   * @returns {*}
   * @memberof PreviewAnimateEngine
   */
  getPreviewSelector(id: string) {
    return `[preview-id="${id}"]`;
  }

  /**
   * 获取动画元素的映射
   *
   * @private
   * @param {IAnimate[]} animateList 动画列表
   * @returns {Record<string, Record<string, HTMLElement>>} 动画元素的映射
   * @memberof PreviewAnimateEngine
   */
  private getAnimateElMap(
    animateList: IAnimate[]
  ): Record<string, Record<string, HTMLElement>> {
    const map = animateList.reduce(
      (prev, cur) => {
        const { target, triggerSource } = cur;
        const triggerEl = document.querySelector(
          this.getPreviewSelector(target)
        ) as HTMLElement;
        const triggerSourceEl = document.querySelector(
          WORKSPACE === triggerSource
            ? this.getPreviewSelector(this.workspaceId)
            : this.getPreviewSelector(triggerSource)
        ) as HTMLElement;
        if (!triggerEl || !triggerSourceEl) {
          throw new Error(`id为 ${target} 的元素不存在`);
        }
        prev.triggerMap[target] = triggerEl;
        prev.triggerSourceMap[triggerSource] = triggerSourceEl;
        return prev;
      },
      { triggerMap: {}, triggerSourceMap: {} } as Record<
        string,
        Record<string, HTMLElement>
      >
    );
    return map;
  }

  /**
   * 绑定动画元素的事件
   *
   * @memberof PreviewAnimateEngine
   */
  public bindAnimateElementEvent() {
    const container = document.querySelector(`[preview-id="${this.workspaceId}"]`);
    if(!container) {
      return null;
    }
    container.addEventListener("click",(event) => {
      const target = event.target as unknown as HTMLElement ;
      const previewId = target.closest("[preview-id]")?.getAttribute("preview-id");
      if(previewId) {
        const animateList = this.animateGroupByTriggerSource[previewId];
        if(animateList && animateList.length > 0) {
          this.playAnimateByTriggerSource(previewId);
        } else {
          this.playAnimateByTriggerSource("workspace");
        }
      } else {
        this.playAnimateByTriggerSource("workspace");
      }
    },false)
  }

  /**
   * 绑定点击事件
   *
   * @private
   * @param {string} triggerSource 触发源
   * @memberof PreviewAnimateEngine
   */
  private bindClickEvent(triggerSource: string) {
    const el = this.animateTriggerSourceElMap[triggerSource];
    el.addEventListener("click",(event)=>{
      event.preventDefault()
      event.stopPropagation()
      this.playAnimateByTriggerSource(triggerSource);
    },false)
  }

  /**
   * 根据触发源播放动画
   *
   * @param {string} triggerSource 触发源
   * @memberof PreviewAnimateEngine
   */
  private playAnimateByTriggerSource(triggerSource: string) {
    const animate = this.getNextAnimateByRunner(triggerSource);
    if (!animate) {
      return;
    }
    this.playSingleAnimate(animate);
  }

  // 休眠函数
  public sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  /**
   * 播放单个动画
   *
   * @param {IAnimate} animate 动画对象
   * @param {boolean} [isMulti=false] 是否为多个动画
   * @memberof PreviewAnimateEngine
   */
  private async playSingleAnimate(animate: IAnimate, isMulti = false) {
    if (!isMulti) {
      const nextParallelAnimateList = [
        animate,
        ...this.getNextParallelAnimate(animate),
      ];
      console.log("file: preview.ts:268 ~ PreviewAnimateEngine ~ playSingleAnimate ~ nextParallelAnimateList:", nextParallelAnimateList)

      if (nextParallelAnimateList.length > 1) {
        this.playMultiAnimate(nextParallelAnimateList);
        return;
      }
    }
    if(this.animatePlayRecord.includes(animate.id)) {
      return null
    }
    this.animatePlayRecord.push(animate.id)
    const eventRecord = this.animateStatusArr.find((item) => item.id === animate.id);
    if(eventRecord) {
      eventRecord.notice({ animateId: animate.id, status: AnimationStatus.Running });
    }
    const event = this.animatePlayArr.find((item) => item.id === animate.id);
    if (event) {
      event.notice({ animateId: animate.id, info: "animate play" });
      // 埋点-信令发送
      this.sendLog({name: LogName.Message, act: LogAct.Send, id: animate.id, option:{ event_type: "animate", event_act: "play" }})
    }
    animate = this.getAnimate(animate);
    // 埋点-动画播放
    this.sendLog({name: LogName.AnimateEvent, act: LogAct.Play, id: animate.id})
    if(animate.delay) {
      const delay = animate.delay * 1000;
      await this.sleep(delay)
      animate.delay = 0;
    }
    // 自动播放动画不需要记录索引
    if (animate.trigger !== AnimationTrigger.Auto) {
      this.animateRunnerIndexGroupByTriggerSourceMap[animate.triggerSource] =
        animate.sort;
    }
    switch (animate.type) {
      case AnimationType.Entrance:
        console.log("播放入场动画");
        this.playEntranceAnimate(animate);
        break;
      case AnimationType.Exit:
        console.log("播放出场动画");
        this.playExitAnimate(animate);
        break;
      case AnimationType.Emphasis:
        console.log("播放强调动画");
        this.playEmphasisAnimate(animate);
        break;
      default:
        break;
    }
    this.animationEnd(
      this.getFirstChildHtmlElement(this.getTargetElByAnimate(animate)),
      () => {
        console.log("动画播放完毕");
        const eventRecord = this.animateStatusArr.find((item) => item.id === animate.id);
        if(eventRecord) {
          eventRecord.notice({ animateId: animate.id, status: AnimationStatus.Finished });
        }
        this.sendChangeMessage()
        this.animateEndHandler(animate);
      }
    );
  }

  /**
   * 根据动画获取要驱动的元素
   *
   * @param {IAnimate} animate 动画对象
   * @returns {HTMLElement} 要驱动的元素
   * @memberof PreviewAnimateEngine
   */
  getTargetElByAnimate(animate: IAnimate): HTMLElement {
    const { target } = animate;
    const triggerEl = document.querySelector(
      this.getPreviewSelector(target)
    ) as HTMLElement;
    return triggerEl;
  }

  /**
   * 播放多个动画
   *
   * @param {IAnimate[]} animateList 动画列表
   * @memberof PreviewAnimateEngine
   */
  private playMultiAnimate(animateList: IAnimate[]) {
    animateList.forEach((animate) => {
      this.playSingleAnimate(animate, true);
    });
  }

  /**
   * 动画结束处理函数，用于判断是否需要播放下一个动画
   *
   * @private
   * @param {IAnimate} animate 动画对象
   * @memberof PreviewAnimateEngine
   */
  private animateEndHandler(animate: IAnimate) {
    const nextAnimate = this.getNextAnimateByRunner(animate.triggerSource);
    if (nextAnimate) {
      console.log("file: preview.ts:367 ~ PreviewAnimateEngine ~ animateEndHandler ~ nextAnimate:", nextAnimate)
      if (nextAnimate.trigger === AnimationTrigger.Serial) {
        this.playSingleAnimate(nextAnimate);
      }
    }
  }

  /**
   * 递归获取后面的串行动画
   *
   * @param {IAnimate} animate 动画对象
   * @returns {IAnimate[]} 串行动画列表
   * @memberof PreviewAnimateEngine
   */
  getNextParallelAnimate(animate: IAnimate): IAnimate[] {
    const nextAnimate = this.getNextAnimate(animate);
    console.log("file: preview.ts:373 ~ PreviewAnimateEngine ~ getNextParallelAnimate ~ nextAnimate:", nextAnimate)
    if (nextAnimate) {
      if (nextAnimate.trigger === AnimationTrigger.Parallel) {
        return [nextAnimate, ...this.getNextParallelAnimate(nextAnimate)];
      }
    }
    return [];
  }

  /**
   * 根据当前的执行情况获取下一个动画
   *
   * @private
   * @param {string} triggerSource 触发源
   * @returns {(IAnimate | null)} 下一个动画对象
   * @memberof PreviewAnimateEngine
   */
  private getNextAnimateByRunner(triggerSource: string): IAnimate | null {
    const animateList = this.animateGroupByTriggerSource[triggerSource] || [];
    const needPlayAnimateList = animateList.filter((animate) => {
      return !this.animatePlayRecord.includes(animate.id)
    })
    if(needPlayAnimateList.length === 0) {
      return null
    } else {
      return needPlayAnimateList[0]
    }
  }

  /**
   * 获取下一个动画
   *
   * @private
   * @param {IAnimate} animate 当前动画对象
   * @returns {(IAnimate | null)} 下一个动画对象
   * @memberof PreviewAnimateEngine
   */
  private getNextAnimate(animate: IAnimate): IAnimate | null {
    const animates = this.animateGroupByTriggerSource[animate.triggerSource];
    const index = animates.findIndex((item) => item.id === animate.id);
    return animates[index + 1] || null;
  }

  /**
   * 播放入场动画
   *
   * @private
   * @param {IAnimate} animate 动画对象
   * @memberof PreviewAnimateEngine
   */
  private playEntranceAnimate(animate: IAnimate) {
    const el = this.getTargetElByAnimate(animate);
    this.setElVisibility(el, true);
    const styles = this.getAnimateStyle(animate);
      this.setElStyleAnimation(this.getFirstChildHtmlElement(el), styles);
  }

  /**
   * 播放出场动画
   *
   * @private
   * @param {IAnimate} animate 动画对象
   * @memberof PreviewAnimateEngine
   */
  private playExitAnimate(animate: IAnimate) {
    const el = this.getTargetElByAnimate(animate);
    const styles = this.getAnimateStyle(animate);
    this.setElStyleAnimation(this.getFirstChildHtmlElement(el), styles);
    this.animationEnd(this.getFirstChildHtmlElement(el), () => {
      this.setElVisibility(el, false);
    });
  }

  /**
   * 播放强调动画
   *
   * @private
   * @param {IAnimate} animate 动画对象
   * @memberof PreviewAnimateEngine
   */
  private playEmphasisAnimate(animate: IAnimate) {
    const el = this.getTargetElByAnimate(animate);
    const styles = this.getAnimateStyle(animate);
    this.setElStyleAnimation(this.getFirstChildHtmlElement(el), styles);
  }

  /**
   * 根据动画列表初始化元素的状态
   *
   * @private
   * @memberof PreviewAnimateEngine
   */
  private setupInitialStates() {
    this.animateList.forEach((animate) => {
      const el = this.getTargetElByAnimate(animate);
      switch (animate.type) {
        case AnimationType.Entrance:
          this.setupInitialStateByEntrance(animate, el);
          break;
        case AnimationType.Exit:
          this.setupInitialStateByExit(animate, el);
          break;
        case AnimationType.Emphasis:
          this.setupInitialStateByEmphasis(animate, el);
          break;
        default:
          break;
      }
    });
  }

  /**
   * 根据id设置动画的初始状态
   * @private
   * @param id
   * @memberof PreviewAnimateEngine
   */

  public setInitialStateById(id: string) {
    const animate = this.animateList.find((item) => item.id === id);
    if (animate) {
      const el = this.getTargetElByAnimate(animate);
      switch (animate.type) {
        case AnimationType.Entrance:
          this.setupInitialStateByEntrance(animate, el);
          break;
        case AnimationType.Exit:
          this.setupInitialStateByExit(animate, el);
          break;
        case AnimationType.Emphasis:
          this.setupInitialStateByEmphasis(animate, el);
          break;
        default:
          break;
      }
    } else {
      console.error(`id为${id}的动画不存在`);
    }
  }

  /**
   * 设置元素的结束状态
   * @private
   * @memberof PreviewAnimateEngine
   */
  public setEndStateById(id: string) {
    const animate = this.animateList.find((item) => item.id === id);
    console.log("file: preview.ts:490 ~ PreviewAnimateEngine ~ setEndStateById ~ animate:", animate, id, this.animateList)
    const el = this.getTargetElByAnimate(animate);
    console.log("file: preview.ts:491 ~ PreviewAnimateEngine ~ setEndStateById ~ el:", el)
    switch (animate.type) {
      case AnimationType.Entrance:
        this.setupEndStateByEntrance(animate, el);
        break;
      case AnimationType.Exit:
        this.setupEndStateByExit(animate, el);
        break;
      case AnimationType.Emphasis:
        this.setupEndStateByEmphasis(animate, el);
        break;
      default:
        break;
    }
  }

  public setInitialState(animate) {
    const el = this.getTargetElByAnimate(animate);
    switch (animate.type) {
      case AnimationType.Entrance:
        this.setupInitialStateByEntrance(animate, el);
        break;
      case AnimationType.Exit:
        this.setupInitialStateByExit(animate, el);
        break;
      case AnimationType.Emphasis:
        this.setupInitialStateByEmphasis(animate, el);
        break;
      default:
        break;
    }
  }

  public setEndState(animate) {
    const el = this.getTargetElByAnimate(animate);
    console.log("file: preview.ts:527 ~ PreviewAnimateEngine ~ setEndState ~ el:", el, animate)
    this.animatePlayRecord.push(animate.id)
    switch (animate.type) {
      case AnimationType.Entrance:
        this.setupEndStateByEntrance(animate, el);
        break;
      case AnimationType.Exit:
        this.setupEndStateByExit(animate, el);
        break;
      case AnimationType.Emphasis:
        this.setupEndStateByEmphasis(animate, el);
        break;
      default:
        break;
    }
  }


  /**
   * 初始化入场动画的初始状态
   *
   * @private
   * @param {IAnimate} animate 动画对象
   * @param {HTMLElement} el 目标元素
   * @memberof PreviewAnimateEngine
   */
  private setupInitialStateByEntrance(animate: IAnimate, el: HTMLElement) {
    el.style.setProperty('opacity', '0')
    el.style.setProperty('visibility', 'hidden')
  }

  /**
   * 设置入场动画的结束状态
   * @private
   * @param {IAnimate} animate 动画对象
   * @param {HTMLElement} el 目标元素
   * @memberof PreviewAnimateEngine
   */
  private setupEndStateByEntrance(animate: IAnimate, el: HTMLElement) {
    el.style.setProperty('opacity', '1')
    el.style.setProperty('visibility', 'visible')
  }

  /**
   * 初始化出场动画的初始状态
   *
   * @private
   * @param {IAnimate} animate 动画对象
   * @param {HTMLElement} el 目标元素
   * @memberof PreviewAnimateEngine
   */
  private setupInitialStateByExit(animate: IAnimate, el: HTMLElement) {}

  /**
   * 设置出场动画的结束状态
   *
   * @private
   * @param {IAnimate} animate 动画对象
   * @param {HTMLElement} el 目标元素
   * @memberof PreviewAnimateEngine
   */
  private setupEndStateByExit(animate: IAnimate, el: HTMLElement) {
    el.style.setProperty('opacity', '0')
    el.style.setProperty('visibility', 'hidden')
  }

  /**
   * 初始化强调动画的初始状态
   *
   * @private
   * @param {IAnimate} animate 动画对象
   * @param {HTMLElement} el 目标元素
   * @memberof PreviewAnimateEngine
   */
  private setupInitialStateByEmphasis(animate: IAnimate, el: HTMLElement) {}

  /**
   * 设置强调动画的结束状态
   * @private
   * @param {IAnimate} animate 动画对象
   * @param {HTMLElement} el 目标元素
   * @memberof PreviewAnimateEngine
   */
  private setupEndStateByEmphasis(animate: IAnimate, el: HTMLElement) {}

  /**
   * 接收动画状态
   *
   * @private
   * @memberof PreviewAnimateEngine
   */
  private receiveAnimateState() {}

  /**
   * 广播动画状态
   *
   * @private
   * @memberof PreviewAnimateEngine
   */
  private boradcastAnimateState() {}

  public addAnimateController() {
			this.animateList.forEach((animate) => {
				const {notice:animatePlayNotice, register:animatePlayRegister} = this.registerMsg(
					animate.id,
					"animatePlay",
					"event",
					this.workspaceId
				)
				animatePlayRegister((data) => {
					console.log("file: animate.tsx:41 ~ animatePlayRegister ~ data:", data)
					const animate = this.animateList.find(
						(item) => item.id === data.animateId
					);
          // 埋点-信令接收
          this.sendLog({name: LogName.Message, act: LogAct.Receive, id: animate.id, option:{ event_type: "animate", event_act: "play" }})
					if (animate) {
						this.playSingleAnimate(animate);
					} else {
						console.warn(`id为${data.animate.id}的动画不存在`);
					}
				});
				this.registerAnimatePlay({id:animate.id, notice:animatePlayNotice, register:animatePlayRegister})
				const {notice:animateStatusNotice, register:animateStatusRegister} = this.registerMsg(
					animate.id,
					"animateStatus",
					"state",
					this.workspaceId
				)
				animateStatusRegister((data) => {
					console.log("file: animate.tsx:59 ~ animateStatusRegister ~ data:", data)
					const animate = this.animateList.find(
						(item) => item.id === data.animateId
					);
					console.log("file: main.tsx:131 ~ animateStatusRegister ~ animate:", animate)
					if (animate) {
						if(data.status === AnimationStatus.Pending) {
							this.setInitialStateById(animate.id);
						} else {
							this.setEndState(animate);
						}
					} else {
						console.warn(`id为${data.animate.id}的动画不存在`);
					}
				});
				this.registerAnimateStatus({id:animate.id,notice:animateStatusNotice, register:animateStatusRegister})
			})
	}

  public registerAnimatePlay({id, notice, register}) {
    this.animatePlayArr.push({id, notice, register})
  }

  public registerAnimateStatus({id, notice, register}) {
    this.animateStatusArr.push({id, notice, register})
  }
}
