import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LineChart } from "react-native-chart-kit";

// Tipo para os dados de homicídios
type DadoHomicidio = {
  cod: string;
  sigla: string;
  valor: string;
  periodo: string;
};

const DadosPage = () => {
  // Estados para dados e UI
  const [dadosHomicidios, setDadosHomicidios] = useState<DadoHomicidio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  const larguraTela = Dimensions.get("window").width;
  // Aumentando a margem para garantir que o gráfico seja completamente visível
  const larguraEfetivaGrafico = larguraTela - 70; // Margem maior para acomodar rótulos do eixo Y

  // Função para buscar dados da API do IPEA
  const buscarDadosHomicidios = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch(
        "https://ipea.gov.br/atlasviolencia/api/v1/valores-series-por-regioes/328/1/bra"
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const dados: DadoHomicidio[] = await response.json();

      // Ordena os dados por período (data)
      const dadosOrdenados = dados.sort(
        (a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime()
      );

      setDadosHomicidios(dadosOrdenados);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setErro(
        "Não foi possível carregar os dados. Por favor, tente novamente."
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  // Função para atualizar dados (pull-to-refresh)
  const onRefresh = () => {
    setAtualizando(true);
    buscarDadosHomicidios();
  };

  // Carrega dados na montagem do componente
  useEffect(() => {
    buscarDadosHomicidios();
  }, []);

  // Preparar dados para o gráfico de linha
  const prepararDadosGrafico = () => {
    if (!dadosHomicidios || dadosHomicidios.length === 0) return null;

    // Extrair apenas o ano da data para o eixo X
    const labels = dadosHomicidios.map((item) => {
      const data = new Date(item.periodo);
      return data.getFullYear().toString();
    });

    // Se temos muitos anos, mostrar apenas alguns para evitar sobreposição
    const labelsReduzidos = labels.filter((_, index) => index % 3 === 0);

    // Preparar dados para o gráfico
    return {
      labels: labelsReduzidos,
      datasets: [
        {
          data: dadosHomicidios.map((item) => parseInt(item.valor)),
          color: (opacity = 1) => `rgba(81, 133, 242, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ["Homicídios no Brasil (1989-2022)"],
    };
  };

  // Configuração para o gráfico de linha
  const configuracaoGrafico = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(81, 133, 242, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#5185f2",
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      strokeDasharray: "6, 6",
      stroke: "#ebebeb",
    },
    formatYLabel: (value: string) => {
      // Abreviando valores grandes para economizar espaço
      const num = Number(value);
      if (num >= 10000) {
        return (num / 1000).toFixed(0) + "k";
      }
      return num.toLocaleString();
    },
    propsForLabels: {
      fontSize: "9",
      fontWeight: "bold",
    },
    yAxisInterval: 1,
    yAxisSuffix: "",
    fromZero: true,
  };

  // Renderiza a tela de carregamento
  if (carregando) {
    return (
      <View style={styles.containerCentralizado}>
        <Stack.Screen
          options={{
            title: "Dados",
          }}
        />
        <ActivityIndicator size="large" color="#5185f2" />
        <Text style={styles.textoCarregando}>Carregando dados...</Text>
      </View>
    );
  }

  // Renderiza mensagem de erro
  if (erro) {
    return (
      <View style={styles.containerCentralizado}>
        <Stack.Screen
          options={{
            title: "Dados",
          }}
        />
        <Text style={styles.textoErro}>{erro}</Text>
        <TouchableOpacity
          style={styles.botaoTentarNovamente}
          onPress={buscarDadosHomicidios}
        >
          <Text style={styles.textoBotao}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Dados do gráfico
  const dadosGrafico = prepararDadosGrafico();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Dados",
        }}
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.titulo}>Homicídios no Brasil</Text>
        <Text style={styles.descricao}>
          Evolução histórica do número de homicídios no Brasil entre 1989 e
          2022. Dados do Instituto de Pesquisa Econômica Aplicada (IPEA).
        </Text>

        {/* Gráfico de linha para dados de homicídios */}
        <View style={styles.cartao}>
          <Text style={styles.subTitulo}>Evolução Temporal</Text>
          <Text style={styles.descricaoGrafico}>
            O gráfico mostra a variação do número total de homicídios
            registrados anualmente.
          </Text>
          {dadosGrafico ? (
            <LineChart
              data={dadosGrafico}
              width={larguraEfetivaGrafico}
              height={230}
              chartConfig={configuracaoGrafico}
              bezier
              style={styles.grafico}
              verticalLabelRotation={0}
              horizontalLabelRotation={-45}
              yAxisInterval={1}
              withInnerLines={true}
              segments={5}
            />
          ) : (
            <Text style={styles.semDados}>
              Não há dados disponíveis para exibição.
            </Text>
          )}
        </View>

        {/* Estatísticas gerais */}
        <View style={styles.cartao}>
          <Text style={styles.subTitulo}>Estatísticas Gerais</Text>
          {dadosHomicidios.length > 0 ? (
            <View style={styles.estatisticasContainer}>
              <View style={styles.estatisticaItem}>
                <Text style={styles.estatisticaValor}>
                  {Math.max(
                    ...dadosHomicidios.map((d) => parseInt(d.valor))
                  ).toLocaleString()}
                </Text>
                <Text style={styles.estatisticaLabel}>Máximo</Text>
              </View>
              <View style={styles.estatisticaItem}>
                <Text style={styles.estatisticaValor}>
                  {Math.min(
                    ...dadosHomicidios.map((d) => parseInt(d.valor))
                  ).toLocaleString()}
                </Text>
                <Text style={styles.estatisticaLabel}>Mínimo</Text>
              </View>
              <View style={styles.estatisticaItem}>
                <Text style={styles.estatisticaValor}>
                  {Math.round(
                    dadosHomicidios.reduce(
                      (acc, cur) => acc + parseInt(cur.valor),
                      0
                    ) / dadosHomicidios.length
                  ).toLocaleString()}
                </Text>
                <Text style={styles.estatisticaLabel}>Média</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.semDados}>
              Não há dados estatísticos disponíveis.
            </Text>
          )}
        </View>

        {/* Informações de fonte e contexto */}
        <View style={styles.cartao}>
          <Text style={styles.subTitulo}>Sobre os Dados</Text>
          <Text style={styles.descricaoGrafico}>
            Os dados apresentados são coletados pelo Instituto de Pesquisa
            Econômica Aplicada (IPEA) e representam o número total de homicídios
            registrados oficialmente no Brasil.
          </Text>
          <Text style={styles.descricaoGrafico}>
            Estes dados são importantes para compreender a evolução da violência
            no país e orientar políticas públicas de segurança.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBD7D7",
    paddingTop: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  containerCentralizado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    fontStyle: 'italic',
    marginBottom: 12,
    marginTop: 8,
    color: "#0A3CFF",
    textAlign: "center",
  },
  subTitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  descricao: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  descricaoGrafico: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  cartao: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  grafico: {
    marginVertical: 16,
    borderRadius: 12,
    alignSelf: "center",
  },
  textoCarregando: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  textoErro: {
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 16,
    textAlign: "center",
  },
  botaoTentarNovamente: {
    backgroundColor: "#5185f2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
  },
  semDados: {
    textAlign: "center",
    color: "#666",
    padding: 20,
    fontStyle: "italic",
  },
  estatisticasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  estatisticaItem: {
    alignItems: "center",
  },
  estatisticaValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5185f2",
  },
  estatisticaLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
});

export default DadosPage;
