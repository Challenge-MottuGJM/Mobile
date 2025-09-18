import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';
import ThemeFAB from '../Components/themeFAB';
import { useTheme } from '../../context/themeContext';
import ThemedBackground from '../Components/themedBackground';

export default function TabLayout() {
  const { isDark } = useTheme();

  const active = '#ff5f96';
  const inactive = isDark ? '#B0B0B0' : '#606060';
  const border = isDark ? '#272727' : '#E6E6E6';
  const tabBg = isDark ? '#000000' : '#ffffff';

  return (
    <ThemedBackground>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: active,
          tabBarInactiveTintColor: inactive,
          tabBarStyle: {
            backgroundColor: tabBg,
            borderTopColor: border,
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => (<Ionicons size={28} name="home" color={color} />) }} />
        <Tabs.Screen name="cadastro" options={{ title: 'Cadastro', tabBarIcon: ({ color }) => (<Ionicons size={28} name="people" color={color} />) }} />
        <Tabs.Screen name="lista" options={{ title: 'Lista', tabBarIcon: ({ color }) => (<Ionicons size={28} name="list" color={color} />) }} />
        <Tabs.Screen name="editar" options={{ title: 'Editar', tabBarIcon: ({ color }) => (<Feather name="edit" size={24} color={color} />) }} />
        <Tabs.Screen name="vagas" options={{ title: 'Vagas', tabBarIcon: ({ color }) => (<Ionicons size={28} name="bicycle-outline" color={color} />) }} />
        <Tabs.Screen name="integrantes" options={{ title: 'Devs', tabBarIcon: ({ color }) => (<Ionicons size={28} name="desktop" color={color} />) }} />
      </Tabs>
      <ThemeFAB />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});