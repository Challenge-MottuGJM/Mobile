import { Stack } from "expo-router";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import InfoCard from "../Components/InfoCard";

export default function InfosPage() {
  const informativeLinks = [
    {
      title: "O que é Racismo?",
      description:
        "Entenda o conceito de racismo, suas manifestações e impactos na sociedade brasileira.",
      url: "https://brasilescola.uol.com.br/o-que-e/o-que-e-sociologia/o-que-e-racismo.htm",
    },
    {
      title: "Racismo no Brasil: história, dados, consequências",
      description:
        "Saiba como o racismo se desenvolveu no Brasil e suas consequências atuais.",
      url: "https://mundoeducacao.uol.com.br/sociologia/racismo-no-brasil.htm",
    },
    {
      title: "O que é violência doméstica",
      description:
        "Informações sobre o que caracteriza a violência doméstica e como identificá-la.",
      url: "https://www.institutomariadapenha.org.br/violencia-domestica/o-que-e-violencia-domestica.html",
    },
    {
      title:
        "Cartilha: Enfrentando a violência doméstica e familiar contra a mulher",
      description:
        "Cartilha com informações sobre os tipos de violência, leis de proteção e rede de atendimento.",
      url: "https://www.gov.br/mdh/pt-br/assuntos/noticias/2020-2/maio/cartilha-auxilia-mulheres-no-enfrentamento-a-violencia/Cartilhaenfrentamento_QRCODE1.pdf",
    },
    {
      title:
        "A LGBTfobia no Brasil: os números, a violência e a criminalização",
      description:
        "Entenda o panorama da LGBTfobia no Brasil, incluindo dados e informações sobre a criminalização.",
      url: "https://www.fundobrasil.org.br/blog/a-lgbtfobia-no-brasil-os-numeros-a-violencia-e-a-criminalizacao/",
    },
    {
      title: "Brasil Sem Homofobia - Ministério da Saúde",
      description:
        "Programa de combate à violência e à discriminação contra GLTB e promoção da cidadania homossexual.",
      url: "https://bvsms.saude.gov.br/bvs/publicacoes/brasil_sem_homofobia.pdf",
    },
  ];

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Não foi possível abrir o link", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Informações",
        }}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Informações</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conteúdo Informativo</Text>

        {informativeLinks.map((link, index) => (
          <InfoCard
            key={index}
            title={link.title}
            description={link.description}
            onPress={() => openLink(link.url)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBD7D7",
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: "center",
  },
  banner: {
    width: '100%',
    height: 150,
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: 'italic',
    color: "#0033CC",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },

  phoneButton: {
    backgroundColor: "#00AA00",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  infoButton: {
    backgroundColor: "#0066CC",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
});
