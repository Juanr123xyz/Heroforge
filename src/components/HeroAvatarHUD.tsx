import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../store';
import { selectHeroComputedStatus } from '../store/selectors';

export const HeroAvatarHUD: React.FC = () => {
  // Solo lee selectores derivados. No despacha acciones ni contiene botones propios.
  const hero = useAppSelector(selectHeroComputedStatus);

  // Cálculo de porcentajes para las barras visuales
  const hpPercent = Math.max(0, Math.min(100, (hero.currentHp / hero.maxHp) * 100));
  const manaPercent = Math.max(0, Math.min(100, (hero.currentMana / hero.maxMana) * 100));
  const weightPercent = Math.max(
    0,
    Math.min(100, (hero.currentWeight / hero.maxWeightCapacity) * 100)
  );

  // Color de barra de peso dinámico: Verde -> Amarillo -> Rojo si sobrecargado
  let weightBarColor = '#22c55e'; // Verde
  const weightRatio = hero.currentWeight / hero.maxWeightCapacity;
  if (hero.isOverloaded || weightRatio >= 1) {
    weightBarColor = '#ef4444'; // Rojo (Sobrecarga)
  } else if (weightRatio > 0.6) {
    weightBarColor = '#eab308'; // Amarillo
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.zoneTitle}>ZONA A: AVATAR & HUD SUPERIOR</Text>
        <View style={[styles.classBadge, { backgroundColor: hero.auraColor + '33', borderColor: hero.auraColor }]}>
          <Text style={[styles.classBadgeText, { color: hero.auraColor }]}>
            {hero.heroClass}
          </Text>
        </View>
      </View>

      <View style={styles.bodyRow}>
        {/* Avatar Dinámico con Aura y Expresión */}
        <View style={[styles.avatarAura, { borderColor: hero.auraColor, shadowColor: hero.auraColor }]}>
          <Text style={styles.avatarMain}>{hero.avatarSprite}</Text>
          <View style={styles.expressionBubble}>
            <Text style={styles.expressionText}>{hero.avatarExpression}</Text>
          </View>
          <View style={styles.weaponBadge}>
            <Text style={styles.weaponIcon}>{hero.equippedWeaponIcon}</Text>
          </View>
        </View>

        {/* Barras Visuales de Estado */}
        <View style={styles.barsContainer}>
          {/* Barra de Vida (HP) */}
          <View style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>Vida (HP)</Text>
              <Text style={styles.barValue}>
                {hero.currentHp} / {hero.maxHp}
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${hpPercent}%`,
                    backgroundColor: hero.currentHp <= 30 ? '#ef4444' : '#10b981',
                  },
                ]}
              />
            </View>
          </View>

          {/* Barra de Energía / Maná */}
          <View style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>Maná / Energía</Text>
              <Text style={styles.barValue}>
                {hero.currentMana} / {hero.maxMana} MP
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${manaPercent}%`, backgroundColor: '#3b82f6' },
                ]}
              />
            </View>
          </View>

          {/* Barra de Carga de Peso (Verde -> Amarillo -> Rojo) */}
          <View style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>Carga de Peso</Text>
              <Text
                style={[
                  styles.barValue,
                  hero.isOverloaded && { color: '#ef4444', fontWeight: 'bold' },
                ]}
              >
                {hero.currentWeight} / {hero.maxWeightCapacity} Kg
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${weightPercent}%`, backgroundColor: weightBarColor },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Indicador de estado vital y alerta de sobrecarga */}
      <View style={styles.statusFooter}>
        <Text style={styles.statusText}>
          Estado: <Text style={{ color: hero.isDefeated ? '#ef4444' : '#38bdf8' }}>{hero.healthStatus}</Text>
        </Text>
        <Text style={styles.powerHighlight}>
          Poder de Combate: <Text style={{ color: '#f59e0b', fontWeight: 'bold' }}>{hero.combatPower} CP</Text>
        </Text>
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
  classBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarAura: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#0f172a',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarMain: {
    fontSize: 36,
  },
  expressionBubble: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: '#475569',
  },
  expressionText: {
    fontSize: 14,
  },
  weaponBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#475569',
  },
  weaponIcon: {
    fontSize: 14,
  },
  barsContainer: {
    flex: 1,
    marginLeft: 14,
  },
  barItem: {
    marginBottom: 7,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  barLabel: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  barValue: {
    fontSize: 11,
    color: '#94a3b8',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statusText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  powerHighlight: {
    fontSize: 12,
    color: '#cbd5e1',
  },
});
