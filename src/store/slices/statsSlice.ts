import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
}

const initialState: StatsState = {
  availablePoints: 15,
  str: 5,
  agi: 5,
  int: 5,
  currentHp: 100,
};

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat: (state, action: PayloadAction<'str' | 'agi' | 'int'>) => {
      if (state.availablePoints > 0) {
        state.availablePoints -= 1;
        state[action.payload] += 1;
      }
    },
    decrementStat: (state, action: PayloadAction<'str' | 'agi' | 'int'>) => {
      if (state[action.payload] > 1) {
        state[action.payload] -= 1;
        state.availablePoints += 1;
      }
    },
    takeDamage: (state, action: PayloadAction<number>) => {
      state.currentHp = Math.max(0, state.currentHp - action.payload);
    },
    healHero: (state) => {
      state.currentHp = 100;
    },
    applyBuildPreset: (
      state,
      action: PayloadAction<'WARRIOR' | 'MAGE' | 'ROGUE' | 'TANK'>
    ) => {
      // Reasigna los 15 puntos disponibles según la especialidad
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
    resetStats: (state) => {
      state.availablePoints = initialState.availablePoints;
      state.str = initialState.str;
      state.agi = initialState.agi;
      state.int = initialState.int;
      state.currentHp = initialState.currentHp;
    },
  },
});

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
} = statsSlice.actions;

export default statsSlice.reducer;
