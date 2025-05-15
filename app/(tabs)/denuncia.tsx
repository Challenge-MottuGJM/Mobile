import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DenunciaPage() {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");

  const enviarDenuncia = () => {
    if (!tipo || !descricao) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    setMensagem("Sua denúncia foi enviada com sucesso!");
    setTipo("");
    setDescricao("");
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: "Denúncia",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.titulo}>Denúncia</Text>
        <Image
          source={require("../../assets/Sirene.png")}
          style={styles.imagem}
          resizeMode="contain"
        />
        <Text style={styles.texto}>
          Nesta página você pode registrar sua denúncia. Selecione o tipo e
          descreva o ocorrido de forma anônima.
        </Text>

        <Text style={styles.label}>Tipo de denúncia:</Text>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione..." value="" />
          <Picker.Item label="Violência Doméstica" value="violencia" />
          <Picker.Item label="Racismo" value="racismo" />
          <Picker.Item label="Abuso infantil" value="abuso" />
          <Picker.Item label="Assédio" value="assedio" />
        </Picker>

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Descreva o que aconteceu..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={enviarDenuncia}>
          <Text style={styles.buttonText}>Enviar denúncia</Text>
        </TouchableOpacity>

        <Image
          source={require("../../assets/help_mobile.png")}
          style={styles.imagem}
          resizeMode="contain"
        />

        {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 80, backgroundColor: "#DBD7D7" },
  titulo: {
    fontSize: 33,
    fontStyle: "italic",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#0A3CFF",
  },
  texto: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  label: { fontSize: 18, marginBottom: 5 },
  picker: { backgroundColor: "#ffffff", marginBottom: 20 },
  textarea: {
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: "top",
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#0A3CFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 50,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
  mensagem: {
    marginTop: 20,
    color: "#333232",
    fontSize: 18,
    textAlign: "center",
  },
  imagem: {
    width: 100,
    height: 100,
    marginVertical: 15,
    alignSelf: "center",
  },
});
