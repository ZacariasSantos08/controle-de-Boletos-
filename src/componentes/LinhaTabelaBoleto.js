import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';
import EtiquetaStatus from './EtiquetaStatus';

export const LARGURA_COLUNAS = {
  emissor: 220,
  descricao: 250,
  valor: 120,
  data: 120,
  juros: 100,
  numeroBoleto: 280,
  status: 110,
  acoes: 120,
};

const LinhaTabelaBoleto = ({ boleto, onPagar, onEditar, onExcluir, onDesmarcar }) => {
  const ehPago = boleto.status === 'pago';
  const valorExibido = (ehPago ? boleto.valorPago : boleto.valor) || 0;
  const dataExibida = ehPago ? boleto.dataPagamento : boleto.vencimento;
  const labelData = ehPago ? 'Pago em' : 'Vencimento';

  return (
    <View style={styles.linha}>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.emissor }]}>
        <Text style={styles.textoEmissor} >{boleto.emissor}</Text>
      </View>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.descricao }]}>
        <Text style={styles.textoNormal}>{boleto.descricao}</Text>
      </View>
      <Text style={[styles.celula, styles.celulaNumerica, { width: LARGURA_COLUNAS.valor }]}>R$ {valorExibido.toFixed(2).replace('.', ',')}</Text>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.data, alignItems: 'center' }]}>
        <Text style={styles.textoDataLabel}>{labelData}:</Text>
        <Text style={styles.textoDataValor}>{dataExibida ? format(parseISO(dataExibida), 'dd/MM/yyyy') : '---'}</Text>
      </View>
      <Text style={[styles.celula, styles.celulaNumerica, { width: LARGURA_COLUNAS.juros }]}>{boleto.jurosMulta ? `R$ ${boleto.jurosMulta.toFixed(2).replace('.', ',')}` : '-'}</Text>
      <Text style={[styles.celula, { width: LARGURA_COLUNAS.numeroBoleto }]}>{boleto.numeroBoleto || '-'}</Text>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.status, alignItems: 'center' }]}><EtiquetaStatus status={boleto.status} /></View>
      <View style={[styles.celula, styles.containerAcoes]}>
        {!ehPago ? (
          <>
            <TouchableOpacity onPress={() => onPagar(boleto)}><Ionicons name="cash-outline" size={24} color={tema.cores.sucesso} /></TouchableOpacity>
            <TouchableOpacity onPress={() => onEditar(boleto)}><Ionicons name="pencil-outline" size={24} color={tema.cores.aviso} /></TouchableOpacity>
            <TouchableOpacity onPress={() => onExcluir(boleto.id)}><Ionicons name="trash-outline" size={24} color={tema.cores.erro} /></TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => onDesmarcar(boleto.id)}><Ionicons name="arrow-undo-outline" size={24} color={tema.cores.erro} /></TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: tema.cores.borda, },
  celula: { paddingHorizontal: tema.espacamento.pequeno, paddingVertical: tema.espacamento.medio, justifyContent: 'center', },
  textoEmissor: { color: tema.cores.texto, fontSize: 14, fontWeight: 'bold' },
  textoNormal: { color: tema.cores.texto, fontSize: 14 },
  celulaNumerica: { textAlign: 'right', fontWeight: 'bold', color: tema.cores.primaria, fontSize: 14, },
  textoDataLabel: { fontSize: 12, color: tema.cores.cinza, },
  textoDataValor: { fontSize: 14, fontWeight: '600', },
  containerAcoes: { width: LARGURA_COLUNAS.acoes, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});
export default LinhaTabelaBoleto;