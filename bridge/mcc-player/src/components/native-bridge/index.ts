import NativeManage from './nativeBridgeManage';
class NativeBridge {
  private static nativeManage: NativeManage | null = null;
  private constructor() {
  }
  public static getNativeManager(): NativeManage {
    if (!NativeBridge.nativeManage) {
        NativeBridge.nativeManage = new NativeManage();
    }
    return NativeBridge.nativeManage;
  }
  public static resetInsatance(): void {
    NativeBridge.nativeManage = null;
  }
}
export default NativeBridge;
