import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// 1. TIPOS Y ESTRUCTURAS DE DATOS (actionLogSlice)
// ============================================================================

export interface ActionLogEntry {
  id: string;
  timestamp: string;
  type: string;
  payload: string;
}

export interface ActionLogState {
  logs: ActionLogEntry[];
}

// ============================================================================
// 2. ESTADO INICIAL DEL REGISTRO DE ACCIONES
// ============================================================================

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
      payload: 'Store Redux Inicializado',
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

// Type guard para validar y tipar acciones interceptadas automáticamente
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

// ============================================================================
// 3. DEFINICIÓN DEL SLICE Y EXTRA-REDUCERS (builder.addMatcher)
// ============================================================================

export const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {
    // Permite registrar manualmente una acción si es requerido
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

    // Limpia el historial de acciones en pantalla
    clearLogs: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    // Captura automática en vivo de cualquier acción de stats o inventory
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

// ============================================================================
// 4. ACCIONES Y REDUCER EXPORTADOS
// ============================================================================

export const { addLog, clearLogs } = actionLogSlice.actions;

export default actionLogSlice.reducer;
