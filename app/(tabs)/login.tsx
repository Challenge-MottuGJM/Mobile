import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/themeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';
import  {addDoc, collection, db} from '../../services/firebaseConfig';

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    } catch (e: any) {
      // Quando integrar, trocar pela mensagem da api
      setErrors({ general: 'Não foi possível entrar. Verifique os dados e tente novamente.' });
    } finally {
      setBusy(false);
    }
  };

  if (state.loading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  const isLogged = !!state.accessToken;

  return (
    <LinearGradient colors={colors} start={{ x:0, y:0 }} end={{ x:1, y:1 }} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>{isLogged ? 'Conta' : 'Entrar'}</Text>

        {isLogged ? (
          <>
            <Text style={[styles.body, { color: isDark ? '#fff' : '#333' }]}>
              {state.user?.name} ({state.user?.email})
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={signOut} disabled={busy}>
              <Text style={styles.btnText}>{busy ? '...' : 'Sair'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={(v) => { setEmail(v); if (errors.email) setErrors({ ...errors, email: undefined }); }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={(v) => { setPassword(v); if (errors.password) setErrors({ ...errors, password: undefined }); }}
              secureTextEntry
            />
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

            {errors.general ? <Text style={[styles.error, { textAlign: 'center' }]}>{errors.general}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={busy}>
              <Text style={styles.btnText}>{busy ? 'Entrando...' : 'Entrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(tabs)/signup')}>
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
  title: { fontSize: 24, textAlign: 'center', marginBottom: 24, fontFamily: 'Inter_700Bold' },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 8, fontFamily: 'Inter_400Regular',
  },
  error: { color: '#C62828', marginBottom: 8, fontFamily: 'Inter_600SemiBold' },
  primaryBtn: { backgroundColor: '#5e17eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  link: { textAlign: 'center', marginTop: 12, fontFamily: 'Inter_600SemiBold' },
  body: { textAlign: 'center', marginBottom: 12, fontFamily: 'Inter_400Regular' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
