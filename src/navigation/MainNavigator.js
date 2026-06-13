// GVR Pharma IMS — Main Bottom Tab Navigator
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator }     from '@react-navigation/stack';
import { useSelector }              from 'react-redux';
import { Ionicons }                 from '@expo/vector-icons';

import { selectTotalAlerts } from '../store/slices/alertsSlice';
import { selectUserRole }    from '../store/slices/authSlice';
import { getPermissions }    from '../constants/roles';
import COLORS                from '../constants/colors';

// Screens
import DashboardScreen       from '../screens/dashboard/DashboardScreen';
import MedicineListScreen    from '../screens/medicines/MedicineListScreen';
import MedicineDetailScreen  from '../screens/medicines/MedicineDetailScreen';
import AddEditMedicineScreen from '../screens/medicines/AddEditMedicineScreen';
import AlertsScreen          from '../screens/alerts/AlertsScreen';
import ProfileScreen         from '../screens/profile/ProfileScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for Medicines tab (list → detail → add/edit)
const MedicinesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle:      { backgroundColor: COLORS.primary },
      headerTintColor:  COLORS.white,
      headerTitleStyle: { fontWeight: '700', fontSize: 18 },
    }}
  >
    <Stack.Screen
      name="MedicineList"
      component={MedicineListScreen}
      options={{ title: 'Medicines' }}
    />
    <Stack.Screen
      name="MedicineDetail"
      component={MedicineDetailScreen}
      options={{ title: 'Medicine Details' }}
    />
    <Stack.Screen
      name="AddEditMedicine"
      component={AddEditMedicineScreen}
      options={({ route }) => ({
        title: route.params?.medicineId ? 'Edit Medicine' : 'Add Medicine',
      })}
    />
  </Stack.Navigator>
);

// Alert badge overlay
const AlertBadge = ({ count }) => {
  if (!count || count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const MainNavigator = () => {
  const totalAlerts = useSelector(selectTotalAlerts);
  const role        = useSelector(selectUserRole);
  const perms       = getPermissions(role);

  const headerOptions = {
    headerStyle:      { backgroundColor: COLORS.primary },
    headerTintColor:  COLORS.white,
    headerTitleStyle: { fontWeight: '700', fontSize: 18 },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Dashboard')  iconName = focused ? 'home'          : 'home-outline';
          if (route.name === 'Medicines')  iconName = focused ? 'medkit'        : 'medkit-outline';
          if (route.name === 'Alerts')     iconName = focused ? 'notifications' : 'notifications-outline';
          if (route.name === 'Profile')    iconName = focused ? 'person'        : 'person-outline';
          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === 'Alerts' && <AlertBadge count={totalAlerts} />}
            </View>
          );
        },
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor:  COLORS.border,
          paddingBottom:   4,
          height:          60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard', ...headerOptions }}
      />
      <Tab.Screen
        name="Medicines"
        component={MedicinesStack}
        options={{ headerShown: false }}
      />
      {perms.canViewAlerts && (
        <Tab.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{ title: 'Alerts', ...headerOptions }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', ...headerOptions }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position:        'absolute',
    top:             -4,
    right:           -8,
    backgroundColor: COLORS.badge,
    borderRadius:    8,
    minWidth:        16,
    height:          16,
    justifyContent:  'center',
    alignItems:      'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color:      COLORS.white,
    fontSize:   9,
    fontWeight: '700',
  },
});

export default MainNavigator;
