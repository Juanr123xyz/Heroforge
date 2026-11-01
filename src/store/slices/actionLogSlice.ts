import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ActionLogEntry {
  id: string;
  timestamp: string;
  type: string;
  payload: string;
}

export interface ActionLogState {
  logs: ActionLogEntry[];
}

const initialState: ActionLogState = {
  logs: [
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      type: '@@INIT',
      payload: 'Redux Store Inicializado',
    },
  ],
};

const ITEM_NAME_MAP: Record<string, string> = {
  '1': 'Espada de Fuego',
  '2': 'Escudo de Titanio',
  '3': 'Báculo Arcano',
  '4': 'Botas Élficas',
  '5': 'Armadura Maldita',
  '6': 'Tomo de Hechizos',
};

// Type guard para que TypeScript reconozca PayloadAction en el matcher
const isTrackedAction = (
  action: unknown
): action is PayloadAction<unknown> => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof (action as { type: unknown }).type === 'string' &&
    ((action as { type: string }).type.startsWith('stats/') ||
      (action as { type: string }).type.startsWith('inventory/'))
  );
};

export const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {
    addLog: (
      state,
      action: PayloadAction<{ type: string; payload: string }>
    ) => {
      const now = new Date();
      state.logs.unshift({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        type: action.payload.type,
        payload: action.payload.payload,
      });
      if (state.logs.length > 5) {
        state.logs = state.logs.slice(0, 5);
      }
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    // Captura automática de acciones de stats e inventory
    builder.addMatcher(isTrackedAction, (state, action) => {
      let payloadDisplay = 'sin payload';

      if (action.payload !== undefined) {
        if (typeof action.payload === 'string') {
          payloadDisplay = ITEM_NAME_MAP[action.payload]
            ? `"${ITEM_NAME_MAP[action.payload]}"`
            : `"${action.payload}"`;
        } else if (typeof action.payload === 'number') {
          payloadDisplay = `${action.payload} pts`;
        } else {
          payloadDisplay = JSON.stringify(action.payload);
        }
      }

      const now = new Date();
      state.logs.unshift({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        type: action.type,
        payload: payloadDisplay,
      });

      if (state.logs.length > 5) {
        state.logs = state.logs.slice(0, 5);
      }
    });
  },
});

export const { addLog, clearLogs } = actionLogSlice.actions;

export default actionLogSlice.reducer;
