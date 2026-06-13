// GVR Pharma IMS — AlertItem Component
// Renders a single alert list item for the Alerts screen.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { daysUntilExpiry } from '../utils/dateUtils';

const ALERT_CONFIG = {
  outOfStock: {
    icon:            'close-circle',
    color:           COLORS.danger,
    getSubtitle:     (m) => `Batch: ${m.batchNumber} — No units remaining`,
    backgroundColor: COLORS.danger + '12',
  },
  lowStock: {
    icon:            'warning',
    color:           COLORS.warning,
    getSubtitle:     (m) => `Only ${m.stock} unit${m.stock !== 1 ? 's' : ''} remaining`,
    backgroundColor: COLORS.warning + '12',
  },
  expiring: {
    icon:            'time',
    color:           COLORS.expiring,
    getSubtitle:     (m) => {
      const d = daysUntilExpiry(m.expiryDate);
      if (d < 0)  return `Expired ${Math.abs(d)} day${Math.abs(d) !== 1 ? 's' : ''} ago`;
      if (d === 0) return 'Expiring today!';
      return `Expires in ${d} day${d !== 1 ? 's' : ''}`;
    },
    backgroundColor: COLORS.expiring + '12',
  },
};

/**
 * @param {object} props
 * @param {object} props.medicine  — Medicine document from Firestore
 * @param {string} props.type      — 'lowStock' | 'expiring' | 'outOfStock'
 */
const AlertItem = ({ medicine, type }) => {
  const config = ALERT_CONFIG[type] || ALERT_CONFIG.lowStock;

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.iconWrapper, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon} size={22} color={config.color} />
      </View>
      <View style={styles.textContent}>
        <Text style={styles.name} numberOfLines={1}>{medicine.name}</Text>
        <Text style={[styles.subtitle, { color: config.color }]}>
          {config.getSubtitle(medicine)}
        </Text>
      </View>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    borderRadius:   12,
    padding:        12,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  iconWrapper: {
    width:          40,
    height:         40,
    borderRadius:   20,
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    12,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize:   14,
    fontWeight: '700',
    color:      COLORS.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize:   12,
    fontWeight: '500',
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: 4,
    marginLeft:   8,
  },
});

export default AlertItem;
