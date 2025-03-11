/**
 * Team - Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */

/* import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire'; */

/* const allCharacters = [Bowman, Swordsman, Magician, Daemon, Undead, Vampire];
const userTeam = [Bowman, Swordsman, Magician];
const userTeamLevel1 = [Bowman, Swordsman];
const enemyTeam = [Daemon, Undead, Vampire];

 class Team {
  // TODO: write your logic here
  constructor() {
    this.allCharacters = allCharacters;
    this.userTeam = userTeam;
    this.userTeamLevel1 = userTeamLevel1;
    this.enemyTeam = enemyTeam;
  }

}

const newTeam = new Team();
export default newTeam; */

export default class Team {
  constructor(characters = []) {
    this.characters = characters;
  }

  add(character) {
    this.characters.push(character);
  }
}
