import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

type Moto = {
  id: string;
  modelo: string;
  placa: string;
};

type Vaga = {
  id: string;
  moto?: Moto;
};

const TOTAL_LINHAS = 9;
const TOTAL_COLUNAS = 6;

const Estacionamento = () => {
  const [vagas, setVagas] = useState<Vaga[][]>([]);

  useEffect(() => {
    const carregarVagas = async () => {
      const dados = await AsyncStorage.getItem('motos');
      const motos: Moto[] = dados ? JSON.parse(dados) : [];

      let todasVagas: Vaga[] = Array.from({ length: TOTAL_LINHAS * TOTAL_COLUNAS }, (_, i) => ({
        id: `V${i + 1}`,
      }));

      const indicesAleatorios = [...todasVagas.keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, motos.length);

      indicesAleatorios.forEach((idx, i) => {
        todasVagas[idx].moto = motos[i];
      });

      const matriz = Array.from({ length: TOTAL_LINHAS }, (_, row) =>
        todasVagas.slice(row * TOTAL_COLUNAS, (row + 1) * TOTAL_COLUNAS)
      );

      setVagas(matriz);
    };

    carregarVagas();
  }, []);

  return (
    <LinearGradient
      colors={['#000', '#242424']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {vagas.map((linha, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {linha.map((vaga) => (
              <TouchableOpacity
                key={vaga.id}
                style={[
                  styles.vaga,
                  { backgroundColor: vaga.moto ? '#ff6666' : '#66cc66' },
                ]}
              >
                <Text style={styles.text}>
                  {vaga.moto ? vaga.moto.modelo : 'Livre'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  vaga: {
    width: 50,
    height: 50,
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
