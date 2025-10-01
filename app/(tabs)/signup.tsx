import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';
import { useRouter } from 'expo-router';


export default function Signup() {
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

  function validate() {
    const next: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) next.name = 'Informe o nome.';
    else if (name.trim().length < 2) next.name = 'Nome muito curto.';
    if (!email.trim()) next.email = 'Informe o e-mail.';
    else if (!emailRegex.test(email.trim())) next.email = 'E-mail inválido.';
    if (!password) next.password = 'Informe a senha.';
    else if (password.length < 6) next.password = 'Senha deve ter ao menos 6 caracteres.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const router = useRouter();

const handleSignup = async () => {
  if (!validate()) return;
  setBusy(true);
  setErrors({});
  try {
    await signUp(name.trim(), email.trim(), password);
    router.replace('/(tabs)');
  } catch (e: any) {
    setErrors({ general: 'Não foi possível cadastrar. Verifique os dados e tente novamente.' });
  } finally {
    setBusy(false);
  }
};


  return (
    <LinearGradient colors={colors} start={{ x:0, y:0 }} end={{ x:1, y:1 }} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>Criar conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={(v) => { setName(v); if (errors.name) setErrors({ ...errors, name: undefined }); }}
        />
        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

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

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup} disabled={busy}>
          <Text style={styles.btnText}>{busy ? 'Enviando...' : 'Cadastrar'}</Text>
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
});
