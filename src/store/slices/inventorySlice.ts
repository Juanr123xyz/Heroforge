import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  category: 'Arma' | 'Defensa' | 'Armadura' | 'Accesorio';
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  weight: number; // en Kg
}

export interface InventoryState {
  catalog: InventoryItem[];
  equippedIds: string[];
}

const initialState: InventoryState = {
  catalog: [
    {
      id: '1',
      name: 'Espada de Fuego',
      icon: '🔥🗡️',
      category: 'Arma',
      bonusStr: 8,
      bonusAgi: 2,
      bonusInt: 0,
      weight: 6,
    },
    {
      id: '2',
      name: 'Escudo de Titanio',
      icon: '🛡️',
      category: 'Defensa',
      bonusStr: 6,
      bonusAgi: -1,
      bonusInt: 0,
      weight: 12,
    },
    {
      id: '3',
      name: 'Báculo Arcano',
      icon: '🔮✨',
      category: 'Arma',
      bonusStr: 0,
      bonusAgi: 1,
      bonusInt: 10,
      weight: 4,
    },
    {
      id: '4',
      name: 'Botas Élficas',
      icon: '👢🍃',
      category: 'Accesorio',
      bonusStr: 0,
      bonusAgi: 8,
      bonusInt: 2,
      weight: 2,
    },
    {
      id: '5',
      name: 'Armadura Maldita',
      icon: '🦾💀',
      category: 'Armadura',
      bonusStr: 12,
      bonusAgi: -3,
      bonusInt: 0,
      weight: 20,
    },
    {
      id: '6',
      name: 'Tomo de Hechizos',
      icon: '📖⚡',
      category: 'Accesorio',
      bonusStr: 0,
      bonusAgi: 0,
      bonusInt: 7,
      weight: 3,
    },
  ],
  equippedIds: [],
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    toggleEquipItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.equippedIds.indexOf(itemId);
      if (index >= 0) {
        state.equippedIds.splice(index, 1);
      } else {
        state.equippedIds.push(itemId);
      }
    },
    clearEquipment: (state) => {
      state.equippedIds = [];
    },
    unequipAll: (state) => {
      state.equippedIds = [];
    },
  },
});

export const { toggleEquipItem, clearEquipment, unequipAll } =
  inventorySlice.actions;

export default inventorySlice.reducer;
