/**
 *Character -  Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
/* export default class Character {
  constructor(level) {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if(new.target.name === 'Character'){
      throw new Error('An object of the "Character" class cannot be created')
    }
  } */

export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Нельзя создавать объекты через new Character()');
    }
  }
}

// геттер на получение информации о юните
/* get unitInformation(){
    return `\u{1F396}${this.level} \u{2694}${this.attack} \u{1F6E1}${this.defence} \u{2764}${this.health}  ${this.type} `;
  } */
