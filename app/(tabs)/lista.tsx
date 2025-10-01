import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';
import axios from 'axios';


const API_BASE_URL = "http://localhost:5148";

export default function Lista() {
  const [cadastros, setCadastros] = useState<any[]>([]);
  const isFocused = useIsFocused();
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;

  useEffect(() => { if (isFocused) carregarCadastros(); }, [isFocused]);

  const carregarCadastros = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/motos`);
    setCadastros(response.data);
  } catch (error) {
    console.log('Erro ao carregar cadastros', error);
  }
};

  const excluir = async (id: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/motos/deletar/${id}`);
    setCadastros(cadastros.filter((item) => item.id !== id));
  } catch (error) {
    console.log('Erro ao excluir', error);
  }
};


  const editar = (item: any) => {
    router.push({ pathname: '/editar', params: { ...item } });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.titulo}>{item.modelo} ({item.marca})</Text>
      <Text style={styles.body}>Status: {item.status}</Text>
      <Text style={styles.body}>Admissão: {item.admissao}</Text>
      <Text style={styles.body}>Placa: {item.placa}</Text>
      <Text style={styles.body}>Veículo: {item.veiculo}</Text>
      <Text style={styles.body}>Chassi: {item.chassi}</Text>

      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => editar(item)}>
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluir(item.id)}>
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Text style={[styles.tituloPagina, { color: isDark ? '#fff' : '#333' }]}>Veículos Cadastrados</Text>
        <FlatList
          data={cadastros}
          keyExtractor={(item: any) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={<Text style={[styles.vazio, styles.body]}>Nenhum veículo cadastrado.</Text>}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  tituloPagina: {
    fontSize: 23,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
  lista: { paddingBottom: 80 },
  item: { backgroundColor: '#ffffffcc', padding: 15, marginBottom: 15, borderRadius: 10 },
  titulo: { fontSize: 18, marginBottom: 5, fontFamily: 'Inter_700Bold' },
  body: { fontFamily: 'Inter_400Regular' },
  botoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  botaoEditar: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, flex: 1, marginRight: 10 },
  botaoExcluir: { backgroundColor: '#dc3545', padding: 10, borderRadius: 8, flex: 1 },
  textoBotao: { color: '#fff', textAlign: 'center', fontFamily: 'Inter_600SemiBold' },
  vazio: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#666' },
});
