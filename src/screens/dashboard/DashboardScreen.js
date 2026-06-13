// GVR Pharma IMS — DashboardScreen
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { selectUser } from '../../store/slices/authSlice';
import { selectMedicines, selectMedLoading } from '../../store/slices/medicinesSlice';
import COLORS from '../../constants/colors';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import useMedicines from '../../hooks/useMedicines';
import useAlerts from '../../hooks/useAlerts';
import { formatExpiry, isExpiringSoon } from '../../utils/dateUtils';
import { getStockColor, getStockLabel } from '../../utils/stockUtils';
import { LOW_STOCK_THRESHOLD } from '../../utils/stockUtils';

const ROLE_COLORS = {
  admin:   COLORS.primary,
  manager: COLORS.success,
  sales:   COLORS.textMuted,
};

const DashboardScreen = ({ navigation }) => {
  const user      = useSelector(selectUser);
  const medicines = useSelector(selectMedicines);
  const medLoading = useSelector(selectMedLoading);

  // Hooks wire Firestore listener + alert derivation
  const { loading } = useMedicines();
  useAlerts();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Stat calculations
  const total       = medicines.length;
  const lowStock    = medicines.filter((m) => m.stock > 0 && m.stock < LOW_STOCK_THRESHOLD).length;
  const expiring    = medicines.filter((m) => isExpiringSoon(m.expiryDate)).length;
  const outOfStock  = medicines.filter((m) => m.stock === 0).length;

  // Recent activity: last 5 updated
  const recentMeds = [...medicines]
    .sort((a, b) => (b.updatedAt ?? '') > (a.updatedAt ?? '') ? 1 : -1)
    .slice(0, 5);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // onSnapshot listener handles real-time updates automatically;
    // a brief visual refresh delay is sufficient.
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  if (loading && medicines.length === 0) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLORS[user?.role] ?? COLORS.textMuted) + '20' }]}>
          <Text style={[styles.roleText, { color: ROLE_COLORS[user?.role] ?? COLORS.textMuted }]}>
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
          </Text>
        </View>
      </View>

      {/* Stat Cards 2×2 Grid */}
      <Text style={styles.sectionTitle}>Inventory Overview</Text>
      <View style={styles.gridRow}>
        <StatCard
          title="Total Medicines"
          value={total}
          icon="medkit"
          backgroundColor={COLORS.statBlue}
        />
        <StatCard
          title="Low Stock"
          value={lowStock}
          icon="warning"
          backgroundColor={COLORS.statAmber}
        />
      </View>
      <View style={styles.gridRow}>
        <StatCard
          title="Expiring Soon"
          value={expiring}
          icon="time"
          backgroundColor={COLORS.statOrange}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          icon="close-circle"
          backgroundColor={COLORS.statRed}
        />
      </View>

      {/* Recent Activity */}
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Medicines')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentMeds.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="cube-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No medicines added yet.</Text>
        </View>
      ) : (
        recentMeds.map((med) => {
          const stockColor = getStockColor(med.stock);
          return (
            <TouchableOpacity
              key={med.id}
              style={styles.recentItem}
              onPress={() =>
                navigation.navigate('Medicines', {
                  screen: 'MedicineDetail',
                  params: { medicineId: med.id },
                })
              }
              activeOpacity={0.7}
            >
              <View style={[styles.recentDot, { backgroundColor: stockColor }]} />
              <View style={styles.recentInfo}>
                <Text style={styles.recentName} numberOfLines={1}>{med.name}</Text>
                <Text style={styles.recentMeta}>
                  {med.stock} units · {formatExpiry(med.expiryDate)}
                  {isExpiringSoon(med.expiryDate) ? ' ⚠' : ''}
                </Text>
              </View>
              <View style={[styles.recentBadge, { backgroundColor: stockColor + '20' }]}>
                <Text style={[styles.recentBadgeText, { color: stockColor }]}>
                  {getStockLabel(med.stock)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 32,
  },
  headerSection: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: 20,
    paddingTop:      20,
    paddingBottom:   16,
    backgroundColor: COLORS.primary,
  },
  greeting: {
    color:      'rgba(255,255,255,0.8)',
    fontSize:   14,
    fontWeight: '400',
  },
  userName: {
    color:      COLORS.white,
    fontSize:   22,
    fontWeight: '800',
    marginTop:  2,
  },
  roleBadge: {
    borderRadius:    20,
    paddingHorizontal: 14,
    paddingVertical:   6,
    backgroundColor:   'rgba(255,255,255,0.2)',
  },
  roleText: {
    color:      COLORS.white,
    fontSize:   12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize:        16,
    fontWeight:      '700',
    color:           COLORS.textPrimary,
    paddingHorizontal: 20,
    marginTop:       20,
    marginBottom:    8,
  },
  gridRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  recentHeader: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: 20,
    marginTop:       20,
    marginBottom:    8,
  },
  viewAll: {
    color:      COLORS.accent,
    fontSize:   13,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical:   4,
    borderRadius:    14,
    padding:         14,
    elevation:       2,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
  },
  recentDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
    marginRight:  12,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize:   14,
    fontWeight: '700',
    color:      COLORS.textPrimary,
    marginBottom: 2,
  },
  recentMeta: {
    fontSize: 12,
    color:    COLORS.textMuted,
  },
  recentBadge: {
    borderRadius:    10,
    paddingHorizontal: 8,
    paddingVertical:   3,
    marginLeft:      8,
  },
  recentBadgeText: {
    fontSize:   10,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius:    16,
    padding:         40,
    elevation:       2,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
  },
  emptyText: {
    marginTop: 12,
    color:     COLORS.textMuted,
    fontSize:  14,
  },
});

export default DashboardScreen;
