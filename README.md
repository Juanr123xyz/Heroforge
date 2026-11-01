# ⚔️ HeroForge RPG — Arquitectura de Estado Visual con Redux Toolkit

Proyecto desarrollado para el **Taller Práctico: HeroForge RPG** de la asignatura **Desarrollo Móvil**.

---

## 📋 Descripción del Proyecto

**HeroForge RPG** es una aplicación móvil construida en **React Native (Expo)** con **TypeScript**, **@reduxjs/toolkit** y **react-redux**. Demuestra cómo una arquitectura de estado centralizado resuelve los problemas de **Prop Drilling** y **Estado Desincronizado/Redundante**, logrando que cada acción despachada (`dispatch`) desencadene un *efecto dominó* en 4 zonas visuales independientes sin comunicarse por `props` entre sí.

---

## 🏛️ Estructura del Proyecto

```text
heroforge-rpg/
├── App.tsx                           # Punto de entrada con Provider y las 4 Zonas hermanas
├── app.json                          # Configuración de Expo
├── package.json                      # Dependencias (@reduxjs/toolkit, react-redux, expo)
├── tsconfig.json                     # Configuración estricta de TypeScript
├── src/
│   ├── store/
│   │   ├── index.ts                  # configureStore, RootState, AppDispatch y hooks tipados
│   │   ├── selectors.ts              # Selectores de estado derivado (sin duplicar en el state)
│   │   └── slices/
│   │       ├── statsSlice.ts         # Atributos base (STR, AGI, INT, HP, Puntos, Presets)
│   │       ├── inventorySlice.ts     # Catálogo de ítems y equipamiento activo
│   │       └── actionLogSlice.ts     # Ticker / Historial visual con builder.addMatcher
│   └── components/
│       ├── HeroAvatarHUD.tsx         # Zona A: Avatar Dinámico, HUD, Barras y Badge de Clase
│       ├── StatsControlPanel.tsx     # Zona B: Panel de Entrenamiento, Controles [-]/[+] y Presets
│       ├── ArmoryGrid.tsx            # Zona C: Cuadrícula de Armas/Ítems y Alerta de Sobrecarga
│       └── ReduxLiveInspector.tsx    # Zona D: Arena de Combate contra Boss y Consola Redux
```

---

## 🎮 Las 4 Zonas Visuales Independientes

1. **Zona A: Avatar & HUD Superior (`<HeroAvatarHUD />`)**:
   - Reacciona exclusivamente a selectores derivados de `statsSlice` e `inventorySlice`.
   - **Avatar Dinámico**: Cambia de aspecto (sprite), color de aura (`auraColor`), ícono de arma en mano y expresión emocional (😎 Saludable, 🥵 Sobrecargado, 😫 Herido, 💀 Derrotado).
   - **Barras Visuales**: Vida (HP), Maná (MP) y Barra de Carga de Peso (dinámica: Verde `< 60%`, Amarillo `60%-100%`, Rojo `> 100%` con Sobrecarga).
   - **Badge de Clase Automática**: Se recalcula dinámicamente entre *Aldeano*, *Guerrero Berserker*, *Archimago*, *Asesino Sombrío* o *Tanque Pesado*.
   - **Sin botones propios**: Componente 100% reactivo de solo lectura visual.

2. **Zona B: Panel de Entrenamiento (`<StatsControlPanel />`)**:
   - Contador de 15 Puntos de Habilidad Disponibles iniciales.
   - Controles `[-]` y `[+]` para Fuerza (STR), Agilidad (AGI) e Inteligencia (INT) con barras de nivel.
   - Botón de **Poción de Reseteo (Reset)** que restaura valores base.
   - Presets rápidos de un solo dispatch: **Build Guerrero**, **Build Mago**, **Build Tanque**.

3. **Zona C: Armería & Mochila (`<ArmoryGrid />`)**:
   - Cuadrícula con 6 ítems míticos: *Espada de Fuego*, *Escudo de Titanio*, *Báculo Arcano*, *Botas Élficas*, *Armadura Maldita* y *Tomo de Hechizos*.
   - Muestra bonos de estadísticas y peso en Kg de cada uno.
   - Borde brillante y activo al equipar/desequipar con un toque.
   - Alerta visual inmediata: `⚠️ ¡SOBRECARGADO! (-50% Velocidad, -30% Poder)`.
   - Botón de **Desequipar Todo**.

4. **Zona D: Arena de Simulación & Inspector Redux en Vivo (`<ReduxLiveInspector />`)**:
   - Simulador de combate contra el Boss *Gólem de Magma*.
   - Botón de ataque calculado con el selector de **Poder de Combate (CP)** (con penalización del 30% si está sobrecargado). El Boss contraataca restando HP (`takeDamage`).
   - Botón de **Curar Héroe** (`healHero`).
   - **Consola Visual de Redux en Vivo**: Ticker en tiempo real que muestra las últimas 5 acciones despachadas (`[type] -> payload`) capturadas automáticamente con `builder.addMatcher`.

---

## ⚡ Regla de Oro: Estado Derivado (Selectores)

En cumplimiento estricto de la arquitectura Redux, **ningún cálculo redundante se almacena en el estado**:
- `selectTotalStats`: Suma atributos base + bonos de ítems equipados.
- `selectTotalWeight`: Suma el peso de los ítems en uso.
- `selectMaxWeightCapacity`: `10 + (totalStr * 2)`.
- `selectIsOverencumbered`: `currentWeight > maxWeightCapacity`.
- `selectCombatPower`: `rawPower = (totalStr * 3) + (totalAgi * 2) + (totalInt * 3)` (penalizado al 70% si hay sobrecarga).
- `selectHeroVisualClass`: Determina clase, color de aura y expresión según atributos dominantes.
- `selectHeroComputedStatus`: Consolida el estado completo para alimentar el HUD sin inconsistencias.

---

## 🚀 Instrucciones de Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar la aplicación con Expo**:
   ```bash
   npx expo start
   ```

3. **Opciones de visualización**:
   - Presiona `w` para abrir en el navegador web.
   - Escanea el código QR con **Expo Go** en Android o iOS.
   - Presiona `a` para emulador Android o `i` para simulador iOS.

---

## 🎙️ Guion para el Video Demostrativo (5 - 7 Minutos)

- **Minuto 0:00 - 1:30 | El Problema Arquitectónico (Conceptual)**:
  - Explicar por qué `useState` + prop drilling a 4 niveles generaría duplicación de estado y desincronización gráfica.
  - Explicar el ciclo unidireccional: UI $\rightarrow$ Dispatch(Action) $\rightarrow$ Store/Reducer (Immer) $\rightarrow$ State Update $\rightarrow$ Selector $\rightarrow$ Re-render visual.
- **Minuto 1:30 - 3:30 | Demostración Visual (Efecto Dominó)**:
  - Activar "Build Mago" o "Build Tanque": observar cómo cambian simultáneamente el color del aura, el badge de clase, las barras de vida/maná y el ticker de acciones.
  - Equipar la *Armadura Maldita* y el *Escudo de Titanio*: mostrar la alerta roja de `¡SOBRECARGADO!`, la reducción de Poder de Combate y el cambio de expresión del avatar.
  - Atacar al Boss: mostrar el daño recibido, el cambio de expresión a herido/derrotado y cómo se registra la acción `stats/takeDamage` en la consola en vivo.
- **Minuto 3:30 - 5:30 | Recorrido por el Código (Slices, Immer y Selectores)**:
  - Mostrar `src/store/index.ts` con `configureStore`.
  - Explicar un reducer (`toggleEquipItem` o `applyBuildPreset`) y la mutación inmutable mediante Immer.
  - Mostrar `src/store/selectors.ts` y argumentar por qué `combatPower` o `isOverloaded` son selectores derivados y no variables dentro del slice.
- **Minuto 5:30 - 6:30 | Conclusión y Casos de Uso Reales**:
  - Comparar cuándo usar `useState` (inputs de formulario aislados, toggles visuales locales) vs. `Redux Toolkit` (estado compartido entre pantallas/módulos, reglas de negocio globales, historial de eventos).
