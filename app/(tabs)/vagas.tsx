import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, Modal, Pressable, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/themeContext';
import { LIGHT_BG, DARK_BG } from '../../theme/gradients';
import { listarVagas, atualizarVaga } from '../../services/vagas';

type Vaga = { id: string; setor: string; ocupada: boolean };

const TOTAL_COLUNAS = 5;
const setoresUI = ['Análise', 'Problemas mecânicos', 'Problemas externos'] as const;
const COLORS = {
  livre: '#66cc66',
  ocupada: '#ff4d4d',
  manutencao: '#f0ad4e',
  texto: '#fff',
};

export default function Estacionamento() {
  const { isDark } = useTheme();
  const colors = isDark ? DARK_BG : LIGHT_BG;

  const [vagasPorSetor, setVagasPorSetor] = useState<Record<string, Vaga[][]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selecionada, setSelecionada] = useState<Vaga | null>(null);
  const fecharSheet = () => setSelecionada(null);

  // Mapeia nomes vindos da API para os rótulos da UI
  const mapSetor = (s: string) => {
    const k = s?.toLowerCase();
    if (k.includes('anali')) return 'Análise';
    if (k.includes('mecan')) return 'Problemas mecânicos';
    if (k.includes('extern')) return 'Problemas externos';
    return 'Análise';
  };

  const organizarEmLinhas = useMemo(() => (vagas: Vaga[]) => {
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
    setoresUI.forEach(s => (organizado[s] = organizado[s] || []));
    return organizado;
  }, []);

  const carregar = async () => {
    try {
      setLoading(true);
      const data = await listarVagas();
      const vagas: Vaga[] = Array.isArray(data)
        ? data.map((x: any, i: number) => ({
            id: String(x.id ?? x.vagaId ?? `V${i + 1}`),
            setor: String(x.setor ?? 'analise'),
            ocupada:
              String(x.status ?? (x.ocupada ? 'ocupada' : 'livre')).toLowerCase() === 'ocupada' ||
              !!x.ocupada,
          }))
        : [];
      if (!vagas.length) throw new Error('Sem dados da API');
      setVagasPorSetor(organizarEmLinhas(vagas));
    } catch {
      const TOTAL_VAGAS = 54;
      const tmp: Vaga[] = [];
      for (let i = 0; i < TOTAL_VAGAS; i++) {
        const setorIdx = Math.floor(i / 18);
        const base = setoresUI[setorIdx];
        tmp.push({ id: `V${i + 1}`, setor: base, ocupada: false });
      }
      setoresUI.forEach(s => {
        const indices = tmp.map((v, i) => (v.setor === s ? i : -1)).filter(i => i !== -1);
        indices.sort(() => 0.5 - Math.random()).slice(0, 3).forEach(i => (tmp[i].ocupada = true));
      });
      setVagasPorSetor(organizarEmLinhas(tmp));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const onRefresh = async () => {
    try { setRefreshing(true); await carregar(); } finally { setRefreshing(false); }
  };

  const onManutencao = async (vaga: Vaga) => {
    try {
      await atualizarVaga(vaga.id, { status: 'manutencao' });
      await carregar();
      Alert.alert('Ok', 'Vaga marcada como manutenção.');
    } catch (e: any) {
      Alert.alert('Aviso', e?.message || 'Falha ao atualizar. A ação funcionará quando a API estiver ativa.');
    }
  };

  const corVaga = (v: Vaga) => (v.ocupada ? COLORS.ocupada : COLORS.livre);

  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>Vagas</Text>
        <Text style={[styles.hint, { color: isDark ? '#fff' : '#333' }]}>
          Toque para detalhes - Segure para manutenção
        </Text>

        <View style={styles.legendaWrap}>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaDot, { backgroundColor: COLORS.livre }]} />
            <Text style={styles.legendaText}>Livre</Text>
          </View>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaDot, { backgroundColor: COLORS.ocupada }]} />
            <Text style={styles.legendaText}>Ocupada</Text>
          </View>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaDot, { backgroundColor: COLORS.manutencao }]} />
            <Text style={styles.legendaText}>Manutenção</Text>
          </View>
        </View>

        {loading && <ActivityIndicator style={{ marginVertical: 16 }} />}
        {!loading &&
          setoresUI.map(setor => (
            <BlurView key={setor} intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.card}>
              <Text style={[styles.setorTitulo, { color: isDark ? '#fff' : '#333' }]}>{setor}</Text>

              {vagasPorSetor[setor]?.length ? (
                vagasPorSetor[setor].map((linha, rowIdx) => (
                  <View key={rowIdx} style={styles.row}>
                    {linha.map(vaga => (
                      <TouchableOpacity
                        key={vaga.id}
                        style={[styles.vaga, { backgroundColor: corVaga(vaga) }]}
                        onPress={() => setSelecionada(vaga)}
                        onLongPress={() => onManutencao(vaga)}
                      >
                        <Text style={styles.text}>{vaga.ocupada ? 'Ocupada' : vaga.id}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', opacity: 0.6, marginVertical: 8 }}>
                  Sem vagas para este setor
                </Text>
              )}
            </BlurView>
          ))}
      </ScrollView>

      <Modal
        visible={!!selecionada}
        transparent
        animationType="slide"
        onRequestClose={fecharSheet}
      >
        <Pressable style={styles.sheetBackdrop} onPress={fecharSheet} />
        <View style={[styles.sheetContainer, { backgroundColor: isDark ? '#222' : '#fff' }]}>
          {selecionada && (
            <>
              <View style={styles.sheetHandle} />
              <Text style={[styles.sheetTitle, { color: isDark ? '#fff' : '#333' }]}>
                Detalhes da vaga
              </Text>
              <Text style={[styles.sheetText, { color: isDark ? '#ddd' : '#444' }]}>
                Vaga: {selecionada.id}
              </Text>
              <Text style={[styles.sheetText, { color: isDark ? '#ddd' : '#444' }]}>
                Setor: {mapSetor(selecionada.setor)}
              </Text>
              <Text style={[styles.sheetText, { color: isDark ? '#ddd' : '#444' }]}>
                Status: {selecionada.ocupada ? 'Ocupada' : 'Livre'}
              </Text>

              <View style={styles.sheetActions}>
                {!selecionada.ocupada ? (
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: COLORS.ocupada }]}
                    onPress={() => {
                      Alert.alert('Ação', 'Ocupar vaga (simulação). Integração virá da API .NET.');
                      fecharSheet();
                    }}
                  >
                    <Text style={styles.btnText}>Ocupar</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: COLORS.livre }]}
                    onPress={() => {
                      Alert.alert('Ação', 'Liberar vaga (simulação). Integração virá da API .NET.');
                      fecharSheet();
                    }}
                  >
                    <Text style={styles.btnText}>Liberar</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: COLORS.manutencao }]}
                  onPress={async () => {
                    try {
                      await onManutencao(selecionada);
                    } finally {
                      fecharSheet();
                    }
                  }}
                >
                  <Text style={styles.btnText}>Manutenção</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 64 },
  title: {
    fontSize: 23, alignSelf: 'center', marginBottom: 16, marginTop: 40,
    fontWeight: 'bold', fontFamily: 'Inter_700Bold',
  },
  hint: {
    textAlign: 'center',
    opacity: 0.85,
    marginBottom: 12,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  card: { borderRadius: 12, padding: 16, marginBottom: 24, overflow: 'hidden' },
  setorTitulo: { fontSize: 20, marginBottom: 12, textAlign: 'center', fontFamily: 'Inter_600SemiBold' },
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  vaga: { width: 60, height: 60, margin: 4, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 10, color: '#fff', textAlign: 'center', fontFamily: 'Inter_400Regular' },

  legendaWrap: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 12 },
  legendaItem: { flexDirection: 'row', alignItems: 'center' },
  legendaDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendaText: { color: '#fff', opacity: 0.9 },

  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetContainer: {
    position: 'absolute', left: 0, right: 0, bottom: 0, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 16, paddingBottom: 32,
  },
  sheetHandle: { width: 44, height: 4, borderRadius: 2, backgroundColor: '#999', alignSelf: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  sheetText: { fontSize: 14, marginBottom: 6 },
  sheetActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  btn: { flex: 1, marginHorizontal: 6, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
