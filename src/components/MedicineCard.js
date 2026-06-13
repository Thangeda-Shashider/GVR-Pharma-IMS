// GVR Pharma IMS — MedicineCard Component
// A list item card for the Medicine List screen.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { formatExpiry, isExpiringSoon } from '../utils/dateUtils';
import { getStockColor, getStockLabel } from '../utils/stockUtils';

/**
 * @param {object}   props
 * @param {object}   props.medicine   — Firestore medicine document
 * @param {function} props.onPress    — Callback when card is tapped
 */
const MedicineCard = ({ medicine, onPress }) => {
  const {
    name,
    category,
    stock,
    expiryDate,
  } = medicine;

  const stockColor   = getStockColor(stock);
  const stockLabel   = getStockLabel(stock);
  const expiringSoon = isExpiringSoon(expiryDate);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Left accent bar based on stock color */}
      <View style={[styles.accentBar, { backgroundColor: stockColor }]} />

      <View style={styles.content}>
        {/* Top row: name + expiry warning icon */}
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {expiringSoon && (
            <Ionicons
              name="warning"
              size={16}
              color={COLORS.expiring}
              style={styles.warningIcon}
            />
          )}
        </View>

        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        {/* Bottom row: stock + expiry */}
        <View style={styles.bottomRow}>
          <View style={[styles.stockBadge, { backgroundColor: stockColor + '20' }]}>
            <View style={[styles.stockDot, { backgroundColor: stockColor }]} />
            <Text style={[styles.stockText, { color: stockColor }]}>
              {stock} units — {stockLabel}
            </Text>
          </View>
          <Text style={styles.expiry}>{formatExpiry(expiryDate)}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} style={styles.arrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    backgroundColor: COLORS.surface,
    borderRadius:    14,
    marginHorizontal: 16,
    marginVertical:   6,
    elevation:       3,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.1,
    shadowRadius:    4,
    overflow:        'hidden',
    alignItems:      'center',
  },
  accentBar: {
    width:  5,
    alignSelf: 'stretch',
  },
  content: {
    flex:    1,
    padding: 14,
  },
  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   6,
  },
  name: {
    fontSize:   16,
    fontWeight: '700',
    color:      COLORS.textPrimary,
    flex:       1,
    marginRight: 4,
  },
  warningIcon: {
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: COLORS.accent + '20',
    borderRadius:    20,
    paddingHorizontal: 10,
    paddingVertical:   3,
    alignSelf:       'flex-start',
    marginBottom:    8,
  },
  categoryText: {
    color:      COLORS.primary,
    fontSize:   11,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  stockBadge: {
    flexDirection:   'row',
    alignItems:      'center',
    borderRadius:    12,
    paddingHorizontal: 8,
    paddingVertical:   3,
  },
  stockDot: {
    width:        7,
    height:       7,
    borderRadius: 3.5,
    marginRight:  5,
  },
  stockText: {
    fontSize:   12,
    fontWeight: '600',
  },
  expiry: {
    fontSize:  12,
    color:     COLORS.textMuted,
    fontWeight: '500',
  },
  arrow: {
    marginRight: 12,
  },
});

export default MedicineCard;
