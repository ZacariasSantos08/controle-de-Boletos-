import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const ItemCarrinho = ({ item, aoPressionar, aoRemover }) => {
  const precoUnitario = item.valorVenda;
  const subtotal = precoUnitario * item.quantidade;

  const descontoFinal = item.tipoDesconto === 'R$' 
    ? item.valorDesconto 
    : subtotal * (item.valorDesconto / 100);
  
  const totalFinal = subtotal - (descontoFinal || 0);
  const temDesconto = (descontoFinal || 0) > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={aoPressionar}>
      <View style={styles.qtdContainer}>
        <Text style={styles.qtdTexto}>{item.quantidade}x</Text>
      </View>
      <View style={styles.infoProduto}>
        <Text style={styles.nomeProduto} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.precoUnitario}>
          {formatarMoeda(precoUnitario * 100)}
          {temDesconto && <Text style={styles.textoDesconto}> (com desc.)</Text>}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.precoFinal}>{formatarMoeda(totalFinal * 100)}</Text>
        {temDesconto && <Text style={styles.precoOriginal}>{formatarMoeda(subtotal * 100)}</Text>}
      </View>
      <TouchableOpacity style={styles.botaoRemover} onPress={aoRemover}>
        <Feather name="trash-2" size={22} color={tema.cores.cinza} />
      </TouchableOpacity>
    </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  qtdContainer: {
    backgroundColor: tema.cores.secundaria,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: tema.espacamento.medio,
  },
  qtdTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: tema.cores.primaria,
  },
  infoProduto: {
    flex: 1,
  },
  nomeProduto: {
    fontSize: tema.fontes.tamanhoMedio,
    fontWeight: 'bold',
    color: tema.cores.preto,
  },
  precoUnitario: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.cinza,
  },
  textoDesconto: {
    color: tema.cores.verde,
    fontStyle: 'italic',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  precoFinal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: tema.cores.preto,
  },
  precoOriginal: {
    fontSize: 12,
    color: tema.cores.cinza,
    textDecorationLine: 'line-through',
  },
  botaoRemover: {
    paddingLeft: tema.espacamento.medio,
  },
});

export default ItemCarrinho;