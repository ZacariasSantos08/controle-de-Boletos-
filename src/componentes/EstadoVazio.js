import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Botao from './Botao';
import tema from '../estilos/tema';

const EstadoVazio = ({ icone, titulo, subtitulo, textoBotao, onPressBotao }) => {
  return (
    <View style={styles.container}>
      <Feather name={icone} size={60} color={tema.cores.cinzaClaro} />
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.subtitulo}>{subtitulo}</Text>

      {textoBotao && onPressBotao && (
        <View style={styles.botaoContainer}>
          <Botao 
            titulo={textoBotao}
            onPress={onPressBotao}
            icone="plus-circle"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tema.espacamento.grande,
    minHeight: 300, // Garante que o componente tenha espaço
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: tema.cores.preto,
    marginTop: tema.espacamento.medio,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: tema.cores.cinza,
    textAlign: 'center',
    marginTop: tema.espacamento.pequeno,
    lineHeight: 20,
  },
  botaoContainer: {
    marginTop: tema.espacamento.grande,
    width: '80%',
  },
});

export default EstadoVazio;