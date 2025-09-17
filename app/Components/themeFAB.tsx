// Components/ThemeFAB.tsx
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../context/themeContext';

export default function ThemeFAB() {
  const { isDark, setPreference } = useTheme();
  const toggle = () => setPreference(isDark ? 'light' : 'dark');

  return (
    <TouchableOpacity
      accessibilityLabel="Alternar tema"
      onPress={toggle}
      style={[
        styles.fab,
        { backgroundColor: isDark ? '#1f1f1f' : '#f1f1f1' },
      ]}
    >
      <Ionicons
        name={isDark ? 'moon' : 'sunny'}
        size={22}
        color={isDark ? '#fff' : '#111'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 16,
    width: 44,
    top: 50,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.5,
  },
});
