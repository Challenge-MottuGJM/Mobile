import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import Integrante from "../Components/Integrante";

export default function IntegrantesPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: "Integrantes",
        }}
      />
      <Text style={styles.title}>Desenvolvedores</Text>

      <Integrante
        nome="Julio Cesar"
        rm="557298"
        sala="2TDSPF"
        imgSrc={require("../../assets/julio.png")}
        githubUrl="https://github.com/Julio-CRodrigues"
        linkedinUrl="https://www.linkedin.com/in/julio-cesar-rodrigues29/"
      />

      <Integrante
        nome="Gustavo de Aguiar"
        rm="557707"
        sala="2TDSPF"
        imgSrc={require("../../assets/gu.png")}
        githubUrl="https://github.com/gudeaguiar"
        linkedinUrl="https://www.linkedin.com/in/gustavo-de-aguiar-sn160308/"
      />

      <Integrante
        nome="Matheus de Freitas Silva"
        rm="552602"
        sala="2TDSPF"
        imgSrc={require("../../assets/matheus.png")}
        githubUrl="https://github.com/MatheusFreitasSilva"
        linkedinUrl="https://www.linkedin.com/in/matheus-freitas-9110a51b2/"
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#DBD7D7",
  },
  title: {
    fontSize: 24,
    color: '#0A3CFF',
    fontStyle: 'italic',
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 24,
    marginTop: 30,
  },
});
