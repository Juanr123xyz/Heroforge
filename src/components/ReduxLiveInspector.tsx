import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { takeDamage, healHero } from '../store/slices/statsSlice';
import { clearLogs } from '../store/slices/actionLogSlice';
import {
  selectCombatPower,
  selectIsOverencumbered,
} from '../store/selectors';

export const ReduxLiveInspector: React.FC = () => {
  const dispatch = useAppDispatch();
  const combatPower = useAppSelector(selectCombatPower);
  const isOverloaded = useAppSelector(selectIsOverencumbered);
  const currentHp = useAppSelector((state) => state.stats.currentHp);
  const logs = useAppSelector((state) => state.actionLog.logs);

  const [bossHp, setBossHp] = useState<number>(500);
  const [battleReport, setBattleReport] = useState<string>(
    'El Boss espera tu primer movimiento. ¡Despacha una acción de ataque!'
  );

  // Ejecuta la simulación de combate
  const handleAttack = () => {
    if (currentHp <= 0) {
      setBattleReport('❌ El héroe ha caído derrotado. Usa "Curar Héroe" para revivir.');
      return;
    }

    // Calcula el daño al Boss proporcional al Poder de Combate (CP)
    const heroDmg = Math.max(12, Math.round(combatPower * 0.85));
    const nextBossHp = Math.max(0, bossHp - heroDmg);
    setBossHp(nextBossHp);

    // El Boss contraataca infligiendo 25 de daño al héroe (dispatch a statsSlice)
    const bossCounterDmg = 25;
    dispatch(takeDamage(bossCounterDmg));

    if (nextBossHp <= 0) {
      setBattleReport(
        `💥 ¡GOLPE CRÍTICO de ${heroDmg} DMG! ¡Has derrotado al Boss! (Recibiste ${bossCounterDmg} DMG de agonía)`
      );
    } else {
      setBattleReport(
        `⚔️ Asestaste ${heroDmg} DMG con tus stats. El Boss contraatacó infligiéndote ${bossCounterDmg} DMG.`
      );
    }
  };

  const handleHeal = () => {
    dispatch(healHero());
    setBattleReport('💚 ¡Poción de vida consumida! Salud restaurada al 100%.');
  };

  const handleRespawnBoss = () => {
    setBossHp(500);
    setBattleReport('👹 El Boss ha resurgido con 500 HP.');
  };

  return (
    <View style={styles.card}>
      {/* Cabecera */}
      <View style={styles.headerRow}>
        <View style={styles.zoneTagContainer}>
          <Text style={styles.zoneTag}>
            ZONA D • ARENA DE COMBATE & INSPECTOR REDUX
          </Text>
        </View>
      </View>

      {/* Simulador de Combate contra Boss */}
      <View style={styles.bossArenaBox}>
        <View style={styles.bossTopRow}>
          <View style={styles.bossIconContainer}>
            <Text style={styles.bossEmoji}>👹</Text>
          </View>
          <View style={styles.bossInfoCol}>
            <View style={styles.bossNameRow}>
              <Text style={styles.bossName}>Gólem de Magma (Boss)</Text>
              <Text style={styles.bossLevelTag}>LVL 50</Text>
            </View>
            <View style={styles.bossHpRow}>
              <Text style={styles.bossHpLabel}>Salud del Jefe:</Text>
              <Text style={styles.bossHpValue}>{bossHp} / 500 HP</Text>
            </View>
            <View style={styles.bossHpTrack}>
              <View
                style={[
                  styles.bossHpFill,
                  { width: `${Math.max(0, (bossHp / 500) * 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Mensaje de combate */}
        <View style={styles.battleReportBox}>
          <Text style={styles.battleReportText}>{battleReport}</Text>
        </View>

        {/* Botones de acción de combate */}
        <View style={styles.battleButtonsRow}>
          <TouchableOpacity
            style={[
              styles.btnAttack,
              (currentHp <= 0 || bossHp <= 0) && styles.btnDisabled,
            ]}
            onPress={handleAttack}
            disabled={currentHp <= 0 || bossHp <= 0}
            activeOpacity={0.8}
          >
            <Text style={styles.btnAttackText}>
              ⚔️ Atacar ({combatPower} CP)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnHeal}
            onPress={handleHeal}
            activeOpacity={0.8}
          >
            <Text style={styles.btnHealText}>💚 Curar</Text>
          </TouchableOpacity>

          {bossHp <= 0 && (
            <TouchableOpacity
              style={styles.btnRespawn}
              onPress={handleRespawnBoss}
              activeOpacity={0.8}
            >
              <Text style={styles.btnRespawnText}>🔄 Revivir</Text>
            </TouchableOpacity>
          )}
        </View>

        {isOverloaded && (
          <Text style={styles.overloadCombatWarning}>
            ⚠️ Penalización de combate activa: -30% CP debido al peso.
          </Text>
        )}
      </View>

      {/* Consola Visual de Redux en Vivo (Ticker de las últimas 5 acciones) */}
      <View style={styles.consoleBox}>
        <View style={styles.consoleHeader}>
          <View style={styles.consoleIndicatorRow}>
            <View style={styles.livePulseDot} />
            <Text style={styles.consoleTitle}>
              TICKER REDUX EN VIVO (ÚLTIMAS 5 ACCIONES)
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => dispatch(clearLogs())}
            activeOpacity={0.7}
          >
            <Text style={styles.btnClearLogs}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logsList}>
          {logs.length === 0 ? (
            <Text style={styles.emptyLogsText}>
              Consola lista. Despacha una acción para visualizar el flujo en tiempo real.
            </Text>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logRow}>
                <Text style={styles.logTime}>[{log.timestamp}]</Text>
                <Text style={styles.logActionType}>[{log.type}]</Text>
                <Text style={styles.logActionPayload}> ➔ {log.payload}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
    marginBottom: 12,
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
  bossArenaBox: {
    backgroundColor: '#030712',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  bossTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bossIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#7f1d1d33',
    borderWidth: 1.5,
    borderColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bossEmoji: {
    fontSize: 26,
  },
  bossInfoCol: {
    flex: 1,
  },
  bossNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  bossName: {
    color: '#f9fafb',
    fontSize: 13,
    fontWeight: '900',
  },
  bossLevelTag: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: '#ef444422',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  bossHpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bossHpLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '600',
  },
  bossHpValue: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '800',
  },
  bossHpTrack: {
    height: 8,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  bossHpFill: {
    height: '100%',
    backgroundColor: '#dc2626',
    borderRadius: 4,
  },
  battleReportBox: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  battleReportText: {
    color: '#d1d5db',
    fontSize: 11,
    fontStyle: 'italic',
  },
  battleButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnAttack: {
    flex: 2,
    backgroundColor: '#b91c1c',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  btnAttackText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  btnHeal: {
    flex: 1,
    backgroundColor: '#047857',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  btnHealText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  btnRespawn: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnRespawnText: {
    color: '#f3f4f6',
    fontSize: 11,
    fontWeight: '800',
  },
  btnDisabled: {
    opacity: 0.35,
  },
  overloadCombatWarning: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  consoleBox: {
    backgroundColor: '#030712',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#1f2937',
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    paddingBottom: 6,
  },
  consoleIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  consoleTitle: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  btnClearLogs: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
  },
  logsList: {
    gap: 5,
  },
  emptyLogsText: {
    color: '#4b5563',
    fontSize: 10,
    fontStyle: 'italic',
  },
  logRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  logTime: {
    color: '#6b7280',
    fontSize: 10,
    fontFamily: 'monospace',
    marginRight: 4,
  },
  logActionType: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  logActionPayload: {
    color: '#fbbf24',
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});
