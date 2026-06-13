// GVR Pharma IMS — MedicineDetailScreen
import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { doc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../config/firebase';
import { removeMedicine, selectMedicineById } from '../../store/slices/medicinesSlice';
import { selectUserRole } from '../../store/slices/authSlice';
import { getPermissions } from '../../constants/roles';
import COLORS from '../../constants/colors';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatExpiry, daysUntilExpiry, isExpiringSoon } from '../../utils/dateUtils';
import { getStockColor, getStockLabel } from '../../utils/stockUtils';

const InfoRow = ({ icon, label, value, valueColor }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color={COLORS.primary} style={styles.infoIcon} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  </View>
);

const MedicineDetailScreen = ({ route, navigation }) => {
  const { medicineId } = route.params;
  const dispatch  = useDispatch();
  const role      = useSelector(selectUserRole);
  const perms     = getPermissions(role);
  const medicine  = useSelector(selectMedicineById(medicineId));
  const [deleting, setDeleting] = useState(false);

  // Set header edit button for admin
  useLayoutEffect(() => {
    if (perms.canEdit && medicine) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddEditMedicine', { medicineId })
            }
            style={{ marginRight: 16 }}
          >
            <Ionicons name="create-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, medicine, perms]);

  if (!medicine) {
    return <LoadingSpinner message="Loading medicine details..." />;
  }

  const stockColor   = getStockColor(medicine.stock);
  const stockLabel   = getStockLabel(medicine.stock);
  const days         = daysUntilExpiry(medicine.expiryDate);
  const expiringSoon = isExpiringSoon(medicine.expiryDate);
  const isLowStock   = medicine.stock > 0 && medicine.stock < 20;
  const isOutOfStock = medicine.stock === 0;
  const showBanner   = expiringSoon || isLowStock || isOutOfStock;

  const handleDelete = () => {
    Alert.alert(
      'Delete Medicine',
      `Are you sure you want to permanently delete "${medicine.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteDoc(doc(db, 'medicines', medicineId));
              dispatch(removeMedicine(medicineId));
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete medicine. Please try again.');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Status Banner */}
      {showBanner && (
        <View
          style={[
            styles.banner,
            { backgroundColor: isOutOfStock ? COLORS.danger : expiringSoon ? COLORS.expiring : COLORS.warning },
          ]}
        >
          <Ionicons
            name={isOutOfStock ? 'close-circle' : 'warning'}
            size={18}
            color={COLORS.white}
          />
          <Text style={styles.bannerText}>
            {isOutOfStock
              ? 'This medicine is out of stock'
              : expiringSoon
              ? days < 0
                ? `Expired ${Math.abs(days)} days ago`
                : days === 0
                ? 'Expiring today!'
                : `Expiring in ${days} days`
              : `Low stock — only ${medicine.stock} units remaining`}
          </Text>
        </View>
      )}

      {/* Category badge */}
      <View style={styles.categoryRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{medicine.category}</Text>
        </View>
      </View>

      {/* Detail rows */}
      <View style={styles.card}>
        <InfoRow icon="medkit-outline"   label="Medicine Name"  value={medicine.name} />
        <View style={styles.divider} />
        <InfoRow icon="business-outline" label="Manufacturer"   value={medicine.manufacturer} />
        <View style={styles.divider} />
        <InfoRow icon="barcode-outline"  label="Batch Number"   value={medicine.batchNumber} />
        <View style={styles.divider} />
        <InfoRow
          icon="calendar-outline"
          label="Expiry Date"
          value={`${formatExpiry(medicine.expiryDate)} (${days >= 0 ? `${days} days` : `Expired`})`}
          valueColor={expiringSoon ? COLORS.expiring : COLORS.textPrimary}
        />
        <View style={styles.divider} />
        <InfoRow
          icon="cash-outline"
          label="Price"
          value={`₹${Number(medicine.price ?? 0).toFixed(2)}`}
        />
        <View style={styles.divider} />

        {/* Stock row with colored badge */}
        <View style={styles.infoRow}>
          <Ionicons name="layers-outline" size={18} color={COLORS.primary} style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Current Stock</Text>
            <View style={styles.stockBadgeRow}>
              <View style={[styles.stockBadge, { backgroundColor: stockColor + '20' }]}>
                <View style={[styles.stockDot, { backgroundColor: stockColor }]} />
                <Text style={[styles.stockBadgeText, { color: stockColor }]}>
                  {medicine.stock} units — {stockLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {medicine.description ? (
          <>
            <View style={styles.divider} />
            <InfoRow
              icon="document-text-outline"
              label="Description"
              value={medicine.description}
            />
          </>
        ) : null}
      </View>

      {/* Delete Button — admin only */}
      {perms.canDelete && (
        <Button
          mode="outlined"
          onPress={handleDelete}
          loading={deleting}
          disabled={deleting}
          style={styles.deleteBtn}
          textColor={COLORS.danger}
          icon="trash-outline"
        >
          Delete Medicine
        </Button>
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
    paddingBottom: 40,
  },
  banner: {
    flexDirection:  'row',
    alignItems:     'center',
    padding:        14,
    gap:            10,
  },
  bannerText: {
    color:      COLORS.white,
    fontSize:   14,
    fontWeight: '600',
    flex:       1,
  },
  categoryRow: {
    paddingHorizontal: 20,
    paddingVertical:   12,
  },
  categoryBadge: {
    alignSelf:       'flex-start',
    backgroundColor: COLORS.accent + '20',
    borderRadius:    20,
    paddingHorizontal: 14,
    paddingVertical:   5,
  },
  categoryText: {
    color:      COLORS.primary,
    fontSize:   13,
    fontWeight: '700',
  },
  card: {
    backgroundColor:  COLORS.surface,
    marginHorizontal: 16,
    borderRadius:     16,
    padding:          4,
    elevation:        3,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.08,
    shadowRadius:     6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    padding:       16,
  },
  infoIcon: {
    marginRight: 14,
    marginTop:   2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize:   11,
    fontWeight: '600',
    color:      COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom:  3,
  },
  infoValue: {
    fontSize:   15,
    fontWeight: '600',
    color:      COLORS.textPrimary,
    lineHeight: 22,
  },
  divider: {
    height:          1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  stockBadgeRow: {
    flexDirection: 'row',
    marginTop:     4,
  },
  stockBadge: {
    flexDirection:   'row',
    alignItems:      'center',
    borderRadius:    12,
    paddingHorizontal: 10,
    paddingVertical:   4,
  },
  stockDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
    marginRight:  6,
  },
  stockBadgeText: {
    fontSize:   13,
    fontWeight: '700',
  },
  deleteBtn: {
    margin:       16,
    marginTop:    24,
    borderColor:  COLORS.danger,
    borderRadius: 12,
  },
});

export default MedicineDetailScreen;
