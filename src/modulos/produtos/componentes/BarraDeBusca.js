import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../../../estilos/tema';

const BarraDeBusca = ({ valor, aoMudarTexto, placeholder }) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color={tema.cores.cinza} style={styles.icone} />
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={aoMudarTexto}
        placeholder={placeholder || "Buscar..."}
        placeholderTextColor={tema.cores.cinza}
        clearButtonMode="while-editing" // Botão 'x' no iOS
      />
      {valor.length > 0 && ( // Botão 'x' customizado para Android
        <TouchableOpacity onPress={() => aoMudarTexto('')}>
          <Feather name="x-circle" size={20} color={tema.cores.cinza} style={styles.iconeLimpar} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    paddingHorizontal: tema.espacamento.medio,
    margin: tema.espacamento.medio,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  icone: {
    marginRight: tema.espacamento.pequeno,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: tema.fontes.tamanhoMedio,
    color: tema.cores.preto,
  },
  iconeLimpar: {
    marginLeft: tema.espacamento.pequeno,
  },
});

export default BarraDeBusca;