import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { tema } from '../estilos/tema';

const EntradaPersonalizada = ({ label, valor, onChangeText, erro, render, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {render ? render({ ...props, style: [styles.input, erro ? styles.inputErro : null] }) : (
        <TextInput style={[styles.input, erro ? styles.inputErro : null]} value={valor} onChangeText={onChangeText} placeholderTextColor={tema.cores.cinza} {...props} />
      )}
      {erro && <Text style={styles.textoErro}>{erro}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { width: '100%', marginVertical: tema.espacamento.pequeno, },
  label: { fontSize: 14, color: tema.cores.primaria, marginBottom: 4, fontWeight: '600' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: tema.cores.borda, borderRadius: tema.raioBorda.medio, paddingHorizontal: tema.espacamento.medio, height: 50, fontSize: 16, color: tema.cores.texto, },
  inputErro: { borderColor: tema.cores.erro, },
  textoErro: { color: tema.cores.erro, fontSize: 12, marginTop: 4, },
});
export default EntradaPersonalizada;