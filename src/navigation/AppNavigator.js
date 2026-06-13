// GVR Pharma IMS — Root App Navigator
// Switches between Auth and Main stacks based on Redux auth state.
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const user = useSelector(selectUser);

  // SplashScreen (inside AuthNavigator) handles the auth check transition.
  // Once user is in Redux store, we render MainNavigator directly.
  // The auth check + 2s delay happens inside SplashScreen itself.
  return user ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
