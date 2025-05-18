import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    try {
      const cadastrosveiculosSalvos = await AsyncStorage.getItem('veiculos');
      if (cadastrosveiculosSalvos !== null) {
        setVeiculos(JSON.parse(cadastrosveiculosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar os veículos:', error);
    }
  };

  const excluirVeiculo = async (id) => {
    Alert.alert('Confirmar exclusão', 'Deseja excluir este veículo?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: async () => {
          const novaLista = veiculos.filter((item) => item.id !== id);
          setVeiculos(novaLista);
          await AsyncStorage.setItem('veiculos', JSON.stringify(novaLista));
        },
        style: 'destructive',
      },
    ]);
  };

  const editarVeiculo = (veiculo) => {
    router.push({
      pathname: '/cadastro',
      params: { veiculo: JSON.stringify(veiculo) }
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Nome: {item.nome}</Text>
      <Text style={styles.itemText}>Fabricação: {item.fabricacao}</Text>
      <Text style={styles.itemText}>Validade: {item.validade}</Text>
      <Text style={styles.itemText}>Quantidade: {item.quantidade}</Text>
      <Text style={styles.itemText}>Lote: {item.lote}</Text>
      <Text style={styles.itemText}>Estado: {item.estado}</Text>
      <Text style={styles.itemText}>Código de Barras: {item.codigoBarras}</Text>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => editarVeiculo(item)}>
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirVeiculo(item.id)}>
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
          style={styles.container}
        >
      <Text style={styles.title}>Lista de Veículos salvos</Text>
      <FlatList
        data={veiculos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum veículo cadastrado.</Text>}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  itemContainer: {
    backgroundColor: '#ffffffcc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#000',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoEditar: {
    backgroundColor: '#2951ff',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
  },
  botaoExcluir: {
    backgroundColor: '#ff0a0a',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 8,
  },
  textoBotao: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
});