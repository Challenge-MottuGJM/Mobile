import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';

export default function Signup() {
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');

  const handleSignup = async () => { await signUp(name.trim(), email.trim(), password); };

  return (
    <LinearGradient colors={colors} start={{ x:0, y:0 }} end={{ x:1, y:1 }} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Criar conta</Text>
        <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup}>
          <Text style={styles.btnText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 24, fontFamily: 'Inter_700Bold', color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, fontFamily: 'Inter_400Regular' },
  primaryBtn: { backgroundColor: '#5e17eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
});
