import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  incrementStat,
  decrementStat,
  applyBuildPreset,
  resetStats,
} from '../store/slices/statsSlice';
import { selectTotalStats } from '../store/selectors';

export const StatsControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { availablePoints, str, agi, int } = useAppSelector(
    (state) => state.stats
  );
  const totalStats = useAppSelector(selectTotalStats);

  const statsConfig = [
    {
      key: 'str' as const,
      name: 'Fuerza (STR)',
      icon: '⚔️',
      base: str,
      total: totalStats.totalStr,
      color: '#ef4444',
    },
    {
      key: 'agi' as const,
      name: 'Agilidad (AGI)',
      icon: '🏹',
      base: agi,
      total: totalStats.totalAgi,
      color: '#10b981',
    },
    {
      key: 'int' as const,
      name: 'Inteligencia (INT)',
      icon: '🔮',
      base: int,
      total: totalStats.totalInt,
      color: '#3b82f6',
    },
  ];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.zoneTitle}>ZONA B: PANEL DE ENTRENAMIENTO</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeText}>
            Puntos: {availablePoints} pts
          </Text>
        </View>
      </View>

      {/* Filas de Atributos: STR, AGI, INT */}
      {statsConfig.map((item) => {
        const bonus = item.total - item.base;
        const progressWidth = Math.min(100, (item.total / 30) * 100);

        return (
          <View key={item.key} style={styles.statRow}>
            <View style={styles.statInfo}>
              <Text style={styles.statIcon}>{item.icon}</Text>
              <View style={styles.statNameCol}>
                <Text style={styles.statLabel}>{item.name}</Text>
                <Text style={styles.statValues}>
                  Base: {item.base}{' '}
                  {bonus !== 0 && (
                    <Text
                      style={{
                        color: bonus > 0 ? '#4ade80' : '#f87171',
                        fontWeight: '600',
                      }}
                    >
                      ({bonus > 0 ? `+${bonus}` : bonus} equip.)
                    </Text>
                  )}{' '}
                  = <Text style={{ color: '#f1f5f9', fontWeight: 'bold' }}>{item.total}</Text>
                </Text>
              </View>
            </View>

            {/* Barra de progreso del stat */}
            <View style={styles.statBarContainer}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${progressWidth}%`, backgroundColor: item.color },
                ]}
              />
            </View>

            {/* Controles [-] y [+] */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  item.base <= 1 && styles.buttonDisabled,
                ]}
                onPress={() => dispatch(decrementStat(item.key))}
                disabled={item.base <= 1}
              >
                <Text style={styles.controlButtonText}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  availablePoints <= 0 && styles.buttonDisabled,
                ]}
                onPress={() => dispatch(incrementStat(item.key))}
                disabled={availablePoints <= 0}
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Presets Rápidos y Poción de Reseteo */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionSubtitle}>Presets Rápidos:</Text>
        <View style={styles.presetButtonsRow}>
          <TouchableOpacity
            style={[styles.presetButton, { borderColor: '#ef4444' }]}
            onPress={() => dispatch(applyBuildPreset('WARRIOR'))}
          >
            <Text style={styles.presetButtonText}>Build Guerrero</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.presetButton, { borderColor: '#3b82f6' }]}
            onPress={() => dispatch(applyBuildPreset('MAGE'))}
          >
            <Text style={styles.presetButtonText}>Build Mago</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.presetButton, { borderColor: '#f59e0b' }]}
            onPress={() => dispatch(applyBuildPreset('TANK'))}
          >
            <Text style={styles.presetButtonText}>Build Tanque</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => dispatch(resetStats())}
        >
          <Text style={styles.resetButtonText}>🧪 Poción de Reseteo (Reset)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  pointsBadge: {
    backgroundColor: '#8b5cf620',
    borderColor: '#8b5cf6',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pointsBadgeText: {
    color: '#c084fc',
    fontSize: 12,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a80',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
  },
  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statNameCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#f8fafc',
    fontWeight: '600',
  },
  statValues: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
  statBarContainer: {
    width: 60,
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  statBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  controlButtonText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '600',
  },
  presetButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 6,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    alignItems: 'center',
  },
  presetButtonText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
