// GameController - класс, отвечающий за логику приложения

import GameState from './GameState';
import { generateTeam } from './generators';
import cursors from './cursors';
import themes from './themes';
import GamePlay from './GamePlay';

import PositionedCharacter from './PositionedCharacter';
/* import LevelUpCharacter from "./LevelUpCharacter";
import CharacterActions from "./CharacterActions"; */

import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.boardSize = 8;
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positionedCharacters = [];// позиции всех юнитов
    this.state = new GameState();
    this.currentTurn = 'player';
    this.level = 1;
    this.score = 0;
    this.record = 0; // максимальное количество очков (рекорд)
    this.currentLevel = themes.prairie;// тема фона
    this.selected;
    this.possibleMove = []; // куда может пойти
    this.possibleAttack = []; // куда может атаковать
    this.gamePlay.addNewGameListener(this.startNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.gamePlay.drawUi(this.currentLevel); // вызываем метод drawUi с нужной темой для отрисовки на экране
    this.startNewGame();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  startNewGame() {
    // console.log('start new game!!!');
    this.state = new GameState();
    this.state.currentTurn = 'player';
    this.currentLevel = themes.prairie;
    this.gamePlay.drawUi(this.currentLevel);
    this.positionedCharacters = [];
    this.state.positionedCharacters = [];
    this.state.level = 1;
    this.state.score = 0;
    this.gamePlay.redrawStatistics(
      this.level = 1,
      this.score = 0,
      this.record,
    );
    this.startGame();
  }

  startGame() {
    this.state.level = 1;
    this.state.score = 0;
    this.gamePlay.redrawStatistics(
      this.level = 1,
      this.score = 0,
      this.record,
    );

    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Vampire, Undead, Daemon];

    const enemyTeam = generateTeam(enemyTypes, 4, 2); // формируем команду компьютера

    const playerTeam = generateTeam(playerTypes, 3, 4); // формируем команду игрока

    const positionedCharacters = [];
    const playerPositions = this.generatePositions([0, 1]);// запрашиваем массив возможных позиций юнитов игрока
    // console.log('playerPositions =', playerPositions);

    const enemyPositions = this.generatePositions([6, 7]);// запрашиваем массив возможных позиций юнитов компьютера

    // расставляем юниты игрока
    playerTeam.characters.forEach((character) => {
      const position = playerPositions.shift();
      positionedCharacters.push(new PositionedCharacter(character, position));
    });

    // расставляем юниты компьютера
    enemyTeam.characters.forEach((character) => {
      const position = enemyPositions.pop();
      positionedCharacters.push(new PositionedCharacter(character, position));
    });

    this.positionedCharacters = positionedCharacters;

    this.gamePlay.redrawPositions(positionedCharacters);// расставляем всех юнитов
  }

  generatePositions(columns) { // создаем и заполняем массив возможных исходных позиций юнитов
    const positions = [];
    for (let i = 0; i < 8; i++) {
      columns.forEach((column) => {
        positions.push(column + i * 8);
      });
    }

    this.shuffle(positions);

    return positions;

    // shuffle(positions);
  }

  shuffle(positions) { // вариация алгоритма Фишера-Йетса для перемешивания массива (позиций юнтов)
    let j; let temp;
    for (let i = positions.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = positions[j];
      positions[j] = positions[i];
      positions[i] = temp;
    }
  }

  async onCellClick(index) {
    // TODO: react to click
    const currentUnit = this.positionedCharacters.find((el) => el.position === index);

    if (!this.currentTurn === 'player') {
      return;
    }

    /* const botsTeam = this.positionedCharacters.filter((e) => (
      e.character instanceof Vampire
      || e.character instanceof Daemon
      || e.character instanceof Undead
    )); */

    // console.log(currentUnit.character.type);
    const playerUnits = ['bowman', 'swordsman', 'magician'];
    const comuterUnits = ['daemon', 'undead', 'vampire'];

    // Определение типа выбранного перса
    let pers;

    this.positionedCharacters.forEach((item) => {
      if (item.position === index) {
        if (playerUnits.includes(item.character.type)) {
          pers = item.character.type;
        }
      }
    });

    // куда перс может пойти или атаковать
    this.moveAttack(pers, index); // заполняет массивы this.possibleMove и this.possibleAttack

    if (!currentUnit) {

    } else if (playerUnits.includes(currentUnit.character.type)) {
      if (this.state.selectedCharacter) { // проверяем, есть ли ранее выделенный юнит
        this.gamePlay.deselectCell(this.state.selectedCharacter.position);// снимаем выделение с ранее выделенного юнита
      }
      // механизм выделения нового юнита
      this.state.selectedCharacter = currentUnit;
      this.gamePlay.selectCell(index);
    } else if (this.state.selectedCharacter == null && comuterUnits.includes(currentUnit.character.type)) {
      GamePlay.showError('Выберите своего юнита! (Choose your unit!)');
    }

    // передвижение выделенного юнита
    if (this.state.selectedCharacter !== null && !currentUnit && this.possibleMove.includes(index)) {
      // console.log(this.state.selectedCharacter.position); //номер ячейки выбранного для хода юнита
      this.gamePlay.deselectCell(this.state.selectedCharacter.position);// снимаем с юнита, которым будем ходить желтое выделение

      // определяем выделенного юнита
      const terran = this.positionedCharacters.find((item) => item.position === this.state.selectedCharacter.position);
      terran.position = index; // устанавливаем выделенному юниту его новую позицию, выбранную кликом
      this.gamePlay.redrawPositions(this.positionedCharacters);// перерисовываем персонажей на поле
      this.onCellLeave(index);// убираем "зеленое" выделение с ячейки, в которую сходили
      this.state.selectedCharacter = null;// "обнуляем" выделенного юнита, для корректного вида курсора
      this.possibleMove = []; // обнуляем массив ячеек, в которые можно сходить
      this.computerRunning();
    }

    // атака выделенного юнита по цели в пределах досягаемости
    // --- typeof нужен, чтобы при клике magician в клетку вне зоны передвижения на вываливалась ошибка
    if (this.state.selectedCharacter !== null && this.possibleAttack.includes(index)
        && typeof currentUnit !== 'undefined' && !playerUnits.includes(currentUnit.character.type)) {
      const targetUnit = this.positionedCharacters.find((el) => el.position === index);// цель атаки Object!!!!!
      const targetPosition = targetUnit.position;// позиция цели атаки
      // console.log('Attack!');
      this.gamePlay.deselectCell(this.state.selectedCharacter.position);
      this.possibleMove = [];// обнуляем массив возможных перемещений
      // this.possibleAttack = []
      this.gamePlay.setCursor(cursors.pointer); // переводим курсор в pointer
      this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-red'));// снимаем красное выделение с атакованного юнита противника
      const unitPlayer = this.state.selectedCharacter; // атакующий юнит игрока
      this.state.selectedCharacter = null;// обнуляем атакующего юнита игрока

      // console.log('targetUnit = ', targetUnit.character);

      await this.unitAttack(unitPlayer.character, targetUnit.character, targetPosition); // вызов функции атаки юнита игрока

      setTimeout(() => { // Костыль, иначе обращение к this.gamePlay.showDamage вываливает ошибку
        this.computerRunning();
      }, 500);
    }

    if (this.state.selectedCharacter !== null && !currentUnit && !this.possibleMove.includes(index)) {
      GamePlay.showError('Слишком далеко!');
      return;
    }

    // атака выделенного юнита по цели вне пределов досягаемости
    if (this.state.selectedCharacter !== null && !this.possibleAttack.includes(index) && !playerUnits.includes(currentUnit.character.type)) {
      GamePlay.showError('Вне дальности удара! (Out of range of impact)');
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter

    // вывод информации о юните
    const unitInCell = event.target.querySelector('.character');

    // записываеn персонажа в переменную, если он есть в ячейке, на которую навели
    const currentUnit = this.positionedCharacters.find((el) => el.position === index);

    const playerUnits = ['bowman', 'swordsman', 'magician'];
    const comuterUnits = ['daemon', 'undead', 'vampire'];

    if (unitInCell) {
      // получение информации о юните (вариант 1)
      const {
        level, attack, defence, health, type,
      } = currentUnit.character;
      const message = `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health} ${type}`;

      // получение информации о юните (вариант 2)
      // const message = currentUnit.character.unitInformation //запрос на характеристки юнита через геттер в Character.js
      // вызов метода showCellTooltip для вывода информации о юните
      this.gamePlay.showCellTooltip(message, index);
    }

    // выделение юнита
    if (this.state.selectedCharacter) {
      // const { character, position } = this.state.selectedCharacter;
      if (currentUnit) {
        if (playerUnits.includes(currentUnit.character.type)) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (comuterUnits.includes(currentUnit.character.type) && this.possibleAttack.includes(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else if (comuterUnits.includes(currentUnit.character.type) && !this.possibleAttack.includes(index)) {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }

    // подсвечиваем зеленым курсором, куда может ходить выбранный юнит
    if (this.state.selectedCharacter !== null && !currentUnit && this.possibleMove.includes(index)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave

    this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-red'));
    this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.pointer);
  }

  // куда выбранный перс может ходить и атаковать
  moveAttack(pers, index) {
    if (pers === 'swordsman' || pers === 'undead') {
      this.possibleMove = this.farCounter(index, 4);
      this.possibleAttack = this.farCounter(index, 1);
    }

    if (pers === 'bowman' || pers === 'vampire') {
      this.possibleMove = this.farCounter(index, 2);
      this.possibleAttack = this.farCounter(index, 2);
    }

    if (pers === 'magician' || pers === 'daemon') {
      this.possibleMove = this.farCounter(index, 1);
      this.possibleAttack = this.farCounter(index, 4);
    }
  }

  // рассчет возможных полей для хода или атаки
  farCounter(pos, n) {
    const set1 = new Set();

    for (let i = 0; i < n + 1; i += 1) {
      for (let j = 0; j < n + 1; j += 1) {
        if (pos - (8 * i) >= 0 && (pos % 8) - j >= 0) { set1.add(pos - (8 * i) - j); }
        if (pos - (8 * i) >= 0 && (pos % 8) + j < 8) { set1.add(pos - (8 * i) + j); }
        if ((pos % 8) - j >= 0 && pos + (8 * i) < 64) { set1.add(pos + (8 * i) - j); }
        if (pos + (8 * i) < 64 && (pos % 8) + j < 8) { set1.add(pos + (8 * i) + j); }
      }
    }

    return [...set1].sort((a, b) => a - b);
  }

  // ход компьютера
  async computerRunning() {
    // console.log('Ход компьютера!');
    const botsTeam = [];

    this.positionedCharacters.forEach((item) => {
      if (item.character.type === 'daemon' || item.character.type === 'undead' || item.character.type === 'vampire') {
        botsTeam.push(item);
      }
    });

    if (botsTeam.length === 0) {
      // console.log('endOfLevel!');
      return;
    }

    const playerTeam = [];
    this.positionedCharacters.forEach((item) => {
      if (item.character.type === 'bowman' || item.character.type === 'magician' || item.character.type === 'swordsman') {
        playerTeam.push(item);
      }
    });

    let compUnit;
    const compPositions = [];// позиции юнитов компьютера

    botsTeam.forEach((elem) => {
      compPositions.push(elem.position);
    });

    // выбираем случайного юнита компьютера
    const randomBot = this.arrayRandElement(botsTeam);
    const { position } = randomBot;

    botsTeam.forEach((elem) => {
      if (elem.position === position) {
        compUnit = elem.character;
      }
    });

    this.moveAttack(compUnit.type, position);

    // console.log('this.possibleMove =', this.possibleMove);//!!! включены в том числе клетки, в которых находятся другие юниты !!!
    // console.log('this.positionedCharacters =',  this.positionedCharacters);

    const attacker = compUnit;// юнит компа, который будет атаковать
    let target; // юнит игрока, которого будут атаковать
    let positionTarget; // позиция юнита игрока, которого будет атаковать юнит компьютера

    playerTeam.forEach((el) => {
      if (this.possibleAttack.includes(el.position)) {
        target = el.character;
        positionTarget = el.position;
      }
    });

    if (positionTarget) { // атака на юнита игрока, находящегося в поле поражения юнита компьютера
      this.unitAttack(attacker, target, positionTarget);
    } else { // движение юнита компьютера
      // console.log('Ups!!!');
      const occupiedPositions = [];
      this.positionedCharacters.forEach((item) => {
        occupiedPositions.push(item.position);
      });
      let stepUnit;
      while (!stepUnit) {
        const step = this.arrayRandElement(this.possibleMove);
        if (occupiedPositions.includes(step)) {
          stepUnit = false;
        } else {
          stepUnit = step;
        }
        randomBot.position = stepUnit;
      }
      this.gamePlay.redrawPositions(this.positionedCharacters);
    }
  }

  unitAttack(unitPlayer, targetUnit, targetPosition) {
    // console.log('Атака юнита!');
    const attacker = unitPlayer;
    const target = targetUnit;

    const positionTarget = targetPosition;
    if (target) {
      const damage = Math.round(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
      // console.log('damage = ', damage);
      this.gamePlay.showDamage(positionTarget, damage).then(() => {
        /*
          метод showDamage из GamePlay возвращает Promise !!! поэтому нужен then
          вариант 2 более простой  - async unitAttack(unitPlayer, targetUnit, targetPosition){
          ...
          await this.gamePlay.showDamage(positionTarget, damage);
          ...
          }
        */
        target.health -= damage;
        this.gamePlay.redrawPositions(this.positionedCharacters);// отрисовка полоски жизни юнита

        if (target.health <= 0) {
          const indexTarget = this.positionedCharacters.findIndex((item) => item.position === positionTarget);
          this.positionedCharacters.splice(indexTarget, 1);
          this.gamePlay.redrawPositions(this.positionedCharacters);
          // alert('Враг уничтожен!')
        }

        const botsTeam = [];
        this.positionedCharacters.forEach((item) => {
          if (item.character.type === 'daemon' || item.character.type === 'undead' || item.character.type === 'vampire') {
            botsTeam.push(item);
          }
        });

        const playerTeam = [];
        this.positionedCharacters.forEach((item) => {
          if (item.character.type === 'bowman' || item.character.type === 'magician' || item.character.type === 'swordsman') {
            playerTeam.push(item);
          }
        });

        if (botsTeam.length === 0) {
          this.level += 1;
          this.score = playerTeam.length * 10 + this.score;
          this.record = Math.max(this.record, this.score);
          this.levelUp();
        }
      });
    }
  }

  levelUp() {
    // console.log('New level!');
    // console.log('level = ', this.level);
    if (this.level > 4) {
      GamePlay.showMessage('Game over!');
      this.gamePlay.drawUi(themes.prairie);
      this.currentLevel = themes.prairie;
      return this.startGame();
    }

    const playerTeam = [];
    this.positionedCharacters.forEach((item) => {
      if (item.character.type === 'bowman' || item.character.type === 'magician' || item.character.type === 'swordsman') {
        playerTeam.push(item);
      }
    });

    playerTeam.forEach((elem) => {
      elem.character.level += 1;
      elem.character.health += 80;
      if (elem.character.health > 100) {
        elem.character.health = 100;
      }
      elem.character.attack = Math.max(elem.character.attack, elem.character.attack * (80 + elem.character.health) / 100);
      elem.character.defence = Math.max(elem.character.defence, elem.character.defence * (80 + elem.character.health) / 100);
    });

    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Vampire, Undead, Daemon];

    const enemyTeam = generateTeam(enemyTypes, 4, 2); // формируем новую команду компьютера
    // console.log('enemyTeam = ', enemyTeam);

    /*
      сделать!!!!
      const character = new Daemon(3); // Создаёт персонажа 1-уровня и 2 раза повышает его уровень и характеристики
    */

    const playerNewTeam = generateTeam(playerTypes, 3, (4 - playerTeam.length)); // формируем команду игрока (в случае потери юнитов на предыдущем уровне)

    playerTeam.forEach((el) => {
      playerNewTeam.characters.push(el.character);
    });

    const positionedCharacters = [];

    const playerPositions = this.generatePositions([0, 1]);// запрашиваем массив возможных позиций юнитов игрока
    const enemyPositions = this.generatePositions([6, 7]);// запрашиваем массив возможных позиций юнитов компьютера

    switch (this.level) {
      case (2):
        this.gamePlay.drawUi(themes.desert);
        this.currentLevel = themes.desert;
        break;

      case (3):
        this.gamePlay.drawUi(themes.arctic);
        this.currentLevel = themes.arctic;
        break;

      case (4):
        this.gamePlay.drawUi(themes.mountain);
        this.currentLevel = themes.mountain;
        break;
      default:
        this.gamePlay.drawUi(themes.prairie);
        this.currentLevel = themes.prairie;
        break;
    }

    /* playerNewTeam.characters.forEach((character) => {
      console.log('character =', character);
    }); */

    // расставляем юниты игрока
    playerNewTeam.characters.forEach((character) => {
      const position = playerPositions.pop();
      positionedCharacters.push(new PositionedCharacter(character, position));
    });

    // расставляем юниты компьютера
    enemyTeam.characters.forEach((character) => {
      const position = enemyPositions.pop();
      positionedCharacters.push(new PositionedCharacter(character, position));
    });

    this.positionedCharacters = positionedCharacters;
    this.gamePlay.redrawPositions(positionedCharacters);

    this.gamePlay.redrawStatistics(
      this.level,
      this.score,
      this.record,
    );
  }

  saveGame() {
    // console.log('Game saved!');
    localStorage.clear(); // очистка содержимого локального хранилища
    this.state.positionedCharacters = this.positionedCharacters.map(
      ({ character, position }) => ({
        character: {
          type: character.type,
          level: character.level,
          attack: character.attack,
          defence: character.defence,
          health: character.health,
        },
        position,
      }),
    );
    this.state.currentLevel = this.currentLevel;
    this.state.currentTurn = this.currentTurn;
    this.state.level = this.level;
    this.state.score = this.score;
    this.state.record = this.record;
    this.stateService.save(this.state);// запись в локальное хранилище
    GamePlay.showMessage('Game Saved!');
  }

  loadGame() {
    // console.log('Game loaded!');
    try {
      const load = this.stateService.load();
      this.state = load;

      this.currentLevel = load.currentLevel;
      // this.currentTurn = "player";
      this.level = load.level;
      this.score = load.score;
      this.record = load.record;
      this.positionedCharacters = this.state.positionedCharacters.map(
        (data) => {
          let character;
          switch (data.character.type) {
            case 'bowman':
              character = new Bowman(data.character.level); // создаем через классы
              character.attack = data.character.attack; // иначе сохраненные характеристики не восстановятся у созданых юнитов
              character.defence = data.character.defence;
              character.health = data.character.health;
              break;

            case 'swordsman':
              character = new Swordsman(data.character.level);
              character.attack = data.character.attack;
              character.defence = data.character.defence;
              character.health = data.character.health;
              break;

            case 'magician':
              character = new Magician(data.character.level);
              character.attack = data.character.attack;
              character.defence = data.character.defence;
              character.health = data.character.health;
              break;

            case 'vampire':
              character = new Vampire(data.character.level);
              character.attack = data.character.attack;
              character.defence = data.character.defence;
              character.health = data.character.health;
              break;
            case 'undead':
              character = new Undead(data.character.level);
              character.attack = data.character.attack;
              character.defence = data.character.defence;
              character.health = data.character.health;
              break;

            case 'daemon':
              character = new Daemon(data.character.level);
              character.attack = data.character.attack;
              character.defence = data.character.defence;
              character.health = data.character.health;
              break;
            default:
              throw new Error('Unknown character type');
          }
          return { character, position: data.position };
        },
      );

      this.gamePlay.drawUi(this.currentLevel);
      this.gamePlay.redrawPositions(this.state.positionedCharacters);
      this.gamePlay.redrawStatistics(
        this.level,
        this.score,
        this.record,
      );
      GamePlay.showMessage('Game loaded!');
    } catch (error) {
      this.gamePlay.showError('Loading failed!');
    }
  }

  arrayRandElement(arr) {
    const rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
  }
}
