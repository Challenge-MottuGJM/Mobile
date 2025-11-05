import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true
    } as Notifications.NotificationBehavior;
  },
});

export async function registerForPush(): Promise<string | null> {
  if (!Device.isDevice) return null;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    (Constants as any).expoConfig?.extra?.projectId;

  if (!projectId) {
    console.warn('Expo projectId ausente para obter push token.');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  return token;
}

export async function sendLocalTest() {
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Teste', body: 'Notificação local funcionando.' },
    trigger: null,
  });
}
