import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleEquipItem, clearEquipment } from '../store/slices/inventorySlice';
import {
  selectTotalWeight,
  selectMaxWeightCapacity,
  selectIsOverencumbered,
} from '../store/selectors';

export const ArmoryGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const { catalog, equippedIds } = useAppSelector((state) => state.inventory);
  const currentWeight = useAppSelector(selectTotalWeight);
  const maxWeight = useAppSelector(selectMaxWeightCapacity);
  const isOverloaded = useAppSelector(selectIsOverencumbered);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.zoneTitle}>ZONA C: ARMERÍA & MOCHILA</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => dispatch(clearEquipment())}
          disabled={equippedIds.length === 0}
        >
          <Text
            style={[
              styles.clearButtonText,
              equippedIds.length === 0 && { opacity: 0.4 },
            ]}
          >
            Desequipar Todo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alerta Visual de Sobrecarga */}
      {isOverloaded && (
        <View style={styles.overloadAlert}>
          <Text style={styles.overloadAlertText}>
            ⚠️ ¡SOBRECARGADO! (-50% Velocidad, -30% Poder)
          </Text>
        </View>
      )}

      {/* Resumen de Carga */}
      <View style={styles.weightSummaryRow}>
        <Text style={styles.weightSummaryText}>
          Peso Equipado:{' '}
          <Text
            style={{
              color: isOverloaded ? '#ef4444' : '#38bdf8',
              fontWeight: 'bold',
            }}
          >
            {currentWeight} / {maxWeight} Kg
          </Text>
        </Text>
        <Text style={styles.equippedCountText}>
          {equippedIds.length} ítem(s) en uso
        </Text>
      </View>

      {/* Cuadrícula de Tarjetas de Ítems */}
      <View style={styles.gridContainer}>
        {catalog.map((item) => {
          const isEquipped = equippedIds.includes(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[
                styles.itemCard,
                isEquipped && styles.itemCardEquipped,
              ]}
              onPress={() => dispatch(toggleEquipItem(item.id))}
            >
              <View style={styles.cardTop}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
                {isEquipped && (
                  <View style={styles.equippedBadge}>
                    <Text style={styles.equippedBadgeText}>✓</Text>
                  </View>
                )}
              </View>

              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemCategory}>{item.category}</Text>

              {/* Bonos de estadísticas */}
              <View style={styles.bonusesContainer}>
                {item.bonusStr !== 0 && (
                  <Text style={styles.bonusText}>
                    {item.bonusStr > 0 ? `+${item.bonusStr}` : item.bonusStr} STR
                  </Text>
                )}
                {item.bonusAgi !== 0 && (
                  <Text style={styles.bonusText}>
                    {item.bonusAgi > 0 ? `+${item.bonusAgi}` : item.bonusAgi} AGI
                  </Text>
                )}
                {item.bonusInt !== 0 && (
                  <Text style={styles.bonusText}>
                    {item.bonusInt > 0 ? `+${item.bonusInt}` : item.bonusInt} INT
                  </Text>
                )}
              </View>

              {/* Peso en Kg */}
              <View style={styles.itemFooter}>
                <Text style={styles.weightBadgeText}>⚖️ {item.weight} Kg</Text>
                <Text
                  style={[
                    styles.equipStateText,
                    { color: isEquipped ? '#38bdf8' : '#64748b' },
                  ]}
                >
                  {isEquipped ? 'Equipado' : 'Tocar p/ equipar'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 10,
  },
  zoneTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  clearButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  overloadAlert: {
    backgroundColor: '#ef444422',
    borderColor: '#ef4444',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  overloadAlertText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  weightSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weightSummaryText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  equippedCountText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemCard: {
    width: '48.5%',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  itemCardEquipped: {
    borderColor: '#38bdf8',
    backgroundColor: '#0c2340',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemIcon: {
    fontSize: 22,
  },
  equippedBadge: {
    backgroundColor: '#38bdf8',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equippedBadgeText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 6,
  },
  bonusesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  bonusText: {
    fontSize: 10,
    color: '#4ade80',
    fontWeight: '600',
    backgroundColor: '#16653433',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 6,
  },
  weightBadgeText: {
    fontSize: 10,
    color: '#cbd5e1',
  },
  equipStateText: {
    fontSize: 9,
    fontWeight: '600',
  },
});
