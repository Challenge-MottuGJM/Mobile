import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  return (
    <LinearGradient
      colors={['#ff5f96', '#ffe66d']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
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
          <Text style={styles.buttonText}>Cadastro</Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/lista")}>
          <Text style={styles.buttonText}>Lista</Text>
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
    color: "#5e17eb"
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
  },
});
