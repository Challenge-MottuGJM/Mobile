import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';
import { useTranslation } from 'react-i18next';

export default function Tela() {
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <StatusBar style="light" />

      <Image
        source={require('../../assets/easyfinder.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/cadastro")}>
          <Text style={styles.buttonText}>{t('home.register')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/lista")}>
          <Text style={styles.buttonText}>{t('home.list')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/editar")}>
          <Text style={styles.buttonText}>{t('home.edit')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/vagas")}>
          <Text style={styles.buttonText}>{t('home.slots')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/integrantes")}>
          <Text style={styles.buttonText}>{t('home.devs')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  linksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    color: "#5e17eb",
  },
  button: {
    backgroundColor: "#5e17eb",
    paddingVertical: 10,
    borderColor: 'black',
    paddingHorizontal: 24,
    borderRadius: 50,
    elevation: 5,
    width: 190,
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 400,
    marginTop: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
