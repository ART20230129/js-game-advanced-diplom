import { calcTileType } from '../utils';

test.each([
  [0, 8, 'top-left'],
  [5, 8, 'top'],
  [7, 8, 'top-right'],
  [15, 8, 'right'],
  [63, 8, 'bottom-right'],
  [59, 8, 'bottom'],
  [56, 8, 'bottom-left'],
  [24, 8, 'left'],
  [29, 8, 'center'],
])('test calcTileType', (index, boardSize, expected) => {
  const recived = calcTileType(index, boardSize);
  expect(recived).toBe(expected);
});
