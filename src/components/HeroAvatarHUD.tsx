import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../store';
import { selectHeroComputedStatus } from '../store/selectors';

export const HeroAvatarHUD: React.FC = () => {
  // Zona A se alimenta exclusivamente de selectores derivados (sin comunicación por props)
  const hero = useAppSelector(selectHeroComputedStatus);

  // Porcentajes de barras de estado
  const hpPercent = Math.max(0, Math.min(100, (hero.currentHp / hero.maxHp) * 100));
  const manaPercent = Math.max(0, Math.min(100, (hero.currentMana / hero.maxMana) * 100));
  const weightPercent = Math.max(
    0,
    Math.min(100, (hero.currentWeight / hero.maxWeightCapacity) * 100)
  );

  // Color reactivo de la barra de peso
  let weightBarColor = '#10b981'; // Verde (óptimo)
  const weightRatio = hero.currentWeight / hero.maxWeightCapacity;
  if (hero.isOverloaded || weightRatio >= 1) {
    weightBarColor = '#ef4444'; // Rojo (Sobrecarga)
  } else if (weightRatio > 0.6) {
    weightBarColor = '#f59e0b'; // Ámbar/Amarillo (precaución)
  }

  return (
    <View style={styles.hudCard}>
      {/* Cabecera de la Zona con Badge de Clase */}
      <View style={styles.headerRow}>
        <View style={styles.zoneTagContainer}>
          <Text style={styles.zoneTag}>ZONA A • HUD DEL HÉROE</Text>
        </View>
        <View
          style={[
            styles.classBadge,
            {
              borderColor: hero.auraColor,
              backgroundColor: hero.auraColor + '22',
              shadowColor: hero.auraColor,
            },
          ]}
        >
          <Text style={[styles.classBadgeText, { color: hero.auraColor }]}>
            {hero.heroClass.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Cuerpo principal: Avatar y Barras */}
      <View style={styles.mainContentRow}>
        {/* Contenedor del Avatar con Aura y Role Icon de 1 solo emoji */}
        <View style={styles.avatarWrapper}>
          <View
            style={[
              styles.avatarFrame,
              {
                borderColor: hero.auraColor,
                shadowColor: hero.auraColor,
              },
            ]}
          >
            {/* Ícono de rol del usuario: 1 solo emoji */}
            <Text style={styles.roleEmoji}>{hero.avatarSprite}</Text>

            {/* Expresión facial reactiva según salud y carga */}
            <View style={styles.expressionBubble}>
              <Text style={styles.expressionEmoji}>{hero.avatarExpression}</Text>
            </View>

            {/* Ícono de arma equipada en mano */}
            <View style={styles.weaponBubble}>
              <Text style={styles.weaponEmoji}>{hero.equippedWeaponIcon}</Text>
            </View>
          </View>
          <Text style={styles.avatarLabel}>{hero.healthStatus}</Text>
        </View>

        {/* Barras de Estado RPG */}
        <View style={styles.barsContainer}>
          {/* Barra de Vida (HP) */}
          <View style={styles.barItem}>
            <View style={styles.barHeader}>
              <Text style={styles.barTitle}>❤️ Salud (HP)</Text>
              <Text style={styles.barValueText}>
                {hero.currentHp} / {hero.maxHp}
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${hpPercent}%`,
                    backgroundColor: hero.currentHp <= 30 ? '#dc2626' : '#16a34a',
                  },
                ]}
              />
            </View>
          </View>

          {/* Barra de Maná / Energía (MP) */}
          <View style={styles.barItem}>
            <View style={styles.barHeader}>
              <Text style={styles.barTitle}>🔷 Maná / Energía</Text>
              <Text style={styles.barValueText}>
                {hero.currentMana} / {hero.maxMana} MP
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${manaPercent}%`, backgroundColor: '#2563eb' },
                ]}
              />
            </View>
          </View>

          {/* Barra de Carga de Peso (dinámica) */}
          <View style={styles.barItem}>
            <View style={styles.barHeader}>
              <Text style={styles.barTitle}>⚖️ Carga de Peso</Text>
              <Text
                style={[
                  styles.barValueText,
                  hero.isOverloaded && styles.overloadedText,
                ]}
              >
                {hero.currentWeight} / {hero.maxWeightCapacity} Kg
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${weightPercent}%`, backgroundColor: weightBarColor },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Footer del HUD con Poder de Combate */}
      <View style={styles.hudFooter}>
        <View style={styles.combatPowerBox}>
          <Text style={styles.combatPowerLabel}>PODER DE COMBATE (CP)</Text>
          <Text style={styles.combatPowerValue}>{hero.combatPower} PTS</Text>
        </View>

        {hero.isOverloaded ? (
          <View style={styles.overloadNotice}>
            <Text style={styles.overloadNoticeText}>⚠️ SOBRECARGADO (-30% CP)</Text>
          </View>
        ) : (
          <View style={styles.normalNotice}>
            <Text style={styles.normalNoticeText}>⚡ VELOCIDAD ÓPTIMA</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hudCard: {
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
  classBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mainContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
  },
  avatarFrame: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#030712',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 10,
  },
  roleEmoji: {
    fontSize: 42,
  },
  expressionBubble: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  expressionEmoji: {
    fontSize: 13,
  },
  weaponBubble: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  weaponEmoji: {
    fontSize: 13,
  },
  avatarLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  barsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  barItem: {
    marginBottom: 8,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  barTitle: {
    color: '#e5e7eb',
    fontSize: 11,
    fontWeight: '700',
  },
  barValueText: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
  },
  overloadedText: {
    color: '#ef4444',
    fontWeight: '800',
  },
  barTrack: {
    height: 9,
    backgroundColor: '#1f2937',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  hudFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  combatPowerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  combatPowerLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '700',
  },
  combatPowerValue: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  overloadNotice: {
    backgroundColor: '#7f1d1d44',
    borderColor: '#ef4444',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  overloadNoticeText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '800',
  },
  normalNotice: {
    backgroundColor: '#064e3b44',
    borderColor: '#10b981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  normalNoticeText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
  },
});
