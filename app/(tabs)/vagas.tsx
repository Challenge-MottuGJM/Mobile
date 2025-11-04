import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';
import { listarVagas, atualizarVaga } from '../../services/vagas';

type Vaga = { id: string; setor: string; ocupada: boolean };

const TOTAL_COLUNAS = 5;
const setoresUI = ['Análise', 'Problemas mecânicos', 'Problemas externos'];

export default function Estacionamento() {
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;

  const [vagasPorSetor, setVagasPorSetor] = useState<Record<string, Vaga[][]>>({});
  const [loading, setLoading] = useState(true);

  // Mapeia nomes vindos da API para os rótulos da UI
  const mapSetor = (s: string) => {
    const k = s?.toLowerCase();
    if (k.includes('anali')) return 'Análise';
    if (k.includes('mecan')) return 'Problemas mecânicos';
    if (k.includes('extern')) return 'Problemas externos';
    return 'Análise';
  };

  const organizarEmLinhas = (vagas: Vaga[]) => {
    const agrupado: Record<string, Vaga[]> = {};
    vagas.forEach(v => {
      const key = mapSetor(v.setor);
      agrupado[key] = agrupado[key] || [];
      agrupado[key].push(v);
    });
    const organizado: Record<string, Vaga[][]> = {};
    Object.keys(agrupado).forEach(setor => {
      const arr = agrupado[setor];
      const linhas: Vaga[][] = [];
      for (let i = 0; i < arr.length; i += TOTAL_COLUNAS) {
        linhas.push(arr.slice(i, i + TOTAL_COLUNAS));
      }
      organizado[setor] = linhas;
    });
    // Garante todas as chaves na UI
    setoresUI.forEach(s => organizado[s] = organizado[s] || []);
    return organizado;
  };

  const carregar = async () => {
    try {
      setLoading(true);
      const data = await listarVagas();
      // Esperado da API: [{ id, setor, status|ocupada }]
      const vagas: Vaga[] = Array.isArray(data)
        ? data.map((x: any, i: number) => ({
            id: String(x.id ?? x.vagaId ?? `V${i+1}`),
            setor: String(x.setor ?? 'analise'),
            ocupada: String(x.status ?? (x.ocupada ? 'ocupada' : 'livre')) === 'ocupada' || !!x.ocupada
          }))
        : [];
      if (!vagas.length) throw new Error('Sem dados da API');
      setVagasPorSetor(organizarEmLinhas(vagas));
    } catch (e) {
      // Fallback local para visualização quando a API não estiver pronta
      const TOTAL_VAGAS = 54;
      const tmp: Vaga[] = [];
      for (let i = 0; i < TOTAL_VAGAS; i++) {
        const setorIdx = Math.floor(i / 18);
        const base = setoresUI[setorIdx];
        tmp.push({ id: `V${i+1}`, setor: base, ocupada: false });
      }
      setoresUI.forEach(s => {
        const indices = tmp.map((v, i) => v.setor === s ? i : -1).filter(i => i !== -1);
        indices.sort(() => 0.5 - Math.random()).slice(0, 3).forEach(i => tmp[i].ocupada = true);
      });
      setVagasPorSetor(organizarEmLinhas(tmp));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const onManutencao = async (vaga: Vaga) => {
    try {
      await atualizarVaga(vaga.id, { status: 'manutencao' });
      await carregar();
    } catch (e:any) {
      Alert.alert('Aviso', e.message || 'Falha ao atualizar vaga. Quando a API estiver ativa, a ação funcionará.');
    }
  };

  return (
    <LinearGradient colors={colors} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={{ flex:1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>Vagas</Text>

        {loading && <ActivityIndicator style={{ marginVertical: 16 }} />}

        {!loading && setoresUI.map((setor) => (
          <BlurView key={setor} intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.card}>
            <Text style={[styles.setorTitulo, { color: isDark ? '#fff' : '#333' }]}>{setor}</Text>

            {vagasPorSetor[setor]?.length ? vagasPorSetor[setor].map((linha, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                {linha.map((vaga) => (
                  <TouchableOpacity
                    key={vaga.id}
                    style={[
                      styles.vaga,
                      { backgroundColor: vaga.ocupada ? '#ff4d4d' : '#66cc66' },
                    ]}
                    onLongPress={() => onManutencao(vaga)}
                  >
                    <Text style={styles.text}>
                      {vaga.ocupada ? 'Ocupada' : vaga.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )) : (
              <Text style={{ textAlign:'center', opacity:0.6, marginVertical:8 }}>
                Sem vagas para este setor
              </Text>
            )}
          </BlurView>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, paddingTop: 32 },
  container: { padding: 16, paddingBottom: 64 },
  title: {
    fontSize: 23,
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 40,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
  card: { borderRadius: 12, padding: 16, marginBottom: 24, overflow: 'hidden' },
  setorTitulo: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  vaga: {
    width: 60, height: 60, margin: 4, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  text: { fontSize: 10, color: '#fff', textAlign: 'center', fontFamily: 'Inter_400Regular' },
});
