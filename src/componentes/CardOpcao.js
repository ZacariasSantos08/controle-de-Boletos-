import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../estilos/tema';

const CardOpcao = ({ icone, titulo, descricao, onPress, corBotao }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, corBotao ? {backgroundColor: corBotao} : {}]} 
      onPress={onPress}
    >
      <Feather name={icone} size={32} color={corBotao ? tema.cores.branco : tema.cores.primaria} />
      <View style={styles.textContainer}>
        <Text style={[styles.tituloCard, corBotao ? {color: tema.cores.branco} : {}]}>{titulo}</Text>
        <Text style={[styles.subtituloCard, corBotao ? {color: tema.cores.branco, opacity: 0.8} : {}]}>{descricao}</Text>
      </View>
      <Feather name="chevron-right" size={24} color={corBotao ? tema.cores.branco : tema.cores.cinza} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: tema.cores.branco, 
    borderRadius: 8, 
    padding: tema.espacamento.medio, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: tema.espacamento.medio, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3 
  },
  textContainer: { 
    flex: 1, 
    marginLeft: tema.espacamento.medio 
  },
  tituloCard: { 
    fontSize: tema.fontes.tamanhoMedio, 
    fontWeight: 'bold', 
    color: tema.cores.preto 
  },
  subtituloCard: { 
    fontSize: tema.fontes.tamanhoPequeno, 
    color: tema.cores.cinza, 
    marginTop: 2 
  },
});

export default CardOpcao;