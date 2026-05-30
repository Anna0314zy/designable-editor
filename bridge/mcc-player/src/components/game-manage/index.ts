import GameManage from './gameManager';
class Game {
  private static gameManagerInstance: GameManage | null = null;
  private constructor() {
  }
  public static getGameManager(): GameManage {
    if (!Game.gameManagerInstance) {
      Game.gameManagerInstance = new GameManage();
    }
    return Game.gameManagerInstance;
  }
  public static resetInsatance(): void {
    Game.gameManagerInstance = null;
  }
}
export default Game;
