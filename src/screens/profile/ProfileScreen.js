// GVR Pharma IMS — ProfileScreen
// Shows user info, role, and logout button.
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { clearUser, selectUser } from '../../store/slices/authSlice';
import { clearAlerts } from '../../store/slices/alertsSlice';
import COLORS from '../../constants/colors';

const ROLE_META = {
  admin:   { label: 'Administrator',  color: COLORS.primary,  icon: 'shield-checkmark' },
  manager: { label: 'Manager',        color: COLORS.success,  icon: 'person-circle'    },
  sales:   { label: 'Sales',          color: COLORS.textMuted, icon: 'storefront'      },
};

const ProfileScreen = () => {
  const dispatch  = useDispatch();
  const user      = useSelector(selectUser);
  const [loading, setLoading] = useState(false);

  const roleMeta = ROLE_META[user?.role] ?? ROLE_META.sales;

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await signOut(auth);
              dispatch(clearUser());
              dispatch(clearAlerts());
              // AppNavigator will automatically switch to AuthNavigator
            } catch (err) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>
            {(user?.name ?? 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        {/* Role Badge */}
        <View style={[styles.roleBadge, { backgroundColor: roleMeta.color + '15' }]}>
          <Ionicons name={roleMeta.icon} size={14} color={roleMeta.color} style={{ marginRight: 5 }} />
          <Text style={[styles.roleText, { color: roleMeta.color }]}>{roleMeta.label}</Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="finger-print-outline" size={20} color={COLORS.primary} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{user?.uid}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name={roleMeta.icon} size={20} color={COLORS.primary} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.infoLabel}>Access Level</Text>
            <Text style={styles.infoValue}>{roleMeta.label}</Text>
          </View>
        </View>
      </View>

      {/* Permissions Card */}
      <Text style={styles.sectionTitle}>Permissions</Text>
      <View style={styles.permCard}>
        {[
          { label: 'Add Medicines',    allowed: ['admin'].includes(user?.role) },
          { label: 'Edit Medicines',   allowed: ['admin'].includes(user?.role) },
          { label: 'Delete Medicines', allowed: ['admin'].includes(user?.role) },
          { label: 'View Alerts',      allowed: ['admin','manager'].includes(user?.role) },
        ].map(({ label, allowed }) => (
          <View key={label} style={styles.permRow}>
            <Ionicons
              name={allowed ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={allowed ? COLORS.success : COLORS.danger}
            />
            <Text style={[styles.permLabel, { color: allowed ? COLORS.textPrimary : COLORS.textMuted }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Logout */}
      <Button
        mode="outlined"
        onPress={handleLogout}
        loading={loading}
        disabled={loading}
        style={styles.logoutBtn}
        textColor={COLORS.danger}
        icon="log-out-outline"
      >
        Sign Out
      </Button>
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
  avatarSection: {
    alignItems:      'center',
    backgroundColor: COLORS.primary,
    paddingTop:      32,
    paddingBottom:   40,
  },
  avatar: {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    12,
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.5)',
  },
  avatarLetter: {
    color:      COLORS.white,
    fontSize:   34,
    fontWeight: '800',
  },
  userName: {
    color:      COLORS.white,
    fontSize:   22,
    fontWeight: '800',
    marginBottom: 4,
  },
  userEmail: {
    color:    'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection:   'row',
    alignItems:      'center',
    borderRadius:    20,
    paddingHorizontal: 14,
    paddingVertical:   6,
    backgroundColor:   'rgba(255,255,255,0.2)',
  },
  roleText: {
    color:      COLORS.white,
    fontSize:   13,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor:  COLORS.surface,
    marginHorizontal: 16,
    marginTop:        -18,
    borderRadius:     16,
    padding:          4,
    elevation:        4,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.1,
    shadowRadius:     8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       16,
    gap:           14,
  },
  infoTextBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize:   11,
    fontWeight: '600',
    color:      COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom:  2,
  },
  infoValue: {
    fontSize:   14,
    fontWeight: '600',
    color:      COLORS.textPrimary,
  },
  divider: {
    height:          1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize:        13,
    fontWeight:      '700',
    color:           COLORS.textMuted,
    textTransform:   'uppercase',
    letterSpacing:   0.8,
    paddingHorizontal: 20,
    marginTop:         24,
    marginBottom:      8,
  },
  permCard: {
    backgroundColor:  COLORS.surface,
    marginHorizontal: 16,
    borderRadius:     16,
    padding:          8,
    elevation:        2,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.06,
    shadowRadius:     4,
  },
  permRow: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       12,
    gap:           12,
  },
  permLabel: {
    fontSize:   14,
    fontWeight: '500',
  },
  logoutBtn: {
    margin:       16,
    marginTop:    28,
    borderColor:  COLORS.danger,
    borderRadius: 12,
  },
});

export default ProfileScreen;
