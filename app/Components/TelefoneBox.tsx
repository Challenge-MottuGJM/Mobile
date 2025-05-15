import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Linking } from 'react-native';

interface TelefoneBoxProps {
  numero: string;
  descricao: string;
}

export default function TelefoneBox({ numero, descricao }: TelefoneBoxProps) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(`tel:${numero}`)} style={styles.box}>
      <Text style={styles.numero}>Disque {numero}</Text>
      <Text style={styles.descricao}>{descricao}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    width: '100%',
  },
  numero: {
    fontSize: 18,
    color: 'blue',
    fontWeight: '600',
  },
  descricao: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});
