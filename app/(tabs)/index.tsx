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
  title: {
    fontSize: 26,
    color: '#0A3CFF',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  linksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    color: "#5e17eb"
  },
  button: {
    backgroundColor: "#5e17eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    width: 250,
    alignItems: 'center',
  },
  logo: {
    width: 1800,
    height: 550,
    marginTop: 70,
    marginBottom: 80,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
