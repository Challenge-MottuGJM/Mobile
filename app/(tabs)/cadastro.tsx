import React, { useState, useEffect } from 'react';
import {
  View,Text,TextInput,Button,StyleSheet,Alert,ScrollView,TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const veiculos = [
  'Carro', 'Motocicleta'
];

function formatarData(text) {
  let digits = text.replace(/\D/g, '');
  if (digits.length > 8) digits = digits.substring(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.substring(0, 2) + '/' + digits.substring(2);
  return digits.substring(0, 2) + '/' + digits.substring(2, 4) + '/' + digits.substring(4);
}

export default function Cadastro() {
  const [status, setStatus] = useState('');
  const [admissao, setAdmissao] = useState('');
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [placa, setPlaca] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [chassi, setChassi] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);


  const [editando, setEditando] = useState(false);
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);


  const salvarVeiculo = async () => {
    if (!status || !admissao || !modelo || !marca || !placa || !veiculo || !chassi) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const cadastrosveiculosSalvos = await AsyncStorage.getItem('cadastrosveiculos');
      const cadastrosveiculos = cadastrosveiculosSalvos ? JSON.parse(cadastrosveiculosSalvos) : [];

      if (editando) {

        // Salvar novo veículo
        const novaMoto = {
          id: Date.now(),
          status,
          admissao,
          modelo,
          marca,
          placa,
          veiculo,
          chassi
        };
        cadastrosveiculos.push(novaMoto);
        await AsyncStorage.setItem('cadastrosveiculos', JSON.stringify(cadastrosveiculos));
        Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!');
      }

      limparCampos();

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o veículo.');
      console.error(error);
    }
  };

  const limparCampos = () => {
    setStatus('');
    setAdmissao('');
    setModelo('');
    setMarca('');
    setPlaca('');
    setVeiculo('');
    setChassi('');
    setShowManualInput(false);
  };


  return (
    <LinearGradient
          colors={['#ff5f96', '#ffe66d']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Cadastro de Veículos</Text>

          <TextInput
            style={styles.input}
            placeholder="Status"
            value={status}
            onChangeText={setStatus}
          />
          <TextInput
            style={styles.input}
            placeholder="Data de admissão do veículo (dd/mm/aaaa)"
            keyboardType="numeric"
            value={admissao}
            onChangeText={text => setAdmissao(formatarData(text))}
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
            placeholder="Placa (letras e números)"
            value={placa}
            onChangeText={setPlaca}
          />
          <TextInput
            style={styles.input}
            placeholder="Chassi"
            value={chassi}
            onChangeText={setChassi}
          />

          <Text style={styles.label}>Tipo de veículo</Text>
          <Picker
            selectedValue={veiculo}
            onValueChange={(itemValue) => setVeiculo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o tipo de veículo" value="" />
            {veiculos.map((tipo) => (
              <Picker.Item key={tipo} label={tipo} value={tipo} />
            ))}
          </Picker>

         
          <Button 
            title={editando ? "ATUALIZAR VEÍCULO" : "SALVAR VEÍCULO"} 
            onPress={salvarVeiculo} 
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
   gradient: {
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