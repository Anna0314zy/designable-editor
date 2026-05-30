interface IPage {
  id: string;
  pageInfo: any;
  pageType: number;
}

export class Page {
  private id: string;
  private pageInfo: any;
  private pageType: number;

  private resourceList: any[] = [];

  constructor() {
    this.id = "";
    this.pageInfo = {};
    this.pageType = -1;
    this.resourceList = [];
  }
  public init(page: IPage) {
    console.log("Page constructor");
    this.id = page.id;
    this.pageInfo = page.pageInfo;
    this.pageType = page.pageType;
    console.log("Page init");
    // 获取所有的图片元素
    const imgComponents = this.getComponent("Img", page.pageInfo).map(item => {item.loaded = false; return item;});
    this.resourceList.push(...imgComponents);
  }
  // 获取组件 type 
  private getComponent(componentName: string, pageInfo:any): any[] {
    const components = []
    const children = pageInfo.children;
    if (pageInfo.componentName === componentName) {
      if(componentName === 'Img' || componentName === 'Video') {
        if(pageInfo.props.src && pageInfo.props.src.length > 0) {
          components.push(pageInfo);
        }
      } else {
        components.push(pageInfo);
      }
    }
    if (children && children.length > 0) {
      children.forEach((child:any) => {
        if (child.componentName === componentName) {
          components.push(...this.getComponent(componentName, child));
        }
      })
    }
    return components;
  }

  public loadResource():Promise<boolean> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const needLoadList = this.resourceList.filter((item) => !item.loaded)
        if (needLoadList.length === 0) {
          console.log('资源加载完成');
          clearInterval(interval);
          // 返回资源加载完成的状态
          resolve(true);
        } else {
          this.checkResource();
        }
      }, 1000);
    })
  }

  public checkResource() {
    // 检查资源是否加载完成
    for (let i = 0; i < this.resourceList.length; i++) {
      const element = this.resourceList[i];
      if(element.componentName === 'Img' && !element.loaded) {
        // console.log("file: page.ts:71 ~ Page ~ checkResource ~ element:", element)
        const imgComponent = document.querySelector(`[preview-id="${element.id}"]`) as HTMLImageElement;
        if(imgComponent) {
          const img = imgComponent.querySelector('img') as HTMLImageElement;
          if (img) {
            if(img.complete) {
              // 图片已经加载完成
              console.log('图片已经加载完成');
              element.loaded = true;
            }
          } else {
            element.loaded = true;
          }
        }
      }
    }
  }
}
