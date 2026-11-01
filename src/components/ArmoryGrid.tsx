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
    <View style={styles.card}>
      {/* Cabecera */}
      <View style={styles.headerRow}>
        <View style={styles.zoneTagContainer}>
          <Text style={styles.zoneTag}>ZONA C • ARMERÍA & MOCHILA</Text>
        </View>
        <TouchableOpacity
          style={styles.btnClear}
          onPress={() => dispatch(clearEquipment())}
          disabled={equippedIds.length === 0}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.btnClearText,
              equippedIds.length === 0 && { opacity: 0.35 },
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
            ⚠️ ¡SOBRECARGADO! (-50% Velocidad, -30% Poder de Combate)
          </Text>
        </View>
      )}

      {/* Resumen de Carga de Mochila */}
      <View style={styles.weightStatusRow}>
        <Text style={styles.weightLabel}>
          Peso en Mochila:{' '}
          <Text
            style={[
              styles.weightValue,
              { color: isOverloaded ? '#ef4444' : '#38bdf8' },
            ]}
          >
            {currentWeight} / {maxWeight} Kg
          </Text>
        </Text>
        <Text style={styles.itemsEquippedCount}>
          {equippedIds.length} ítem(s) equipados
        </Text>
      </View>

      {/* Cuadrícula de Ítems */}
      <View style={styles.grid}>
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
              {/* Header de la tarjeta con icono y badge de equipado */}
              <View style={styles.itemCardHeader}>
                <View style={styles.itemIconContainer}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                </View>
                {isEquipped ? (
                  <View style={styles.badgeEquipped}>
                    <Text style={styles.badgeEquippedText}>EN USO</Text>
                  </View>
                ) : (
                  <Text style={styles.categoryBadge}>{item.category}</Text>
                )}
              </View>

              {/* Nombre del ítem */}
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>

              {/* Bonos de atributos */}
              <View style={styles.bonusesRow}>
                {item.bonusStr !== 0 && (
                  <View style={styles.bonusChip}>
                    <Text style={styles.bonusChipText}>
                      {item.bonusStr > 0 ? `+${item.bonusStr}` : item.bonusStr} STR
                    </Text>
                  </View>
                )}
                {item.bonusAgi !== 0 && (
                  <View style={styles.bonusChip}>
                    <Text style={styles.bonusChipText}>
                      {item.bonusAgi > 0 ? `+${item.bonusAgi}` : item.bonusAgi} AGI
                    </Text>
                  </View>
                )}
                {item.bonusInt !== 0 && (
                  <View style={styles.bonusChip}>
                    <Text style={styles.bonusChipText}>
                      {item.bonusInt > 0 ? `+${item.bonusInt}` : item.bonusInt} INT
                    </Text>
                  </View>
                )}
              </View>

              {/* Pie de la tarjeta: Peso y estado de toque */}
              <View style={styles.itemCardFooter}>
                <Text style={styles.weightText}>⚖️ {item.weight} Kg</Text>
                <Text
                  style={[
                    styles.actionHint,
                    isEquipped ? styles.hintEquipped : styles.hintUnequipped,
                  ]}
                >
                  {isEquipped ? '✓ Equipado' : 'Tocar p/ usar'}
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
  btnClear: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  btnClearText: {
    color: '#e5e7eb',
    fontSize: 11,
    fontWeight: '700',
  },
  overloadAlert: {
    backgroundColor: '#7f1d1d33',
    borderColor: '#ef4444',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  overloadAlertText: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  weightStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weightLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  weightValue: {
    fontWeight: '900',
  },
  itemsEquippedCount: {
    color: '#9ca3af',
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemCard: {
    width: '48.5%',
    backgroundColor: '#030712',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#1f2937',
  },
  itemCardEquipped: {
    borderColor: '#38bdf8',
    backgroundColor: '#071829',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 18,
  },
  badgeEquipped: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeEquippedText: {
    color: '#030712',
    fontSize: 9,
    fontWeight: '900',
  },
  categoryBadge: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '600',
  },
  itemName: {
    color: '#f9fafb',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  bonusesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  bonusChip: {
    backgroundColor: '#064e3b44',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#059669',
  },
  bonusChipText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
  },
  itemCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: 6,
  },
  weightText: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '700',
  },
  actionHint: {
    fontSize: 10,
    fontWeight: '700',
  },
  hintEquipped: {
    color: '#38bdf8',
  },
  hintUnequipped: {
    color: '#6b7280',
  },
});
