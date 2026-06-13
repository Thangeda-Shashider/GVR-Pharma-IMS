// GVR Pharma IMS — AlertsScreen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  selectLowStock,
  selectExpiringSoon,
  selectOutOfStock,
  selectTotalAlerts,
} from '../../store/slices/alertsSlice';
import COLORS from '../../constants/colors';
import AlertItem from '../../components/AlertItem';
import useAlerts from '../../hooks/useAlerts';

const SectionHeader = ({ icon, title, count, color }) => (
  <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
    <View style={[styles.sectionIconWrap, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    <View style={[styles.countBadge, { backgroundColor: color }]}>
      <Text style={styles.countBadgeText}>{count}</Text>
    </View>
  </View>
);

const EmptySectionNote = ({ message }) => (
  <View style={styles.emptySection}>
    <Text style={styles.emptySectionText}>{message}</Text>
  </View>
);

const AlertsScreen = () => {
  useAlerts(); // Keep alerts derived from medicines up to date

  const outOfStock   = useSelector(selectOutOfStock);
  const lowStock     = useSelector(selectLowStock);
  const expiringSoon = useSelector(selectExpiringSoon);
  const totalAlerts  = useSelector(selectTotalAlerts);

  // All-clear state
  if (totalAlerts === 0) {
    return (
      <View style={styles.allClearContainer}>
        <View style={styles.allClearIcon}>
          <Ionicons name="shield-checkmark" size={72} color={COLORS.success} />
        </View>
        <Text style={styles.allClearTitle}>All Inventory in Good Shape</Text>
        <Text style={styles.allClearSubtitle}>
          No out-of-stock, low-stock, or expiring medicines detected.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Summary Banner */}
      <View style={styles.summaryBanner}>
        <Ionicons name="notifications" size={20} color={COLORS.white} />
        <Text style={styles.summaryText}>
          {totalAlerts} alert{totalAlerts !== 1 ? 's' : ''} require your attention
        </Text>
      </View>

      {/* Section 1: Out of Stock */}
      <SectionHeader
        icon="close-circle"
        title="Out of Stock"
        count={outOfStock.length}
        color={COLORS.danger}
      />
      {outOfStock.length === 0 ? (
        <EmptySectionNote message="No out-of-stock medicines." />
      ) : (
        outOfStock.map((m) => (
          <AlertItem key={m.id} medicine={m} type="outOfStock" />
        ))
      )}

      {/* Section 2: Low Stock */}
      <SectionHeader
        icon="warning"
        title="Low Stock"
        count={lowStock.length}
        color={COLORS.warning}
      />
      {lowStock.length === 0 ? (
        <EmptySectionNote message="No low-stock medicines." />
      ) : (
        lowStock.map((m) => (
          <AlertItem key={m.id} medicine={m} type="lowStock" />
        ))
      )}

      {/* Section 3: Expiring Soon */}
      <SectionHeader
        icon="time"
        title="Expiring Soon"
        count={expiringSoon.length}
        color={COLORS.expiring}
      />
      {expiringSoon.length === 0 ? (
        <EmptySectionNote message="No medicines expiring within 90 days." />
      ) : (
        expiringSoon.map((m) => (
          <AlertItem key={m.id} medicine={m} type="expiring" />
        ))
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 40,
  },
  summaryBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical:   14,
    gap:             10,
  },
  summaryText: {
    color:      COLORS.white,
    fontSize:   14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: 16,
    paddingVertical:   12,
    marginTop:        20,
    marginHorizontal:  16,
    backgroundColor:   COLORS.surface,
    borderRadius:      12,
    borderLeftWidth:   4,
    elevation:         2,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 1 },
    shadowOpacity:     0.06,
    shadowRadius:      4,
    marginBottom:      8,
  },
  sectionIconWrap: {
    width:          34,
    height:         34,
    borderRadius:   17,
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    10,
  },
  sectionTitle: {
    flex:       1,
    fontSize:   15,
    fontWeight: '700',
  },
  countBadge: {
    borderRadius:    12,
    minWidth:        28,
    height:          28,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 8,
  },
  countBadgeText: {
    color:      COLORS.white,
    fontSize:   13,
    fontWeight: '800',
  },
  emptySection: {
    paddingHorizontal: 20,
    paddingVertical:   10,
    marginBottom:       4,
  },
  emptySectionText: {
    color:     COLORS.textMuted,
    fontSize:  13,
    fontStyle: 'italic',
  },
  allClearContainer: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.background,
    padding:         40,
  },
  allClearIcon: {
    width:           120,
    height:          120,
    borderRadius:    60,
    backgroundColor: COLORS.success + '15',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    24,
  },
  allClearTitle: {
    fontSize:   22,
    fontWeight: '800',
    color:      COLORS.textPrimary,
    textAlign:  'center',
    marginBottom: 12,
  },
  allClearSubtitle: {
    fontSize:   15,
    color:      COLORS.textMuted,
    textAlign:  'center',
    lineHeight: 22,
  },
});

export default AlertsScreen;
