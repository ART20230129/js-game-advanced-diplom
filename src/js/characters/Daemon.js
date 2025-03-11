import Character from '../Character';

/* export default class Daemon extends Character {
        constructor(level) {
          super(level);
          this.type = 'daemon';
          this.attack = 10;
          this.defence = 10;
          //this.health = 100;
        }
} */

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    // this.health = 100;
    this.attack = 10;
    this.defence = 10;
    this.health;
  }
}
