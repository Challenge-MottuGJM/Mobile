import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';
import { router } from 'expo-router';

type Lang = 'pt-BR' | 'es';

const LANG_KEY = 'app_language';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;

  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>('pt-BR');

  useEffect(() => {
    (async () => {
      try {
        const saved = (await AsyncStorage.getItem(LANG_KEY)) as Lang | null;
        if (saved) {
          setLang(saved);
          await i18n.changeLanguage(saved);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSelect = async (l: Lang) => {
    try {
      setLang(l);
      await i18n.changeLanguage(l);
      await AsyncStorage.setItem(LANG_KEY, l);
      Alert.alert(t('settings.languageChangedTitle'), t('settings.languageChangedMsg'));
    } catch (e) {
      Alert.alert(t('common.error'), t('settings.changeError'));
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={colors} start={{ x:0, y:0 }} end={{ x:1, y:1 }} style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors} start={{ x:0, y:0 }} end={{ x:1, y:1 }} style={{ flex:1 }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>{t('settings.title')}</Text>

        <TouchableOpacity
          style={[styles.button, lang === 'pt-BR' && styles.buttonActive]}
          onPress={() => onSelect('pt-BR')}
        >
          <Text style={styles.buttonText}>Português (Brasil)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, lang === 'es' && styles.buttonActive]}
          onPress={() => onSelect('es')}
        >
          <Text style={styles.buttonText}>Español</Text>
        </TouchableOpacity>
        <Pressable onPress={() => router.push('/about')}>
          <Text style={{ color: '#ffffffff', fontWeight: '600' }}>Sobre o App</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 60 },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 18,
    fontFamily: 'Inter_700Bold',
  },
  button: {
    backgroundColor: 'rgba(94,23,235,0.75)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#5e17eb',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});
