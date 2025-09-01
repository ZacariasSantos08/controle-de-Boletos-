import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatarData, formatarMoeda } from '../../../utilitarios/formatadores';
import tema from '../../../estilos/tema';

const getStatusInfo = (conta) => {
  const hoje = new Date().setHours(0, 0, 0, 0);
  if (conta.status === 'PAGA') {
    return { texto: 'Paga', cor: tema.cores.verde, icone: 'check-circle' };
  }
  if (conta.dataVencimento < hoje) {
    return { texto: 'Vencida', cor: tema.cores.vermelho, icone: 'alert-circle' };
  }
  return { texto: 'Em Aberto', cor: tema.cores.amarelo, icone: 'clock' };
};

const CardConta = ({ conta, onPress }) => {
  const statusInfo = getStatusInfo(conta);
  const valorRestante = conta.valorTotal - conta.valorPago;

  // ALTERADO: Lógica para adaptar o card ao tipo de conta
  const isReceber = conta.tipo === 'RECEBER';
  const labelValor = isReceber ? 'Valor a Receber' : 'Valor a Pagar';
  const corValor = isReceber ? tema.cores.primaria : tema.cores.vermelho;
  const iconeAssociado = conta.associado?.tipo === 'CLIENTE' ? 'user' : 'truck';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.descricao} numberOfLines={1}>{conta.descricao}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.cor }]}>
          <Feather name={statusInfo.icone} size={12} color="#fff" />
          <Text style={styles.statusTexto}>{statusInfo.texto}</Text>
        </View>
      </View>

      <View style={styles.corpo}>
        <Feather name={iconeAssociado} size={16} color={tema.cores.cinza} />
        <Text style={styles.nomeAssociado}>{conta.associado?.nome || 'Não informado'}</Text>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.labelFooter}>Vencimento</Text>
          <Text style={styles.valorFooter}>{formatarData(conta.dataVencimento)}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.labelFooter}>{labelValor}</Text>
          <Text style={[styles.valorFooter, styles.valorPrincipal, { color: corValor }]}>
            {formatarMoeda(valorRestante * 100)}
          </Text>
        </View>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tema.espacamento.medio,
  },
  descricao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: tema.cores.preto,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTexto: {
    color: tema.cores.branco,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  corpo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tema.espacamento.grande,
  },
  nomeAssociado: {
    fontSize: 14,
    color: tema.cores.cinza,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: tema.espacamento.medio,
  },
  labelFooter: {
    fontSize: 12,
    color: tema.cores.cinza,
  },
  valorFooter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: tema.cores.preto,
  },
  valorPrincipal: {
    fontSize: 18,
  },
});

export default CardConta;