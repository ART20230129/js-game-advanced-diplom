import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const stateService = new GameStateService();
const gameController = new GameController(new GamePlay(), stateService);

test('тесты на особенности атаки и движения Magician/Daemon (позиция 9 клетка)', () => {
  const possibleMove = [
    0, 1, 2, 8, 9, 10, 16, 17, 18,
  ];
  const possibleAttack = [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45];
  expect(gameController.farCounter(9, 1)).toEqual(possibleMove);
  expect(gameController.farCounter(9, 4)).toEqual(possibleAttack);
});

test('тесты на особенности атаки и движения Swordsman/Undead (позиция 17 клетка)', () => {
  const possibleMove = [
    0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45, 48, 49, 50, 51, 52, 53,
  ];
  const possibleAttack = [8, 9, 10, 16, 17, 18, 24, 25, 26];
  expect(gameController.farCounter(17, 4)).toEqual(possibleMove);
  expect(gameController.farCounter(17, 1)).toEqual(possibleAttack);
});

test('тесты на особенности атаки и движения Bowman/Vampire (позиция 35 клетка)', () => {
  const possibleMove = [
    17, 18, 19, 20, 21, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 49, 50, 51, 52, 53,
  ];
  const possibleAttack = [17, 18, 19, 20, 21, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 49, 50, 51, 52, 53];
  expect(gameController.farCounter(35, 2)).toEqual(possibleMove);
  expect(gameController.farCounter(35, 2)).toEqual(possibleAttack);
});
