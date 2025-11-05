import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const commit = process.env.EXPO_PUBLIC_GIT_SHA || 'dev';

export default function About() {
  const short = commit.slice(0, 7);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o App</Text>
      <Text style={styles.label}>Commit</Text>
      <TouchableOpacity onPress={() => Alert.alert('Commit', commit)}>
        <Text style={styles.hash}>{short}</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>Toque para ver o hash completo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center', alignItems:'center', gap:8 },
  title: { fontSize:20, fontWeight:'600', marginBottom:8 },
  label: { fontSize:12, opacity:0.7 },
  hash: { fontFamily:'Courier', fontSize:16 },
  hint: { fontSize:12, opacity:0.6, marginTop:4 }
});
