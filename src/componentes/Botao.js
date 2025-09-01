import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../estilos/tema';

const Botao = ({ titulo, onPress, tipo = 'primario', icone }) => {
  const containerStyle = [
    styles.container,
    tipo === 'primario' ? styles.primarioContainer : styles.secundarioContainer
  ];
  const textoStyle = [
    styles.texto,
    tipo === 'primario' ? styles.primarioTexto : styles.secundarioTexto
  ];

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      {icone && <Feather name={icone} size={20} color={textoStyle[1].color} style={styles.icone} />}
      <Text style={textoStyle}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: tema.espacamento.medio,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  primarioContainer: {
    backgroundColor: tema.cores.primaria,
  },
  secundarioContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: tema.cores.primaria,
  },
  texto: {
    fontSize: tema.fontes.tamanhoMedio,
    fontWeight: 'bold',
  },
  primarioTexto: {
    color: tema.cores.branco,
  },
  secundarioTexto: {
    color: tema.cores.primaria,
  },
  icone: {
    marginRight: tema.espacamento.pequeno,
  },
});

export default Botao;