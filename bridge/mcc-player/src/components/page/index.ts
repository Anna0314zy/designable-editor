import PageManage from './pageManager';
class Page {
  private static pageManagerInstance: PageManage | null = null;
  private constructor() {
  }
  public static getPageManage(): PageManage {
    if (!Page.pageManagerInstance) {
        Page.pageManagerInstance = new PageManage();
    }
    return Page.pageManagerInstance;
  }
  public static resetInsatance(): void {
    Page.pageManagerInstance = null;
  }
}
export default Page;
