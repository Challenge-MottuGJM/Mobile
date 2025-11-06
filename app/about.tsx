import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useTheme } from '../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../theme/gradients';
import { useTranslation } from 'react-i18next';


export default function About() {
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;
  const { t } = useTranslation();

  const commit: string =
    (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_GIT_SHA ?? 'dev';
  const short = commit.slice(0, 7);

  const appName = Constants.expoConfig?.name ?? 'EasyFinder';
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>{appName}</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#DADADA' : '#555' }]}>v{version}</Text>

        <Text style={[styles.label, { color: isDark ? '#EDEDED' : '#444' }]}>Commit</Text>
        <TouchableOpacity
          style={[
            styles.hashPill,
            {
              borderColor: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.20)',
              backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.60)',
            },
          ]}
          onPress={() => Alert.alert('Commit', commit)}
        >
          <Text style={[styles.hash, { color: isDark ? '#fff' : '#2D2A32' }]}>{short}</Text>
        </TouchableOpacity>

        <Text style={[styles.hint, { color: isDark ? 'rgba(255,255,255,0.75)' : '#6B6B6B' }]}>
          Toque para ver o hash completo
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20, paddingTop: 60, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  subtitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 16 },
  label: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  hashPill: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  hash: { fontFamily: 'Courier', fontSize: 16, letterSpacing: 0.5 },
  hint: { fontSize: 12, marginTop: 6, fontFamily: 'Inter_400Regular' },
});
