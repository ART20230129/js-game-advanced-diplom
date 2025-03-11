import Character from '../Character';

/* export default class Magician extends Character {
        constructor(level) {
          super(level);
          this.type = 'magician'; //волшебник
          this.attack = 10;
          this.defence = 40;
          //this.health = 100;
        }
} */

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 10;
    this.defence = 40;
    this.health;
  }
}
