import Magician from '../characters/Magician';

test('character creation Magician', () => {
  const unit = new Magician(2);
  const result = {

    type: 'magician',
    health: 100,
    level: 2,
    attack: 10,
    defence: 40,
  };
  expect(unit).toEqual(result);
});
