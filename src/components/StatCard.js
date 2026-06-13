// GVR Pharma IMS — StatCard Component
// A dashboard stat card showing an icon, big number, and label.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * @param {object}  props
 * @param {string}  props.title            — Card label (e.g. "Total Medicines")
 * @param {number}  props.value            — The numeric stat
 * @param {string}  props.icon             — Ionicons icon name
 * @param {string}  props.backgroundColor  — Card background color
 * @param {string}  [props.textColor]      — Text / icon color (defaults to white)
 */
const StatCard = ({ title, value, icon, backgroundColor, textColor = '#FFFFFF' }) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={28} color={textColor} />
      </View>
      <Text style={[styles.value, { color: textColor }]}>{value ?? 0}</Text>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex:           1,
    margin:         6,
    borderRadius:   16,
    padding:        16,
    alignItems:     'center',
    justifyContent: 'center',
    minHeight:      120,
    elevation:      4,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0.15,
    shadowRadius:   6,
  },
  iconWrapper: {
    marginBottom: 8,
  },
  value: {
    fontSize:   32,
    fontWeight: '800',
    lineHeight: 36,
  },
  title: {
    fontSize:   12,
    fontWeight: '600',
    marginTop:  4,
    textAlign:  'center',
    opacity:    0.9,
  },
});

export default StatCard;
