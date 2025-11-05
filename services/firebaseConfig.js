import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDXDy5tIzGq5AEhztDL-Cv3cw1ah66YwAE',
  authDomain: 'easy-finder-15296.firebaseapp.com',
  projectId: 'easy-finder-15296',
  storageBucket: 'easy-finder-15296.firebasestorage.app',
  messagingSenderId: '291268867483',
  appId: '1:291268867483:web:d2d78917f6246888331d3e',
  measurementId: 'G-B4J55XYCY5',
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);