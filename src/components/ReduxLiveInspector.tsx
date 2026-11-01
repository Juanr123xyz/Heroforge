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
  const [lastCombatMessage, setLastCombatMessage] = useState<string>(
    'Listo para iniciar el combate contra el Boss.'
  );

  const handleAttackBoss = () => {
    if (currentHp <= 0) {
      setLastCombatMessage('¡El héroe ha caído! Usa "Curar Héroe" para revivir.');
      return;
    }

    // Calcula daño al Boss según el combatPower
    const heroDamage = Math.max(10, Math.round(combatPower * 0.8));
    const nextBossHp = Math.max(0, bossHp - heroDamage);
    setBossHp(nextBossHp);

    // El Boss contraataca causando 25 de daño
    const counterDamage = 25;
    dispatch(takeDamage(counterDamage));

    if (nextBossHp <= 0) {
      setLastCombatMessage(
        `💥 ¡Impacto crítico de ${heroDamage} DMG! ¡Has derrotado al Boss! (Recibiste ${counterDamage} DMG)`
      );
    } else {
      setLastCombatMessage(
        `⚔️ Golpeaste por ${heroDamage} DMG. El Boss contraatacó infligiendo ${counterDamage} DMG al héroe.`
      );
    }
  };

  const handleHeal = () => {
    dispatch(healHero());
    setLastCombatMessage('💚 ¡Héroe curado completamente a 100 HP!');
  };

  const handleResetBoss = () => {
    setBossHp(500);
    setLastCombatMessage('👹 El Boss ha reaparecido con 500 HP.');
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.zoneTitle}>
          ZONA D: ARENA DE COMBATE & INSPECTOR REDUX
        </Text>
      </View>

      {/* Simulador de Combate contra Boss */}
      <View style={styles.combatBox}>
        <View style={styles.bossInfoRow}>
          <Text style={styles.bossIcon}>👹</Text>
          <View style={styles.bossDetails}>
            <Text style={styles.bossTitle}>Gólem de Magma (Boss)</Text>
            <Text style={styles.bossHpText}>HP del Jefe: {bossHp} / 500</Text>
            <View style={styles.bossHpBarBackground}>
              <View
                style={[
                  styles.bossHpBarFill,
                  { width: `${Math.max(0, (bossHp / 500) * 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <Text style={styles.combatLogText}>{lastCombatMessage}</Text>

        <View style={styles.combatButtonsRow}>
          <TouchableOpacity
            style={[
              styles.attackButton,
              (currentHp <= 0 || bossHp <= 0) && styles.buttonDisabled,
            ]}
            onPress={handleAttackBoss}
            disabled={currentHp <= 0 || bossHp <= 0}
          >
            <Text style={styles.attackButtonText}>
              ⚔️ Atacar al Boss ({combatPower} CP)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.healButton} onPress={handleHeal}>
            <Text style={styles.healButtonText}>💚 Curar</Text>
          </TouchableOpacity>

          {bossHp <= 0 && (
            <TouchableOpacity
              style={styles.resetBossButton}
              onPress={handleResetBoss}
            >
              <Text style={styles.resetBossButtonText}>🔄 Revivir Boss</Text>
            </TouchableOpacity>
          )}
        </View>

        {isOverloaded && (
          <Text style={styles.combatPenaltyAlert}>
            ⚠️ Penalización activa: -30% Poder de Combate por Sobrecarga de Peso.
          </Text>
        )}
      </View>

      {/* Consola Visual de Redux en Vivo (Ticker de las últimas 5 acciones) */}
      <View style={styles.consoleContainer}>
        <View style={styles.consoleHeader}>
          <Text style={styles.consoleTitle}>
            🔴 CONSOLA REDUX EN VIVO (ÚLTIMAS ACCIONES)
          </Text>
          <TouchableOpacity onPress={() => dispatch(clearLogs())}>
            <Text style={styles.clearLogsText}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tickerContainer}>
          {logs.length === 0 ? (
            <Text style={styles.emptyLogText}>
              No hay acciones recientes. Interactúa con la app para ver el flujo.
            </Text>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logItemRow}>
                <Text style={styles.logTimestamp}>[{log.timestamp}]</Text>
                <Text style={styles.logType}>[{log.type}]</Text>
                <Text style={styles.logPayload}> → {log.payload}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  zoneTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  combatBox: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bossInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bossIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  bossDetails: {
    flex: 1,
  },
  bossTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  bossHpText: {
    color: '#94a3b8',
    fontSize: 11,
    marginVertical: 2,
  },
  bossHpBarBackground: {
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bossHpBarFill: {
    height: '100%',
    backgroundColor: '#dc2626',
    borderRadius: 3,
  },
  combatLogText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  combatButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  attackButton: {
    flex: 2,
    backgroundColor: '#b91c1c',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  attackButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  healButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  healButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  resetBossButton: {
    flex: 1,
    backgroundColor: '#475569',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  resetBossButtonText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  combatPenaltyAlert: {
    color: '#f87171',
    fontSize: 10,
    marginTop: 6,
    fontWeight: '600',
  },
  consoleContainer: {
    backgroundColor: '#090d16',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 4,
  },
  consoleTitle: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  clearLogsText: {
    color: '#64748b',
    fontSize: 10,
  },
  tickerContainer: {
    gap: 4,
  },
  emptyLogText: {
    color: '#475569',
    fontSize: 11,
    fontStyle: 'italic',
  },
  logItemRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  logTimestamp: {
    color: '#64748b',
    fontSize: 10,
    fontFamily: 'monospace',
    marginRight: 4,
  },
  logType: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  logPayload: {
    color: '#fbbf24',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
