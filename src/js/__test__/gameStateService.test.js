/* import GameStateService from '../GameStateService';
import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameState from '../GameState';

const storage = {};
const gamePlay = new GamePlay();
const stateService = new GameStateService(storage);
const gameController = new GameController(gamePlay, stateService); */

import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

jest.mock('../GamePlay');
// beforeEach(() => jest.resetAllMocks());

beforeEach(() => {
  jest.resetAllMocks();
});

/* test('Trying to load from localStorage', () => {
  const state = {
    level: 1,
    positions: [],
    theme: 'prairie',
    score: 0,
  };
  const gameState = new GameStateService(localStorage);
  gameState.save(state);
  const load = jest.fn(gameState.load());
  load.mockReturnValue(state);
  expect(gameState.load()).toEqual(load());
}); */

test('Error load', () => {
  const gameState = new GameStateService(null);
  expect(() => gameState.load()).toThrow('Invalid state');
});

test('При отсувствии данных выбрасывается ошибка', () => {
  const stateService = new GameStateService(null);
  const mock = jest.fn(() => GamePlay.showError('Loading failed!'));

  try {
    stateService.load();
  } catch (err) {
    mock();
  }

  expect(mock).toHaveBeenCalled();
});
