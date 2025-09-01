import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../../../estilos/tema';

const CabecalhoContextualAcoes = ({ 
  totalSelecionado, 
  onLimparSelecao, 
  onSelecionarTodos, 
  onExcluir, 
  onEditar 
}) => {
  const podeEditar = totalSelecionado === 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onLimparSelecao} style={styles.botao}>
        <Feather name="x" size={24} color={tema.cores.branco} />
      </TouchableOpacity>
      <Text style={styles.textoContador}>{totalSelecionado} selecionado(s)</Text>
      <View style={styles.botoesContainer}>
        <TouchableOpacity onPress={onSelecionarTodos} style={styles.botao}>
          <Feather name="check-square" size={24} color={tema.cores.branco} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onEditar} style={styles.botao} disabled={!podeEditar}>
          <Feather name="edit-2" size={24} color={podeEditar ? tema.cores.branco : tema.cores.cinza} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onExcluir} style={styles.botao}>
          <Feather name="trash-2" size={24} color={tema.cores.branco} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tema.espacamento.medio,
    paddingVertical: 12,
    backgroundColor: tema.cores.primaria,
  },
  textoContador: {
    fontSize: 18,
    color: tema.cores.branco,
    fontWeight: 'bold',
  },
  botoesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espacamento.grande,
  },
  botao: {
    padding: tema.espacamento.pequeno,
  },
});

export default CabecalhoContextualAcoes;