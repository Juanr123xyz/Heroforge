import { RootState } from './index';

// Selector de ítems actualmente equipados
export const selectEquippedItems = (state: RootState) => {
  const { catalog, equippedIds } = state.inventory;
  return catalog.filter((item) => equippedIds.includes(item.id));
};

// Selector de estadísticas totales: base + bonos de ítems equipados
export const selectTotalStats = (state: RootState) => {
  const { str, agi, int } = state.stats;
  const equippedItems = selectEquippedItems(state);

  const totalStr = str + equippedItems.reduce((acc, i) => acc + i.bonusStr, 0);
  const totalAgi = agi + equippedItems.reduce((acc, i) => acc + i.bonusAgi, 0);
  const totalInt = int + equippedItems.reduce((acc, i) => acc + i.bonusInt, 0);

  return { totalStr, totalAgi, totalInt };
};

// Selector de peso total del equipamiento
export const selectTotalWeight = (state: RootState) => {
  const equippedItems = selectEquippedItems(state);
  return equippedItems.reduce((acc, i) => acc + i.weight, 0);
};

// Capacidad máxima de carga: 10 + (Fuerza Total * 2)
export const selectMaxWeightCapacity = (state: RootState) => {
  const { totalStr } = selectTotalStats(state);
  return 10 + totalStr * 2;
};

// Selector booleano: si está sobrecargado
export const selectIsOverencumbered = (state: RootState) => {
  const currentWeight = selectTotalWeight(state);
  const maxWeight = selectMaxWeightCapacity(state);
  return currentWeight > maxWeight;
};

// Selector de poder total de combate (con penalización del 30% si está sobrecargado)
export const selectCombatPower = (state: RootState) => {
  const { totalStr, totalAgi, totalInt } = selectTotalStats(state);
  const isOverloaded = selectIsOverencumbered(state);

  const rawPower = totalStr * 3 + totalAgi * 2 + totalInt * 3;
  return isOverloaded ? Math.round(rawPower * 0.7) : rawPower;
};

// Selector de apariencia visual, clase y aura según atributos
export const selectHeroVisualClass = (state: RootState) => {
  const { totalStr, totalAgi, totalInt } = selectTotalStats(state);
  const currentWeight = selectTotalWeight(state);

  let heroClass = 'Aldeano';
  let auraColor = '#94a3b8'; // Gris slate
  let avatarSprite = '🧑🌾';

  if (totalStr >= 18 && currentWeight >= 15) {
    heroClass = 'Tanque Pesado';
    auraColor = '#f59e0b'; // Ámbar/Dorado
    avatarSprite = '🛡️🧔';
  } else if (totalStr >= 15) {
    heroClass = 'Guerrero Berserker';
    auraColor = '#ef4444'; // Rojo fuego
    avatarSprite = '⚔️😡';
  } else if (totalInt >= 15) {
    heroClass = 'Archimago';
    auraColor = '#3b82f6'; // Azul arcano
    avatarSprite = '🧙‍♂️✨';
  } else if (totalAgi >= 15) {
    heroClass = 'Asesino Sombrío';
    auraColor = '#10b981'; // Verde esmeralda
    avatarSprite = '🥷💨';
  }

  return { heroClass, auraColor, avatarSprite };
};

// Selector consolidado de estado computado para vistas HUD completas
export const selectHeroComputedStatus = (state: RootState) => {
  const { str, agi, int, currentHp, availablePoints } = state.stats;
  const equippedItems = selectEquippedItems(state);

  const totalStr = str + equippedItems.reduce((acc, i) => acc + i.bonusStr, 0);
  const totalAgi = agi + equippedItems.reduce((acc, i) => acc + i.bonusAgi, 0);
  const totalInt = int + equippedItems.reduce((acc, i) => acc + i.bonusInt, 0);

  const currentWeight = equippedItems.reduce((acc, i) => acc + i.weight, 0);
  const maxWeightCapacity = 10 + totalStr * 2;
  const isOverloaded = currentWeight > maxWeightCapacity;

  // Clase visual y aura
  const { heroClass, auraColor, avatarSprite } = selectHeroVisualClass(state);

  // Poder de combate
  const rawPower = totalStr * 3 + totalAgi * 2 + totalInt * 3;
  const combatPower = isOverloaded ? Math.round(rawPower * 0.7) : rawPower;

  // Ícono de arma en mano
  const equippedWeapon = equippedItems.find(
    (item) => item.category === 'Arma'
  );
  const equippedWeaponIcon = equippedWeapon ? equippedWeapon.icon : '✊';

  // Expresión del avatar según estado de salud y carga
  let avatarExpression = '😎';
  let healthStatus = 'Saludable';
  if (currentHp <= 0) {
    avatarExpression = '💀';
    healthStatus = 'Derrotado';
  } else if (currentHp <= 30) {
    avatarExpression = '😫';
    healthStatus = 'Herido Crítico';
  } else if (isOverloaded) {
    avatarExpression = '🥵';
    healthStatus = 'Sobrecargado';
  }

  // Barra de maná calculada dinámicamente según INT
  const maxMana = totalInt * 10;
  const currentMana = maxMana;

  return {
    baseStr: str,
    baseAgi: agi,
    baseInt: int,
    totalStr,
    totalAgi,
    totalInt,
    currentHp,
    maxHp: 100,
    currentMana,
    maxMana,
    availablePoints,
    currentWeight,
    maxWeightCapacity,
    isOverloaded,
    heroClass,
    auraColor,
    avatarSprite,
    avatarExpression,
    healthStatus,
    equippedWeaponIcon,
    combatPower,
    rawPower,
    isDefeated: currentHp <= 0,
  };
};
