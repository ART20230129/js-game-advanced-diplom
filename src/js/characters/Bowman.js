import Character from '../Character';

/* export default class Bowman extends Character {
        constructor(level) {
          super(level);
          this.type = 'bowman'//лучник
          this.attack = 25;
          this.defence = 25;
          //this.health = 100;
        }
} */

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.health;
  }
}
