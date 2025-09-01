import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatarData, formatarMoeda } from '../../../utilitarios/formatadores';
import tema from '../../../estilos/tema';

const CardVenda = ({ venda, aoPressionar }) => {
  const totalItens = venda.itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <TouchableOpacity style={styles.card} onPress={aoPressionar}>
      <View style={styles.header}>
        <Text style={styles.codigoVenda}>{venda.codigoVenda}</Text>
        <Text style={styles.dataVenda}>{formatarData(venda.dataEmissao)}</Text>
      </View>
      <View style={styles.corpo}>
        <Feather name="user" size={16} color={tema.cores.cinza} />
        <Text style={styles.nomeCliente} numberOfLines={1}>{venda.clienteSnapshot.nome}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.totalItens}>{totalItens} {totalItens > 1 ? 'itens' : 'item'}</Text>
        {/* CORREÇÃO: Usando o formatador de moeda */}
        <Text style={styles.totalValor}>{formatarMoeda(venda.valorTotalVenda * 100)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    padding: tema.espacamento.medio,
    marginBottom: tema.espacamento.medio,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tema.espacamento.medio,
  },
  codigoVenda: {
    fontSize: tema.fontes.tamanhoMedio,
    fontWeight: 'bold',
    color: tema.cores.primaria,
  },
  dataVenda: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.cinza,
  },
  corpo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tema.espacamento.medio,
  },
  nomeCliente: {
    fontSize: tema.fontes.tamanhoMedio,
    marginLeft: tema.espacamento.pequeno,
    color: tema.cores.preto,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: tema.espacamento.medio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalItens: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.cinza,
    fontWeight: 'bold',
  },
  totalValor: {
    fontSize: tema.fontes.tamanhoGrande,
    fontWeight: 'bold',
    color: tema.cores.verde,
  },
});

export default CardVenda;