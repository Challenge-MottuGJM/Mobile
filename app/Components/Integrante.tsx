import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";

type IntegranteProps = {
  nome: string;
  rm: string;
  sala: string;
  imgSrc: any;
  githubUrl: string;
  linkedinUrl: string;
};

export default function Integrante({
  nome,
  rm,
  sala,
  imgSrc,
  githubUrl,
  linkedinUrl,
}: IntegranteProps) {
  const abrirLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Erro ao abrir link:", err));
  };

  return (
    <View style={styles.card}>
      <Image source={imgSrc} style={styles.foto} />
      <Text style={styles.nome}>{nome}</Text>
      <Text style={styles.rm}>RM: {rm}</Text>
      <Text style={styles.sala}>{sala}</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => abrirLink(githubUrl)}>
          <Text style={styles.link}>Github</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => abrirLink(linkedinUrl)}>
          <Text style={styles.link}>LinkedIn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "black",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  foto: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'white',
    marginBottom: 4,
  },
  rm: {
    fontSize: 14,
    color: "#555",
  },
  sala: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 20,
  },
  link: {
    color: "#5e17eb",
    fontSize: 16,
    fontWeight: "500",
  },
});
