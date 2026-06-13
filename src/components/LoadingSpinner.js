// GVR Pharma IMS — LoadingSpinner Component
// Full-screen centered activity indicator with optional message.
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

/**
 * @param {object}  props
 * @param {string}  [props.message]  — Optional label below the spinner
 * @param {string}  [props.color]    — Spinner color (defaults to primary)
 * @param {boolean} [props.overlay]  — If true, renders with semi-transparent overlay
 */
const LoadingSpinner = ({ message, color = COLORS.primary, overlay = false }) => {
  return (
    <View style={[styles.container, overlay && styles.overlay]}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={color} />
        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  overlay: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    bottom:          0,
    backgroundColor: COLORS.overlay,
    zIndex:          999,
  },
  card: {
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.surface,
    borderRadius:    16,
    padding:         28,
    elevation:       6,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.15,
    shadowRadius:    8,
  },
  message: {
    marginTop:  14,
    fontSize:   14,
    color:      COLORS.textMuted,
    fontWeight: '500',
    textAlign:  'center',
  },
});

export default LoadingSpinner;
