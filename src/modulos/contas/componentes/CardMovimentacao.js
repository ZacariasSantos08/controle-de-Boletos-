import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatarData, formatarMoeda } from '../../../utilitarios/formatadores';
import tema from '../../../estilos/tema';

const CardMovimentacao = ({ movimentacao }) => {
  const isEntrada = movimentacao.tipoConta === 'RECEBER';
  const cor = isEntrada ? tema.cores.verde : tema.cores.vermelho;
  const icone = isEntrada ? 'arrow-down-left' : 'arrow-up-right';
  const sinal = isEntrada ? '+' : '-';

  return (
    <View style={styles.card}>
      <View style={[styles.iconeContainer, { backgroundColor: cor }]}>
        <Feather name={icone} size={24} color={tema.cores.branco} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.descricao} numberOfLines={1}>{movimentacao.descricaoConta}</Text>
        <Text style={styles.data}>{formatarData(movimentacao.data)} - {movimentacao.forma}</Text>
      </View>
      <Text style={[styles.valor, { color: cor }]}>
        {sinal} {formatarMoeda(movimentacao.valor * 100)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    padding: tema.espacamento.medio,
    marginBottom: tema.espacamento.pequeno,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  iconeContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tema.espacamento.medio,
  },
  infoContainer: {
    flex: 1,
  },
  descricao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: tema.cores.preto,
  },
  data: {
    fontSize: 12,
    color: tema.cores.cinza,
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CardMovimentacao;