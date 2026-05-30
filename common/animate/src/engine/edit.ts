import { TreeNode } from "@editor/core";
import { IAnimate, AnimationType } from "../types";
import { animations } from "../config/animate_css";

export class AnimateEngine {
  /**
   * @description 获取真实需要执行的动画
   * @param {IAnimate} animate
   * @returns {*}  {IAnimate}
   * @memberof AnimateEngine
   */
  protected getAnimate(animate: IAnimate): IAnimate {
    const { type, name, direction } = animate;
    const animateObj = animations[type].find((config) => config.value === name);
    if (!animateObj) {
      throw new Error("动画不存在");
    }
    const { directions, value } = animateObj;
    if (!Array.isArray(directions)) {
      return Object.assign({},animate, {
        name: value,
      }) as unknown as IAnimate;
    }
    const animateDirection = directions.find(
      (config) => config.key === direction
    );
    return Object.assign({}, animate, {
      name: animateDirection.value,
    }) as unknown as IAnimate;
  }

  /**
   * @description 获取动画样式
   * @private
   * @param {IAnimate} animate
   * @returns {*}
   * @memberof AnimateEngine
   */
  protected getAnimateStyle(animate: IAnimate) {
    /* @keyframes duration | easing-function | delay | iteration-count | direction | fill-mode | play-state | name */
    return `${animate.duration}s ease ${
      animate.delay || 0
    }s 1 normal none running ${animate.name}`;
  }

  /**
   * @description 重置动画状态
   * @private
   * @param {HTMLElement} el
   * @memberof AnimateEngine
   */
  public resetAnimateState(el: HTMLElement) {
    el.style.setProperty("opacity", "1");
    el.style.setProperty("animation", "");
    el.style.setProperty("-webkit-animation", "");
  }

  protected addEventListener(
    events: string,
    el: HTMLElement,
    callBack: Function
  ) {
    events.split(" ").forEach((event) => {
      el.addEventListener(
        event,
        (evt) => {
          callBack && callBack(evt);
        },
        { passive: true, once: true }
      );
    });
  }

  protected animationEnd(el: HTMLElement, callBack: Function) {
    this.addEventListener(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      el,
      callBack
    );
  }

  public play(node: TreeNode, animate: IAnimate, completeCallBack: Function) {
    const el = node.getElement().children[0] as HTMLElement;
    this.resetAnimateState(el);
    const styles = this.getAnimateStyle(animate);
    el.style.setProperty("animation", `${styles}`);
    el.style.setProperty("-webkit-animation", `${styles}`);
    this.animationEnd(el, () => {
      this.resetAnimateState(el);
      completeCallBack && completeCallBack();
    });
  }

  protected hideNode(node: TreeNode, animate: IAnimate) {
    if (animate.type === AnimationType.Entrance) {
      (node.getElement().children[0] as HTMLElement).style.opacity = "0";
    }
  }

  public preview(node: TreeNode, animate: IAnimate) {
    this.hideNode(node, animate);
    animate = this.getAnimate(animate);
    this.play(node, animate, () => {});
  }

  public getFirstChildHtmlElement(el: HTMLElement) {
    return el.children[0] as HTMLElement;
  }

  protected setElVisibility(el: HTMLElement, visibility: boolean) {
    el.style.setProperty("visibility", visibility ? "visible" : "hidden");
    el.style.setProperty("opacity", visibility ? "1" : "0");
  }

  protected setElStyleAnimation(el: HTMLElement, styles: string) {
    el.style.setProperty("animation", `${styles}`);
    el.style.setProperty("-webkit-animation", `${styles}`);
  }
}
