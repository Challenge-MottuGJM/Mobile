import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';


export default function Tela() {
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <StatusBar style="light" />

      <Image
        source={require('../../assets/easyfinder.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/cadastro")}>
          <Text style={styles.buttonText}>Cadastrar veículos</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/lista")}>
          <Text style={styles.buttonText}>Lista de veículos</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/editar")}>
          <Text style={styles.buttonText}>Editar veículos</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/vagas")}>
          <Text style={styles.buttonText}>Vagas</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/integrantes")}>
          <Text style={styles.buttonText}>Desenvolvedores</Text>
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
    paddingVertical: 12,
    borderColor: 'black',
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 5,
    width: 200,
    alignItems: 'center',
  },
  logo: {
    width: 380,
    height: 500,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
