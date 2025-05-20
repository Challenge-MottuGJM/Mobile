import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Lista() {
  const [cadastros, setCadastros] = useState([]);
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    if (isFocused) {
      carregarCadastros();
    }
  }, [isFocused]);

  const carregarCadastros = async () => {
    try {
      const dados = await AsyncStorage.getItem('cadastrosveiculos');
      if (dados) {
        setCadastros(JSON.parse(dados));
      }
    } catch (error) {
      console.log('Erro ao carregar cadastros', error);
    }
  };

  const excluir = async (id) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir este veículo?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const novaLista = cadastros.filter((item) => item.id !== id);
          await AsyncStorage.setItem('cadastrosveiculos', JSON.stringify(novaLista));
          setCadastros(novaLista);
        },
      },
    ]);
  };

  const editar = (item) => {
    router.push({
      pathname: '/editar',
      params: { ...item },
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.titulo}>{item.modelo} ({item.marca})</Text>
      <Text>Status: {item.status}</Text>
      <Text>Admissão: {item.admissao}</Text>
      <Text>Placa: {item.placa}</Text>
      <Text>Veículo: {item.veiculo}</Text>
      <Text>Chassi: {item.chassi}</Text>

      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => editar(item)}
        >
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => excluir(item.id)}
        >
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#ff5f96', '#ffe66d']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <FlatList
        data={cadastros}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum veículo cadastrado.</Text>}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  lista: {
    padding: 20,
    paddingBottom: 80,
  },
  item: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoEditar: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  botaoExcluir: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vazio: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});
