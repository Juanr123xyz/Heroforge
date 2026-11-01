import { RootState } from './index';

// ============================================================================
// 1. SELECTORES BÁSICOS Y DE INVENTARIO
// ============================================================================

// Retorna la lista de objetos actualmente equipados en el inventario
export const selectEquippedItems = (state: RootState) => {
  const { catalog, equippedIds } = state.inventory;
  return catalog.filter((item) => equippedIds.includes(item.id));
};

// ============================================================================
// 2. SELECTORES DE ESTADÍSTICAS TOTALES (Estado Derivado)
// ============================================================================

// Suma los atributos base de statsSlice + los bonos de los ítems de inventorySlice
export const selectTotalStats = (state: RootState) => {
  const { str, agi, int } = state.stats;
  const equippedItems = selectEquippedItems(state);

  const totalStr = str + equippedItems.reduce((acc, i) => acc + i.bonusStr, 0);
  const totalAgi = agi + equippedItems.reduce((acc, i) => acc + i.bonusAgi, 0);
  const totalInt = int + equippedItems.reduce((acc, i) => acc + i.bonusInt, 0);

  return { totalStr, totalAgi, totalInt };
};

// ============================================================================
// 3. SELECTORES DE CAPACIDAD DE PESO Y SOBRECARGA
// ============================================================================

// Suma el peso total de los ítems equipados
export const selectTotalWeight = (state: RootState) => {
  const equippedItems = selectEquippedItems(state);
  return equippedItems.reduce((acc, i) => acc + i.weight, 0);
};

// Capacidad máxima de carga: 10 + (Fuerza Total * 2)
export const selectMaxWeightCapacity = (state: RootState) => {
  const { totalStr } = selectTotalStats(state);
  return 10 + totalStr * 2;
};

// Determina si el héroe sufre sobrecarga de peso
export const selectIsOverencumbered = (state: RootState) => {
  const currentWeight = selectTotalWeight(state);
  const maxWeight = selectMaxWeightCapacity(state);
  return currentWeight > maxWeight;
};

// ============================================================================
// 4. SELECTOR DE PODER DE COMBATE
// ============================================================================

// Fórmula: (totalStr * 3) + (totalAgi * 2) + (totalInt * 3)
// Si está sobrecargado, recibe una penalización del 30% (-30% CP)
export const selectCombatPower = (state: RootState) => {
  const { totalStr, totalAgi, totalInt } = selectTotalStats(state);
  const isOverloaded = selectIsOverencumbered(state);

  const rawPower = totalStr * 3 + totalAgi * 2 + totalInt * 3;
  return isOverloaded ? Math.round(rawPower * 0.7) : rawPower;
};

// ============================================================================
// 5. SELECTOR DE CLASE VISUAL Y ROL (ÍCONOS DE 1 SOLO EMOJI)
// ============================================================================

export const selectHeroVisualClass = (state: RootState) => {
  const { totalStr, totalAgi, totalInt } = selectTotalStats(state);

  let heroClass = 'Aldeano';
  let auraColor = '#94a3b8'; // Gris metálico de inicio
  let avatarSprite = '👤';    // 1 solo emoji para el rol inicial

  if (totalStr >= 18) {
    heroClass = 'Tanque Pesado';
    auraColor = '#f59e0b';   // Dorado / Bronce blindado
    avatarSprite = '🛡️';     // 1 solo emoji para el rol Tanque
  } else if (totalStr >= 15) {
    heroClass = 'Guerrero Berserker';
    auraColor = '#ef4444';   // Furia escarlata
    avatarSprite = '⚔️';     // 1 solo emoji para el rol Guerrero
  } else if (totalInt >= 15) {
    heroClass = 'Archimago';
    auraColor = '#3b82f6';   // Azul arcano místico
    avatarSprite = '🧙';     // 1 solo emoji para el rol Mago
  } else if (totalAgi >= 15) {
    heroClass = 'Asesino Sombrío';
    auraColor = '#10b981';   // Verde esmeralda furtivo
    avatarSprite = '🥷';     // 1 solo emoji para el rol Asesino / Pícaro
  }

  return { heroClass, auraColor, avatarSprite };
};

// ============================================================================
// 6. SELECTOR CONSOLIDADO PARA EL HUD
// ============================================================================

export const selectHeroComputedStatus = (state: RootState) => {
  const { str, agi, int, currentHp, availablePoints } = state.stats;
  const equippedItems = selectEquippedItems(state);

  const totalStr = str + equippedItems.reduce((acc, i) => acc + i.bonusStr, 0);
  const totalAgi = agi + equippedItems.reduce((acc, i) => acc + i.bonusAgi, 0);
  const totalInt = int + equippedItems.reduce((acc, i) => acc + i.bonusInt, 0);

  const currentWeight = equippedItems.reduce((acc, i) => acc + i.weight, 0);
  const maxWeightCapacity = 10 + totalStr * 2;
  const isOverloaded = currentWeight > maxWeightCapacity;

  // Clase visual, aura y sprite de rol (1 solo emoji)
  const { heroClass, auraColor, avatarSprite } = selectHeroVisualClass(state);

  // Poder de combate derivado
  const rawPower = totalStr * 3 + totalAgi * 2 + totalInt * 3;
  const combatPower = isOverloaded ? Math.round(rawPower * 0.7) : rawPower;

  // Arma en mano
  const equippedWeapon = equippedItems.find(
    (item) => item.category === 'Arma'
  );
  const equippedWeaponIcon = equippedWeapon ? equippedWeapon.icon : '✊';

  // Expresión facial reactiva según salud y sobrecarga
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
