import AuthManager from './authManager';
class Auth {
  private static authManagerInstance: AuthManager | null = null;
  private constructor() {
  }
  public static getAuthManager(): AuthManager {
    if (!Auth.authManagerInstance) {
      Auth.authManagerInstance = new AuthManager();
    }
    return Auth.authManagerInstance;
  }
  public static resetInsatance(): void {
    Auth.authManagerInstance = null;
  }
}
export default Auth;
