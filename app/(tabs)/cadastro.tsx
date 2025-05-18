import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT',
  'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO',
  'RR', 'SC', 'SP', 'SE', 'TO'
];

// Função para formatar datas no formato dd/mm/aaaa com barras automáticas
function formatarData(text) {
  let digits = text.replace(/\D/g, '');
  if (digits.length > 8) digits = digits.substring(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.substring(0, 2) + '/' + digits.substring(2);
  return digits.substring(0, 2) + '/' + digits.substring(2, 4) + '/' + digits.substring(4);
}

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [fabricacao, setFabricacao] = useState('');
  const [validade, setValidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [lote, setLote] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  // Estados para edição
  const [editando, setEditando] = useState(false);
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);


  // Função para carregar um produto para editar
  const carregarProdutoParaEditar = async (id) => {
    try {
      const produtosSalvos = await AsyncStorage.getItem('produtos');
      const produtos = produtosSalvos ? JSON.parse(produtosSalvos) : [];
      const produto = produtos.find(p => p.id === id);
      if (produto) {
        setNome(produto.nome);
        setFabricacao(produto.fabricacao);
        setValidade(produto.validade);
        setQuantidade(produto.quantidade);
        setLote(produto.lote);
        setEstado(produto.estado);
        setCodigoBarras(produto.codigoBarras);
        setEditando(true);
        setProdutoEditandoId(id);
      } else {
        Alert.alert('Erro', 'Produto não encontrado para edição.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const salvarProduto = async () => {
    if (!nome || !fabricacao || !validade || !quantidade || !lote || !estado || !codigoBarras) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const produtosSalvos = await AsyncStorage.getItem('produtos');
      const produtos = produtosSalvos ? JSON.parse(produtosSalvos) : [];

      if (editando) {
        // Atualizar produto existente
        const index = produtos.findIndex(p => p.id === produtoEditandoId);
        if (index !== -1) {
          produtos[index] = {
            id: produtoEditandoId,
            nome,
            fabricacao,
            validade,
            quantidade,
            lote,
            estado,
            codigoBarras
          };
          await AsyncStorage.setItem('produtos', JSON.stringify(produtos));
          Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
        } else {
          Alert.alert('Erro', 'Produto para edição não encontrado.');
        }
      } else {
        // Salvar novo produto
        const novoProduto = {
          id: Date.now(),
          nome,
          fabricacao,
          validade,
          quantidade,
          lote,
          estado,
          codigoBarras
        };
        produtos.push(novoProduto);
        await AsyncStorage.setItem('produtos', JSON.stringify(produtos));
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      }

      limparCampos();
      setEditando(false);
      setProdutoEditandoId(null);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
      console.error(error);
    }
  };

  const limparCampos = () => {
    setNome('');
    setFabricacao('');
    setValidade('');
    setQuantidade('');
    setLote('');
    setEstado('');
    setCodigoBarras('');
    setScannerAtivo(false);
    setShowManualInput(false);
  };


  return (
    <LinearGradient
      colors={['#2951ff', '#ff5959']}
      style={StyleSheet.absoluteFill}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Cadastro de Produto</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do Produto"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Data de Fabricação (dd/mm/aaaa)"
            keyboardType="numeric"
            value={fabricacao}
            onChangeText={text => setFabricacao(formatarData(text))}
          />
          <TextInput
            style={styles.input}
            placeholder="Prazo de Validade (dd/mm/aaaa)"
            keyboardType="numeric"
            value={validade}
            onChangeText={text => setValidade(formatarData(text))}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          <TextInput
            style={styles.input}
            placeholder="Lote (letras e números)"
            value={lote}
            onChangeText={setLote}
          />

          <Text style={styles.label}>Estado de Origem</Text>
          <Picker
            selectedValue={estado}
            onValueChange={(itemValue) => setEstado(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um estado" value="" />
            {estados.map((uf) => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>

         
          <Button 
            title={editando ? "ATUALIZAR PRODUTO" : "SALVAR PRODUTO"} 
            onPress={salvarProduto} 
            color="#28a745" 
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 40,
    flex: 1,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'black',
    color: '',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10
  },
  picker: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    marginBottom: 12
  },
  codigo: {
    padding: 10,
    backgroundColor: '#eee',
    textAlign: 'center',
    marginBottom: 12
  },
  botoesLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12
  },
  botaoScanner: {
    flex: 1,
    backgroundColor: '#2951ff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  botaoManual: {
    flex: 1,
    backgroundColor: '#2951ff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold'
  },
  scannerContainer: {
    height: 400,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 10
  },
  cancelarBotao: {
    backgroundColor: 'red',
    padding: 10,
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    borderRadius: 6
  }
});