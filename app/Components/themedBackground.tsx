// Components/ThemedBackground.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';

export default function ThemedBackground({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  return (
    <>
      <LinearGradient
        colors={isDark ? DARK_BG : LIGHT_BG}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </>
  );
}
