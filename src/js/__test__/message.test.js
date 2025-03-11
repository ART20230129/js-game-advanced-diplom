import Bowman from '../characters/Bowman';

test('displaying information about the unit', () => {
  const unit = new Bowman(1);
  const received = `\u{1F396}${unit.level} \u{2694}${unit.attack} \u{1F6E1}${unit.defence} \u{2764}${unit.health} ${unit.type}`;
  const expected = '\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}100 bowman';
  expect(received).toEqual(expected);
});
