import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../../context/themeContext";
import { LIGHT_BG, DARK_BG } from "../../theme/gradients";

export default function Editar() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;

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
        const item = lista.find((v: any) => String(v.id) === String(params.id));
        if (item) {
          setStatus(item.status);
          setAdmissao(item.admissao);
          setModelo(item.modelo);
          setMarca(item.marca);
          setPlaca(item.placa);
          setVeiculo(item.veiculo);
          setChassi(item.chassi);
        }
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar os dados do veículo.');
      }
    };
    carregarDados();
  }, [params.id]);

  const salvarEdicao = async () => {
    if (!params.id) return Alert.alert('Erro', 'ID do veículo não encontrado.');
    const novosDados = { id: params.id, status, admissao, modelo, marca, placa, veiculo, chassi };
    try {
      const armazenados = await AsyncStorage.getItem('cadastrosveiculos');
      const lista = armazenados ? JSON.parse(armazenados) : [];
      const index = lista.findIndex((item: any) => String(item.id) === String(params.id));
      if (index !== -1) {
        lista[index] = novosDados;
        await AsyncStorage.setItem('cadastrosveiculos', JSON.stringify(lista));
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
        router.replace('/lista');
      } else {
        Alert.alert('Erro', 'Veículo não encontrado.');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.titulo, { color: isDark ? '#fff' : '#333' }]}>Editar Veículo</Text>

        <TextInput style={styles.input} placeholder="Status (tipo de problema)" value={status} onChangeText={setStatus} />
        <TextInput style={styles.input} placeholder="Data de admissão" keyboardType="numeric" value={admissao} onChangeText={setAdmissao} />
        <TextInput style={styles.input} placeholder="Modelo" value={modelo} onChangeText={setModelo} />
        <TextInput style={styles.input} placeholder="Marca" value={marca} onChangeText={setMarca} />
        <TextInput style={styles.input} placeholder="Placa" value={placa} onChangeText={setPlaca} />
        <TextInput style={styles.input} placeholder="Veículo" value={veiculo} onChangeText={setVeiculo} />
        <TextInput style={styles.input} placeholder="Chassi" value={chassi} onChangeText={setChassi} />

        <TouchableOpacity style={styles.botao} onPress={salvarEdicao}>
          <Text style={styles.textoBotao}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, marginTop: 40 },
  titulo: {
    fontSize: 23,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Inter_700Bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    fontFamily: 'Inter_400Regular',
  },
  botao: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
