import Team from './Team';

// generators - модуль, содержащий вспомогательные функции для генерации команды и персонажей

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */

// Чтобы превратить функцию в ГЕНЕРАТОР, после ключевого слова function нужно ДОБАВИТЬ знак * !!!!!!

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  while (true) {
    const characterTypeIndex = Math.floor(Math.random() * allowedTypes.length);
    const characterLevel = Math.floor((Math.random() * maxLevel) + 1);

    yield new allowedTypes[characterTypeIndex](characterLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде
 * - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = new Team();
  const character = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i += 1) {
    team.add(character.next().value);
  }
  return team;
}
