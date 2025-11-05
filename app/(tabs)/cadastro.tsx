import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from "../../context/themeContext";
import { LIGHT_BG, DARK_BG } from "../../theme/gradients";
import { useTranslation } from 'react-i18next';

type CadastroVeiculo = {
  id: number;
  status: string;
  admissao: string;
  modelo: string;
  marca: string;
  placa: string;
  veiculo: string;
  chassi: string;
};

//quando coloar a api, coloca post/put
//await Notifications.scheduleNotificationAsync({
  //content: { title: 'EasyFinder', body: 'Você salvou sua moto!' },
  //trigger: null, // dispara imediatamente
//});

const veiculos = ['Carro', 'Motocicleta'];

function formatarData(text: string) {
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

  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;
  const { t } = useTranslation();

  const [editando, setEditando] = useState(false);
  const [produtoEditandoId, setProdutoEditandoId] = useState<number | null>(null);

  const salvarVeiculo = async () => {
    if (!status || !admissao || !modelo || !marca || !placa || !veiculo || !chassi) {
      Alert.alert(t('common.error'), t('cadastro.fillAll'));
      return;
    }

    try {
      const cadastrosveiculosSalvos = await AsyncStorage.getItem('cadastrosveiculos');
      let cadastrosveiculos: CadastroVeiculo[] = cadastrosveiculosSalvos
        ? (JSON.parse(cadastrosveiculosSalvos) as CadastroVeiculo[])
        : [];

      if (editando && produtoEditandoId !== null) {
        cadastrosveiculos = cadastrosveiculos.map((item: CadastroVeiculo) =>
          item.id === produtoEditandoId
            ? { ...item, status, admissao, modelo, marca, placa, veiculo, chassi }
            : item
        );
      } else {
        const novoVeiculo: CadastroVeiculo = {
          id: Date.now(),
          status,
          admissao,
          modelo,
          marca,
          placa,
          veiculo,
          chassi,
        };
        cadastrosveiculos.push(novoVeiculo);
      }

      await AsyncStorage.setItem('cadastrosveiculos', JSON.stringify(cadastrosveiculos));
      Alert.alert(
        t('common.success'),
        editando ? t('cadastro.updated') : t('cadastro.saved')
      );
      limparCampos();
      setEditando(false);
      setProdutoEditandoId(null);
    } catch (error) {
      Alert.alert(t('common.error'), t('cadastro.saveError'));
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
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
            {t('cadastro.title')}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('cadastro.statusPlaceholder')}
            value={status}
            onChangeText={setStatus}
          />
          <TextInput
            style={styles.input}
            placeholder={t('cadastro.datePlaceholder')}
            keyboardType="numeric"
            value={admissao}
            onChangeText={text => setAdmissao(formatarData(text))}
          />
          <TextInput
            style={styles.input}
            placeholder={t('cadastro.model')}
            value={modelo}
            onChangeText={setModelo}
          />
          <TextInput
            style={styles.input}
            placeholder={t('cadastro.brand')}
            value={marca}
            onChangeText={setMarca}
          />
          <TextInput
            style={styles.input}
            placeholder={t('cadastro.plate')}
            value={placa}
            onChangeText={setPlaca}
          />
          <TextInput
            style={styles.input}
            placeholder={t('cadastro.chassis')}
            value={chassi}
            onChangeText={setChassi}
          />

          <Text style={styles.label}>{t('cadastro.vehicleType')}</Text>
          <Picker
            selectedValue={veiculo}
            onValueChange={(itemValue) => setVeiculo(itemValue)}
            style={styles.picker}
            itemStyle={Platform.OS === 'ios' ? { fontFamily: 'Inter_400Regular' } : undefined}
          >
            <Picker.Item label={t('cadastro.vehicleTypePlaceholder')} value="" />
            {veiculos.map((tipo) => (
              <Picker.Item key={tipo} label={tipo} value={tipo} />
            ))}
          </Picker>

          <TouchableOpacity style={styles.btnSalvar} onPress={salvarVeiculo} activeOpacity={0.85}>
            <Text style={styles.textoBotao}>
              {editando ? t('cadastro.updateBtn') : t('cadastro.saveBtn')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, marginTop: 40, flex: 1 },
  gradient: { flex: 1 },
  title: {
    fontSize: 23,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
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
  label: { marginBottom: 6, marginTop: 10, fontFamily: 'Inter_600SemiBold' },
  picker: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  btnSalvar: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
});
