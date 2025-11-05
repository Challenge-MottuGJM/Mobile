import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Application from 'expo-application';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const version = Application.nativeApplicationVersion ?? '0.0.0';
const build = Application.nativeBuildVersion ?? '1';
const name = Application.applicationName ?? 'EasyFinder';

const commit = (process.env?.EXPO_PUBLIC_GIT_SHA as string) || 'dev';
const env = (process.env?.EXPO_PUBLIC_ENV as string) || 'dev';
const projectId = (process.env?.EXPO_PUBLIC_PROJECT_ID as string) || '';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushAsync(): Promise<string> {
  if (!Device.isDevice) throw new Error('Simulador não suporta push.');
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') throw new Error('Permissão negada.');
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

export default function About() {
  const [expoToken, setExpoToken] = useState<string>();

  const handleGetToken = async () => {
    try {
      const t = await registerForPushAsync();
      setExpoToken(t);
      Alert.alert('Expo token copiado', t);
      console.log('ExpoPushToken:', t);
    } catch (e: any) {
      Alert.alert('Erro ao obter token', e?.message ?? String(e));
    }
  };

  const handleLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'EasyFinder', body: 'Notificação local de teste' },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o App</Text>
      <Text>Nome: {name}</Text>
      <Text>Versão: {version} ({build})</Text>
      <Text>Ambiente: {env}</Text>
      <Text>Commit: {commit.slice(0, 7)}</Text>

      <View style={{ height: 12 }} />
      <Button title="Gerar token de push" onPress={handleGetToken} />
      <View style={{ height: 8 }} />
      <Button title="Notificação local" onPress={handleLocalNotification} />

      {expoToken ? (
        <>
          <View style={{ height: 8 }} />
          <Text selectable>Token: {expoToken}</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8, backgroundColor: '#818181ff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#000000ff' },
  text: { color: '#000000ff' }
});
