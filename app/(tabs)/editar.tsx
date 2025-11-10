import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../../context/themeContext";
import { LIGHT_BG, DARK_BG } from "../../theme/gradients";
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = "http://localhost:5148";

export default function Editar() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;
  const { t } = useTranslation();

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
        const response = await axios.get(`${API_BASE_URL}/motos/${params.id}`);
        const item = response.data;
        setStatus(item.status);
        setAdmissao(item.admissao);
        setModelo(item.modelo);
        setMarca(item.marca);
        setPlaca(item.placa);
        setVeiculo(item.veiculo);
        setChassi(item.chassi);
      } catch (error) {
        Alert.alert(t('common.error'), t('editar.loadError'));
        console.log(error);
      }
    };

    carregarDados();
  }, [params.id]);

  const salvarEdicao = async () => {
    if (!params.id) {
      Alert.alert(t('common.error'), t('editar.idMissing'));
      return;
    }
    const novosDados = { status, admissao, modelo, marca, placa, veiculo, chassi };
    try {
      await axios.put(`${API_BASE_URL}/motos/atualizar/${params.id}`, novosDados);
      Alert.alert(t('common.success'), t('editar.updated'));
      router.replace('/lista');
    } catch (error) {
      Alert.alert(t('common.error'), t('editar.saveError'));
      console.log(error);
    }
  };

  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.titulo, { color: isDark ? '#fff' : '#333' }]}>{t('editar.title')}</Text>

        <TextInput style={styles.input} placeholder={t('cadastro.statusPlaceholder')} value={status} onChangeText={setStatus} />
        <TextInput style={styles.input} placeholder={t('editar.datePlaceholder')} keyboardType="numeric" value={admissao} onChangeText={setAdmissao} />
        <TextInput style={styles.input} placeholder={t('cadastro.model')} value={modelo} onChangeText={setModelo} />
        <TextInput style={styles.input} placeholder={t('cadastro.brand')} value={marca} onChangeText={setMarca} />
        <TextInput style={styles.input} placeholder={t('cadastro.plate')} value={placa} onChangeText={setPlaca} />
        <TextInput style={styles.input} placeholder={t('editar.vehicle')} value={veiculo} onChangeText={setVeiculo} />
        <TextInput style={styles.input} placeholder={t('cadastro.chassis')} value={chassi} onChangeText={setChassi} />

        <TouchableOpacity style={styles.botao} onPress={salvarEdicao}>
          <Text style={styles.textoBotao}>{t('editar.saveBtn')}</Text>
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
