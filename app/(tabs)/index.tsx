import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <StatusBar style="light" />

      <Image
        source={require('./assets/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />*/

      <ScrollView contentContainerStyle={styles.linksContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/denuncia")}>
          <Text style={styles.buttonText}>Denúncia</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/apoio")}>
          <Text style={styles.buttonText}>Apoio e Ajuda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/dados")}>
          <Text style={styles.buttonText}>Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/info")}>
          <Text style={styles.buttonText}>Informações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/integrantes")}>
          <Text style={styles.buttonText}>Desenvolvedores</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBD7D7',
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
  },
  button: {
    backgroundColor: '#0A3CFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    width: 250,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 150,
    marginTop: 70,
    marginBottom: 100,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});