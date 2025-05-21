import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Editar() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [status, setStatus] = useState('');
  const [admissao, setAdmissao] = useState('');
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [placa, setPlaca] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [chassi, setChassi] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      if (!params.id) return;

      try {
        const armazenados = await AsyncStorage.getItem('cadastrosveiculos');
        const lista = armazenados ? JSON.parse(armazenados) : [];

        const item = lista.find((v: any) => v.id === params.id);
        if (item) {
          setStatus(item.status);
          setAdmissao(item.admissao);
          setModelo(item.modelo);
          setMarca(item.marca);
          setPlaca(item.placa);
          setVeiculo(item.veiculo);
          setChassi(item.chassi);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do veículo.');
      }
    };

    carregarDados();
  }, [params.id]);

  const salvarEdicao = async () => {
    if (!params.id) {
      Alert.alert('Erro', 'ID do veículo não encontrado.');
      return;
    }

    const novosDados = {
      id: params.id,
      status,
      admissao,
      modelo,
      marca,
      placa,
      veiculo,
      chassi,
    };

    try {
      const armazenados = await AsyncStorage.getItem('cadastrosveiculos');
      let lista = armazenados ? JSON.parse(armazenados) : [];

      const index = lista.findIndex((item: any) => item.id === params.id);
      if (index !== -1) {
        lista[index] = novosDados;
        await AsyncStorage.setItem('cadastrosveiculos', JSON.stringify(lista));
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
        router.replace('/lista');
      } else {
        Alert.alert('Erro', 'Veículo não encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
      <LinearGradient
              colors={['#ff5f96', '#ffe66d']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
      >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Editar Veículo</Text>

        <TextInput
          style={styles.input}
          placeholder="Status (tipo de problema)"
          value={status}
          onChangeText={setStatus}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de admissão"
          keyboardType="numeric"
          value={admissao}
          onChangeText={setAdmissao}
        />
        <TextInput
          style={styles.input}
          placeholder="Modelo"
          value={modelo}
          onChangeText={setModelo}
        />
        <TextInput
          style={styles.input}
          placeholder="Marca"
          value={marca}
          onChangeText={setMarca}
        />
        <TextInput
          style={styles.input}
          placeholder="Placa"
          value={placa}
          onChangeText={setPlaca}
        />
        <TextInput
          style={styles.input}
          placeholder="Veículo"
          value={veiculo}
          onChangeText={setVeiculo}
        />
        <TextInput
          style={styles.input}
          placeholder="Chassi"
          value={chassi}
          onChangeText={setChassi}
        />

        <TouchableOpacity style={styles.botao} onPress={salvarEdicao}>
          <Text style={styles.textoBotao}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    marginTop: 40,
  },
  titulo: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  botao: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
