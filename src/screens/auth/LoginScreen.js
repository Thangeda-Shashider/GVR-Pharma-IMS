// GVR Pharma IMS — LoginScreen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { setUser, setLoading, setError } from '../../store/slices/authSlice';
import COLORS from '../../constants/colors';

const LoginScreen = () => {
  const dispatch = useDispatch();

  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [errorMsg,    setErrorMsg]    = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    // Basic validation
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setSubmitting(true);
      dispatch(setLoading(true));

      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = credential.user;

      // Fetch Firestore user profile
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let userData;
      if (userDoc.exists()) {
        userData = {
          uid:   firebaseUser.uid,
          email: firebaseUser.email,
          name:  userDoc.data().name ?? firebaseUser.email,
          role:  userDoc.data().role ?? 'sales',
        };
      } else {
        userData = {
          uid:   firebaseUser.uid,
          email: firebaseUser.email,
          name:  firebaseUser.email,
          role:  'sales',
        };
      }

      dispatch(setUser(userData));
      // AppNavigator will automatically switch to MainNavigator
    } catch (err) {
      console.log('Firebase Auth Error:', err.code, err.message);
      let message = '';
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          message = 'Invalid email or password. Check your credentials.';
          break;
        case 'auth/invalid-email':
          message = 'The email address is badly formatted.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Email/Password sign-in is not enabled in Firebase Console.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Try again later or reset password.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Check your internet connection.';
          break;
        default:
          message = `Error (${err.code || 'unknown'}): ${err.message}`;
      }
      setErrorMsg(message);
      dispatch(setError(message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header branding */}
        <View style={styles.header}>
          {/* Pill logo */}
          <View style={styles.pillRow}>
            <View style={styles.pillOuter}>
              <View style={styles.pillLeft}  />
              <View style={styles.pillRight} />
            </View>
          </View>
          <Text style={styles.brandName}>GVR Pharma</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            mode="outlined"
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            disabled={submitting}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            mode="outlined"
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPass ? 'eye-off-outline' : 'eye-outline'}
                onPress={() => setShowPass((v) => !v)}
              />
            }
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            disabled={submitting}
          />

          {/* Error message */}
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={submitting}
            disabled={submitting}
            style={styles.loginBtn}
            contentStyle={styles.loginBtnContent}
            labelStyle={styles.loginBtnLabel}
            buttonColor={COLORS.primary}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>

          <Text style={styles.footerNote}>
            Accounts are managed by your system administrator.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow:        1,
    backgroundColor: COLORS.background,
    paddingBottom:   40,
  },
  header: {
    backgroundColor:  COLORS.primary,
    paddingTop:       80,
    paddingBottom:    48,
    alignItems:       'center',
    borderBottomLeftRadius:  32,
    borderBottomRightRadius: 32,
  },
  pillRow: {
    marginBottom: 14,
  },
  pillOuter: {
    flexDirection: 'row',
    width:         60,
    height:        26,
    borderRadius:  13,
    overflow:      'hidden',
    borderWidth:   2.5,
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
  brandName: {
    color:      COLORS.white,
    fontSize:   32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color:      'rgba(255,255,255,0.8)',
    fontSize:   15,
    marginTop:  6,
    fontWeight: '400',
  },
  card: {
    backgroundColor:  COLORS.surface,
    borderRadius:     24,
    marginHorizontal: 20,
    marginTop:        -20,
    padding:          24,
    elevation:        6,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 4 },
    shadowOpacity:    0.12,
    shadowRadius:     12,
  },
  input: {
    marginBottom:    16,
    backgroundColor: COLORS.surface,
  },
  errorBox: {
    backgroundColor: COLORS.danger + '15',
    borderRadius:    10,
    padding:         12,
    marginBottom:    16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    color:      COLORS.danger,
    fontSize:   13,
    fontWeight: '500',
  },
  loginBtn: {
    borderRadius: 12,
    marginTop:    4,
    marginBottom: 20,
    elevation:    3,
  },
  loginBtnContent: {
    paddingVertical: 6,
  },
  loginBtnLabel: {
    fontSize:   16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerNote: {
    textAlign: 'center',
    color:     COLORS.textMuted,
    fontSize:  12,
  },
});

export default LoginScreen;
