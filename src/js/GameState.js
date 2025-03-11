// GameState - объект, который хранит текущее состояние игры
// (может сам себя воссоздавать из другого объекта)

export default class GameState {
  constructor() {
    this.currentLevel = 0;
    this.currentTurn = 'player'; // может быть "player" или "computer"
    this.positionedCharacters = [];
    // this.playerTeam = [];
    // this.selectedCharacter = null;
    this.level;
    this.score;
    this.record;
  }

  static from(object) {
    const gameState = new GameState();
    Object.assign(gameState, object);
    return gameState;
  }
}
