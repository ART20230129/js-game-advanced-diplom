import Bowman from '../characters/Bowman';
import Character from '../Character';

test('character creation Bowman', () => {
  const unit = new Bowman(3);
  const result = {

    type: 'bowman',
    health: 100,
    level: 3,
    attack: 25,
    defence: 25,
  };
  expect(unit).toEqual(result);
});

test('Trying to create a Character', () => {
  const received = () => new Character();
  const result = 'Нельзя создавать объекты через new Character()';
  expect(received).toThrow(result);
});
