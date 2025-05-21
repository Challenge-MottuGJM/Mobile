import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type Vaga = {
  id: string;
  setor: string;
  ocupada: boolean;
};

const TOTAL_VAGAS = 54;
const TOTAL_COLUNAS = 5;

const setores = ['Análise', 'Problemas mecânicos', 'Problemas externos'];

const Estacionamento = () => {
  const [vagasPorSetor, setVagasPorSetor] = useState<Record<string, Vaga[][]>>({});

  useEffect(() => {
    const inicializarVagas = () => {
      let todasVagas: Vaga[] = [];

      for (let i = 0; i < TOTAL_VAGAS; i++) {
        const setorIndex = Math.floor(i / 18); // 18 vagas por setor
        todasVagas.push({
          id: `V${i + 1}`,
          setor: setores[setorIndex],
          ocupada: false,
        });
      }

      // Ocupa 3 vagas aleatórias por setor
      setores.forEach((setor) => {
        const indicesSetor = todasVagas
          .map((vaga, i) => (vaga.setor === setor ? i : -1))
          .filter((i) => i !== -1);

        const ocupadas = indicesSetor
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        ocupadas.forEach((i) => {
          todasVagas[i].ocupada = true;
        });
      });

      const organizadas: Record<string, Vaga[][]> = {};

      setores.forEach((setor) => {
        const vagasSetor = todasVagas.filter((vaga) => vaga.setor === setor);
        const linhas = Array.from({ length: vagasSetor.length / TOTAL_COLUNAS }, (_, row) =>
          vagasSetor.slice(row * TOTAL_COLUNAS, (row + 1) * TOTAL_COLUNAS)
        );
        organizadas[setor] = linhas;
      });

      setVagasPorSetor(organizadas);
    };

    inicializarVagas();
  }, []);

  return (
    <LinearGradient
      colors={['#ff5f96', '#ffe66d']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
         <Text style={styles.title}>Vagas</Text>
        {setores.map((setor) => (
          <BlurView intensity={50} tint="light" style={styles.card} key={setor}>
            <Text style={styles.setorTitulo}>{setor}</Text>
            {vagasPorSetor[setor]?.map((linha, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                {linha.map((vaga) => (
                  <TouchableOpacity
                    key={vaga.id}
                    style={[
                      styles.vaga,
                      { backgroundColor: vaga.ocupada ? '#ff4d4d' : '#66cc66' },
                    ]}
                  >
                    <Text style={styles.text}>
                      {vaga.ocupada ? 'Ocupado' : vaga.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </BlurView>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 32,
  },
  container: {
    padding: 16,
    paddingBottom: 64,
  },
  title: {
    fontSize: 23,
    color: "#333",
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 24,
    marginTop: 30,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  setorTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  vaga: {
    width: 60,
    height: 60,
    margin: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
});

export default Estacionamento;
