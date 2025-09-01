import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../estilos/tema';

const InputSelecao = ({ label, valor, placeholder, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={onPress}>
        <Text style={[styles.textoValor, !valor && styles.placeholder]}>
          {valor || placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color={tema.cores.cinza} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: tema.espacamento.medio,
  },
  label: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.preto,
    marginBottom: tema.espacamento.pequeno / 2,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: tema.cores.secundaria,
    borderRadius: 8,
    paddingHorizontal: tema.espacamento.medio,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 49, // Altura similar ao InputFormulario
  },
  textoValor: {
    fontSize: tema.fontes.tamanhoMedio,
    color: tema.cores.preto,
  },
  placeholder: {
    color: tema.cores.cinza,
  },
});

export default InputSelecao;