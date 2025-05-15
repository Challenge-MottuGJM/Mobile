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
        imgSrc={require("../../assets/julio.jpg")}
        githubUrl="https://github.com/Julio-CRodrigues"
        linkedinUrl="https://www.linkedin.com/in/julio-cesar-rodrigues29/"
      />

      <Integrante
        nome="Gustavo de Aguiar"
        rm="557707"
        sala="2TDSPF"
        imgSrc={require("../../assets/gustavo.jpg")}
        githubUrl="https://github.com/gudeaguiar"
        linkedinUrl="https://www.linkedin.com/in/gustavo-de-aguiar-sn160308/"
      />

      <Integrante
        nome="Erik Paschoalatto"
        rm="554854"
        sala="2TDSPF"
        imgSrc={require("../../assets/erik.jpg")}
        githubUrl="https://github.com/ozerikoz"
        linkedinUrl="https://www.linkedin.com/in/erikpaschoalatto/"
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
