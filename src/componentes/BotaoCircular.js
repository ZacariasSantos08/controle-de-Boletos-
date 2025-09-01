import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import tema from '../estilos/tema';

const BotaoCircular = ({ titulo, onPress, tipo = 'primario' }) => {
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
      <Text style={textoStyle}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // TAMANHO REDUZIDO
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  primarioContainer: {
    backgroundColor: tema.cores.primaria,
  },
  secundarioContainer: {
    backgroundColor: tema.cores.branco,
    borderWidth: 1.5,
    borderColor: tema.cores.primaria,
  },
  texto: {
    // FONTE AJUSTADA
    fontSize: 16,
    fontWeight: 'bold',
  },
  primarioTexto: {
    color: tema.cores.branco,
  },
  secundarioTexto: {
    color: tema.cores.primaria,
  },
});

export default BotaoCircular;