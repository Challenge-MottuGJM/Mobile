import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../theme/gradients';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Signup() {
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;
  const { signUp } = useContext(AuthContext);
  const { t } = useTranslation();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

  function validate() {
    const next: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) next.name = t('signup.errors.nameRequired');
    else if (name.trim().length < 2) next.name = t('signup.errors.nameShort');
    if (!email.trim()) next.email = t('auth.errors.emailRequired');
    else if (!emailRegex.test(email.trim())) next.email = t('auth.errors.emailInvalid');
    if (!password) next.password = t('auth.errors.passwordRequired');
    else if (password.length < 6) next.password = t('auth.errors.passwordMin');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const handleSignup = async () => {
    if (!validate()) return;
    setBusy(true);
    setErrors({});
    try {
      await signUp(name.trim(), email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setErrors({ general: t('signup.errors.general') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <LinearGradient colors={colors} start={{ x:0, y:0 }} end={{ x:1, y:1 }} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>{t('signup.title')}</Text>

        <TextInput
          style={styles.input}
          placeholder={t('signup.namePlaceholder')}
          value={name}
          onChangeText={(v) => { setName(v); if (errors.name) setErrors({ ...errors, name: undefined }); }}
        />
        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChangeText={(v) => { setEmail(v); if (errors.email) setErrors({ ...errors, email: undefined }); }}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder={t('auth.passwordPlaceholder')}
          value={password}
          onChangeText={(v) => { setPassword(v); if (errors.password) setErrors({ ...errors, password: undefined }); }}
          secureTextEntry
        />
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

        {errors.general ? <Text style={[styles.error, { textAlign: 'center' }]}>{errors.general}</Text> : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup} disabled={busy}>
          <Text style={styles.btnText}>{busy ? t('signup.sending') : t('signup.submit')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/login')}
          disabled={busy}
        >
          <Text style={styles.secondaryText}>{t('Voltar para login') || 'Voltar ao login'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 24, fontFamily: 'Inter_700Bold', color: '#ffffffff' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 8, fontFamily: 'Inter_400Regular' },
  error: { color: '#C62828', marginBottom: 8, fontFamily: 'Inter_600SemiBold' },
  primaryBtn: { backgroundColor: '#5e17eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  secondaryBtn: { marginTop: 12, padding: 12, alignItems: 'center' },
  secondaryText: { color: '#fff', opacity: 0.9, fontFamily: 'Inter_600SemiBold' },
});
