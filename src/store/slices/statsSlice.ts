import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// 1. TIPOS Y ESTRUCTURAS DE DATOS (statsSlice)
// ============================================================================

export type StatKey = 'str' | 'agi' | 'int';
export type BuildPresetType = 'WARRIOR' | 'MAGE' | 'ROGUE' | 'TANK';

export interface StatsState {
  availablePoints: number; // Inicia en 15 pts disponibles
  str: number;            // Fuerza base inicial: 5
  agi: number;            // Agilidad base inicial: 5
  int: number;            // Inteligencia base inicial: 5
  currentHp: number;      // Vida actual inicial: 100
}

// ============================================================================
// 2. ESTADO INICIAL DEL SLICE
// ============================================================================

const initialState: StatsState = {
  availablePoints: 15,
  str: 5,
  agi: 5,
  int: 5,
  currentHp: 100,
};

// ============================================================================
// 3. DEFINICIÓN DEL SLICE Y REDUCERS (Lógica Inmutable con Immer)
// ============================================================================

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    // Incrementa un atributo consumiendo 1 punto de habilidad
    incrementStat: (state, action: PayloadAction<StatKey>) => {
      if (state.availablePoints > 0) {
        state.availablePoints -= 1;
        state[action.payload] += 1;
      }
    },

    // Decrementa un atributo devolviendo 1 punto (mínimo base de 1)
    decrementStat: (state, action: PayloadAction<StatKey>) => {
      if (state[action.payload] > 1) {
        state[action.payload] -= 1;
        state.availablePoints += 1;
      }
    },

    // Aplica daño recibido en combate al HP actual
    takeDamage: (state, action: PayloadAction<number>) => {
      state.currentHp = Math.max(0, state.currentHp - action.payload);
    },

    // Restaura el HP del héroe a su valor máximo de 100
    healHero: (state) => {
      state.currentHp = 100;
    },

    // Reasigna los 15 puntos disponibles en una sola acción atómica
    applyBuildPreset: (state, action: PayloadAction<BuildPresetType>) => {
      switch (action.payload) {
        case 'WARRIOR':
          state.str = 16;
          state.agi = 8;
          state.int = 6;
          state.availablePoints = 0;
          break;
        case 'MAGE':
          state.str = 5;
          state.agi = 7;
          state.int = 18;
          state.availablePoints = 0;
          break;
        case 'ROGUE':
          state.str = 6;
          state.agi = 18;
          state.int = 6;
          state.availablePoints = 0;
          break;
        case 'TANK':
          state.str = 18;
          state.agi = 6;
          state.int = 6;
          state.availablePoints = 0;
          break;
      }
    },

    // Restaura todos los atributos a sus valores iniciales
    resetStats: (state) => {
      state.availablePoints = initialState.availablePoints;
      state.str = initialState.str;
      state.agi = initialState.agi;
      state.int = initialState.int;
      state.currentHp = initialState.currentHp;
    },
  },
});

// ============================================================================
// 4. ACCIONES Y REDUCER EXPORTADOS
// ============================================================================

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
} = statsSlice.actions;

export default statsSlice.reducer;
