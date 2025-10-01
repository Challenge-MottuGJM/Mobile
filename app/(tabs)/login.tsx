import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/themeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';

export default function Login() {
const { isDark } = useTheme();
const colors = isDark ? DARK_BG : LIGHT_BG;
const router = useRouter();
const { state, signIn, signOut } = useContext(AuthContext);

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [busy, setBusy] = useState(false);
const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

function validate() {
const next: typeof errors = {};
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  if (!email.trim()) next.email = 'Informe o e-mail.';
    else if (!emailRegex.test(email.trim())) next.email = 'E-mail inválido.';
  if (!password) next.password = 'Informe a senha.';
    else if (password.length < 6) next.password = 'Senha deve ter ao menos 6 caracteres.';
  setErrors(next);
return Object.keys(next).length === 0;
}

const handleLogin = async () => {
  if (!validate()) return;
    setBusy(true);
    setErrors({});
  try {
  await signIn(email.trim(), password);
  router.replace('/(tabs)');
} catch (e: any) {
  setErrors({ general: 'Não foi possível entrar. Verifique os dados e tente novamente.' });
} finally {
  setBusy(false);
}
};

  if (state.loading) {
return (
  <View style={styles.center}>
    <ActivityIndicator />
  </View>
  );
}

const isLogged = !!state.accessToken;

return (
<LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
<View style={styles.wrapper}>
<Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>{isLogged ? 'Conta' : 'Entrar'}</Text>

    {isLogged ? (
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: isDark ? '#1f1f1fcc' : '#ffffffcc' }]}>
          <View style={[styles.avatar, { backgroundColor: isDark ? '#2a2a2a' : '#EFE9FF' }]}>
            <Text style={[styles.avatarText, { color: isDark ? '#D6CCFF' : '#5e17eb' }]}>
              {state.user?.name?.toUpperCase() ?? state.user?.email?.toUpperCase() ?? 'U'}
            </Text>
          </View>

          <Text style={[styles.name, { color: isDark ? '#fff' : '#2D2A32' }]}>
            {state.user?.name ?? 'Conta'}
          </Text>
          <Text style={[styles.email, { color: isDark ? '#BEBEBE' : '#6B6B6B' }]}>
            {state.user?.email}
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={signOut} disabled={busy}>
            <Text style={styles.btnText}>{busy ? 'Saindo...' : 'Sair'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          secureTextEntry
        />
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

        {errors.general ? <Text style={[styles.error, { textAlign: 'center' }]}>{errors.general}</Text> : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={busy}>
          <Text style={styles.btnText}>{busy ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={[styles.link, { color: '#5e17eb' }]}>Criar conta</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
</LinearGradient>
);
}

const styles = StyleSheet.create({
wrapper: { flex: 1, padding: 20, paddingTop: 60 },
title: { fontSize: 24, textAlign: 'center', marginBottom: 16, fontFamily: 'Inter_700Bold' },

container: { flex: 1, paddingTop: 8 },
card: {
borderRadius: 16,
padding: 20,
alignItems: 'center',
shadowColor: '#000',
shadowOpacity: 0.12,
shadowOffset: { width: 0, height: 4 },
shadowRadius: 12,
elevation: 4,
},
avatar: {
  width: 76,
  height: 76,
  borderRadius: 38,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
},
avatarText: { 
  fontSize: 28,  
  fontFamily: 'Inter_700Bold' },
name: { 
  fontSize: 20,
  marginBottom: 4,
  fontFamily: 'Inter_700Bold' },
email: {
  fontSize: 14,
  marginBottom: 20,
  fontFamily: 'Inter_400Regular' },
input: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  padding: 12,
  marginBottom: 8,
  fontFamily: 'Inter_400Regular',
},
error: { color: '#C62828', marginBottom: 8, fontFamily: 'Inter_600SemiBold' },

primaryBtn: {
  backgroundColor: '#5e17eb',
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 8,
  minWidth: 200,
},
btnText: { color: '#fff', fontFamily: 'Inter_600SemiBold' },

link: { textAlign: 'center', marginTop: 12, fontFamily: 'Inter_600SemiBold' },
body: { textAlign: 'center', marginBottom: 12, fontFamily: 'Inter_400Regular' },
center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});