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
      name: 'FUERZA (STR)',
      icon: '⚔️',
      base: str,
      total: totalStats.totalStr,
      accentColor: '#ef4444',
      bgGlow: '#ef444415',
    },
    {
      key: 'agi' as const,
      name: 'AGILIDAD (AGI)',
      icon: '🏹',
      base: agi,
      total: totalStats.totalAgi,
      accentColor: '#10b981',
      bgGlow: '#10b98115',
    },
    {
      key: 'int' as const,
      name: 'INTELIGENCIA (INT)',
      icon: '🔮',
      base: int,
      total: totalStats.totalInt,
      accentColor: '#3b82f6',
      bgGlow: '#3b82f615',
    },
  ];

  return (
    <View style={styles.card}>
      {/* Cabecera */}
      <View style={styles.headerRow}>
        <View style={styles.zoneTagContainer}>
          <Text style={styles.zoneTag}>ZONA B • PANEL DE ENTRENAMIENTO</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeText}>
            💎 {availablePoints} PTS DISPONIBLES
          </Text>
        </View>
      </View>

      {/* Lista de Atributos */}
      {statsConfig.map((item) => {
        const bonus = item.total - item.base;
        const barWidth = Math.min(100, (item.total / 30) * 100);

        return (
          <View
            key={item.key}
            style={[styles.statRow, { backgroundColor: item.bgGlow }]}
          >
            {/* Ícono e Información */}
            <View style={styles.statLeftCol}>
              <View
                style={[styles.iconBox, { borderColor: item.accentColor }]}
              >
                <Text style={styles.statIcon}>{item.icon}</Text>
              </View>

              <View style={styles.statTexts}>
                <Text style={styles.statName}>{item.name}</Text>
                <Text style={styles.statValues}>
                  Base: <Text style={styles.whiteVal}>{item.base}</Text>
                  {bonus !== 0 && (
                    <Text style={styles.bonusVal}>
                      {' '}
                      ({bonus > 0 ? `+${bonus}` : bonus} equip.)
                    </Text>
                  )}{' '}
                  = <Text style={[styles.totalVal, { color: item.accentColor }]}>{item.total}</Text>
                </Text>
              </View>
            </View>

            {/* Barra Visual de Nivel */}
            <View style={styles.gaugeContainer}>
              <View
                style={[
                  styles.gaugeFill,
                  { width: `${barWidth}%`, backgroundColor: item.accentColor },
                ]}
              />
            </View>

            {/* Botones de Control [-] y [+] */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[
                  styles.btnControl,
                  item.base <= 1 && styles.btnDisabled,
                ]}
                onPress={() => dispatch(decrementStat(item.key))}
                disabled={item.base <= 1}
                activeOpacity={0.7}
              >
                <Text style={styles.btnControlText}>−</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnControl,
                  availablePoints <= 0 && styles.btnDisabled,
                  { backgroundColor: item.accentColor + '33', borderColor: item.accentColor },
                ]}
                onPress={() => dispatch(incrementStat(item.key))}
                disabled={availablePoints <= 0}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.btnControlText,
                    availablePoints > 0 && { color: item.accentColor },
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Sección de Presets y Reset */}
      <View style={styles.presetsSection}>
        <Text style={styles.sectionTitle}>⚡ PRESETS RÁPIDOS DE ROL (1-DISPATCH)</Text>
        <View style={styles.presetButtonsRow}>
          <TouchableOpacity
            style={[styles.btnPreset, { borderColor: '#ef4444' }]}
            onPress={() => dispatch(applyBuildPreset('WARRIOR'))}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPresetIcon}>⚔️</Text>
            <Text style={styles.btnPresetText}>Build Guerrero</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnPreset, { borderColor: '#3b82f6' }]}
            onPress={() => dispatch(applyBuildPreset('MAGE'))}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPresetIcon}>🧙</Text>
            <Text style={styles.btnPresetText}>Build Mago</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnPreset, { borderColor: '#f59e0b' }]}
            onPress={() => dispatch(applyBuildPreset('TANK'))}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPresetIcon}>🛡️</Text>
            <Text style={styles.btnPresetText}>Build Tanque</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de Poción de Reseteo */}
        <TouchableOpacity
          style={styles.btnReset}
          onPress={() => dispatch(resetStats())}
          activeOpacity={0.8}
        >
          <Text style={styles.btnResetText}>🧪 Tomar Poción de Reseteo (Reset Total)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  zoneTagContainer: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  zoneTag: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pointsBadge: {
    backgroundColor: '#7c3aed22',
    borderColor: '#a855f7',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
  },
  pointsBadgeText: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  statLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.3,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#030712',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statIcon: {
    fontSize: 18,
  },
  statTexts: {
    flex: 1,
  },
  statName: {
    color: '#f9fafb',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statValues: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 2,
  },
  whiteVal: {
    color: '#e5e7eb',
    fontWeight: '700',
  },
  bonusVal: {
    color: '#34d399',
    fontWeight: '700',
  },
  totalVal: {
    fontWeight: '900',
    fontSize: 11,
  },
  gaugeContainer: {
    width: 60,
    height: 7,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  btnControl: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnControlText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '900',
  },
  presetsSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  sectionTitle: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 8,
  },
  btnPreset: {
    flex: 1,
    backgroundColor: '#030712',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnPresetIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  btnPresetText: {
    color: '#f3f4f6',
    fontSize: 10,
    fontWeight: '800',
  },
  btnReset: {
    backgroundColor: '#6d28d9',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  btnResetText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
