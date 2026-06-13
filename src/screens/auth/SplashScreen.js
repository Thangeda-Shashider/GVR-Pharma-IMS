// GVR Pharma IMS — SplashScreen
// Full-screen branded splash with Firebase auth check and 2s minimum delay.
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { setUser, clearUser } from '../../store/slices/authSlice';
import COLORS from '../../constants/colors';

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // Animated values
  const logoScale   = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue:         1,
          tension:         60,
          friction:        8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue:         1,
          duration:        500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue:         1,
        duration:        400,
        useNativeDriver: true,
      }),
    ]).start();

    const startTime = Date.now();
    const MIN_DELAY = 2000; // 2 second minimum splash

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        let userPayload = null;

        if (firebaseUser) {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            userPayload = {
              uid:   firebaseUser.uid,
              email: firebaseUser.email,
              name:  userDoc.data().name  ?? firebaseUser.email,
              role:  userDoc.data().role  ?? 'sales',
            };
          } else {
            // User doc not in Firestore — treat as sales role
            userPayload = {
              uid:   firebaseUser.uid,
              email: firebaseUser.email,
              name:  firebaseUser.email,
              role:  'sales',
            };
          }
          dispatch(setUser(userPayload));
        } else {
          dispatch(clearUser());
        }

        // Enforce minimum 2 second splash
        const elapsed   = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DELAY - elapsed);
        setTimeout(() => {
          // Navigation is handled by AppNavigator via Redux state change.
          // If user is null, AppNavigator will show Login.
          if (!userPayload) {
            navigation.replace('Login');
          }
          // If user is set, AppNavigator switches to MainNavigator automatically.
        }, remaining);
      } catch (error) {
        console.error('[SplashScreen] Auth check error:', error);
        dispatch(clearUser());
        setTimeout(() => navigation.replace('Login'), MIN_DELAY);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Icon */}
      <Animated.View
        style={[
          styles.iconWrapper,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.pillOuter}>
          <View style={styles.pillLeft}  />
          <View style={styles.pillRight} />
        </View>
      </Animated.View>

      {/* App Name + Tagline */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={styles.appName}>GVR Pharma IMS</Text>
        <Text style={styles.tagline}>Inventory Management System</Text>
      </Animated.View>

      {/* Loading indicator */}
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="small" color={COLORS.white} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 32,
  },
  pillOuter: {
    flexDirection: 'row',
    width:         80,
    height:        36,
    borderRadius:  18,
    overflow:      'hidden',
    borderWidth:   3,
    borderColor:   COLORS.white,
  },
  pillLeft: {
    flex:            1,
    backgroundColor: COLORS.white,
  },
  pillRight: {
    flex:            1,
    backgroundColor: 'transparent',
  },
  appName: {
    color:      COLORS.white,
    fontSize:   28,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom:  6,
  },
  tagline: {
    color:      'rgba(255,255,255,0.75)',
    fontSize:   14,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  loadingWrapper: {
    position: 'absolute',
    bottom:   60,
  },
});

export default SplashScreen;
