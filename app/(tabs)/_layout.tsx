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
          tabBarStyle: { backgroundColor: tabBg, borderTopColor: border },
          tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="lista"
          options={{
            title: 'Lista',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="list" color={color} />,
          }}
        />
        <Tabs.Screen
          name="vagas"
          options={{
            title: 'Vagas',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="bicycle-outline" color={color} />,
          }}
        />

        <Tabs.Screen
          name="login"
          options={{
            title: 'Login',
            tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={28} color={color} />,
          }}
        />

        <Tabs.Screen name="cadastro" options={{ href: null }} />
        <Tabs.Screen name="editar" options={{ href: null }} />
        <Tabs.Screen name="integrantes" options={{ href: null }} />
        <Tabs.Screen name="signup" options={{ href: null, headerShown: false }} />

      </Tabs>

      <ThemeFAB />
    </ThemedBackground>
  );
}