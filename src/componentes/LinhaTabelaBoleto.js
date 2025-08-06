import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';
import EtiquetaStatus from './EtiquetaStatus';

export const LARGURA_COLUNAS = {
  selecao: 50,
  emissor: 220,
  pagador: 220,
  descricao: 250,
  valor: 120,
  data: 120,
  juros: 100,
  numeroDocumento: 150,
  anexo: 80,
  status: 110,
  acoes: 120,
};

const LinhaTabelaBoleto = ({ boleto, onPagar, onEditar, onExcluir, onDesmarcar, onVerAnexo, modoSelecao, isSelecionado, onToggleSelecao }) => {
  const ehPago = boleto.status === 'pago';
  const valorExibido = (ehPago ? boleto.valorPago : boleto.valor) || 0;
  const dataExibida = ehPago ? boleto.dataPagamento : boleto.vencimento;
  const labelData = ehPago ? 'Pago em' : 'Vencimento';

  return (
    <TouchableOpacity onPress={() => modoSelecao ? onToggleSelecao(boleto.id) : null} disabled={!modoSelecao} style={[styles.linha, isSelecionado && styles.linhaSelecionada]}>
      {modoSelecao && (
        <View style={[styles.celula, { width: LARGURA_COLUNAS.selecao, alignItems: 'center' }]}>
          <Ionicons name={isSelecionado ? "checkbox" : "square-outline"} size={26} color={tema.cores.primaria} />
        </View>
      )}
      <View style={[styles.celula, { width: LARGURA_COLUNAS.emissor }]}><Text style={styles.textoEmissor}>{boleto.emissor}</Text></View>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.pagador }]}><Text style={styles.textoNormal}>{boleto.pagador || '-'}</Text></View>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.descricao }]}><Text style={styles.textoNormal}>{boleto.descricao}</Text></View>
      <Text style={[styles.celula, styles.celulaNumerica, { width: LARGURA_COLUNAS.valor }]}>R$ {valorExibido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.data, alignItems: 'center' }]}><Text style={styles.textoDataLabel}>{labelData}:</Text><Text style={styles.textoDataValor}>{dataExibida ? format(parseISO(dataExibida), 'dd/MM/yyyy') : '---'}</Text></View>
      <Text style={[styles.celula, styles.celulaNumerica, { width: LARGURA_COLUNAS.juros, color: tema.cores.aviso }]}>{boleto.jurosMulta ? `R$ ${boleto.jurosMulta.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}</Text>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.numeroDocumento }]}><Text style={styles.textoNormal}>{boleto.numeroDocumento || '-'}</Text></View>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.anexo, alignItems: 'center' }]}>{boleto.anexoUri ? ( <TouchableOpacity disabled={modoSelecao} onPress={() => onVerAnexo(boleto.anexoUri)}><Ionicons name="attach-outline" size={24} color={tema.cores.secundaria} /></TouchableOpacity> ) : ( <Text style={styles.textoNormal}>-</Text> )}</View>
      <View style={[styles.celula, { width: LARGURA_COLUNAS.status, alignItems: 'center' }]}><EtiquetaStatus status={boleto.status} /></View>
      <View style={[styles.celula, styles.containerAcoes]}>
        {!modoSelecao && !ehPago ? (
          <>
            <TouchableOpacity onPress={() => onPagar(boleto)}><Ionicons name="cash-outline" size={24} color={tema.cores.sucesso} /></TouchableOpacity>
            <TouchableOpacity onPress={() => onEditar(boleto)}><Ionicons name="pencil-outline" size={24} color={tema.cores.aviso} /></TouchableOpacity>
            <TouchableOpacity onPress={() => onExcluir(boleto.id)}><Ionicons name="trash-outline" size={24} color={tema.cores.erro} /></TouchableOpacity>
          </>
        ) : !modoSelecao && ehPago ? (
          <TouchableOpacity onPress={() => onDesmarcar(boleto.id)}><Ionicons name="arrow-undo-outline" size={24} color={tema.cores.erro} /></TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    linha: { flexDirection: 'row', alignItems: 'stretch', backgroundColor: tema.cores.superficie, borderBottomWidth: 1, borderBottomColor: tema.cores.borda, },
    linhaSelecionada: { backgroundColor: '#E3F2FD' },
    celula: { paddingHorizontal: tema.espacamento.pequeno, paddingVertical: tema.espacamento.medio, justifyContent: 'center', },
    textoEmissor: { color: tema.cores.texto, fontSize: 14, fontWeight: 'bold' },
    textoNormal: { color: tema.cores.texto, fontSize: 14 },
    celulaNumerica: { textAlign: 'right', fontWeight: 'bold', color: tema.cores.primaria, fontSize: 14, },
    textoDataLabel: { fontSize: 12, color: tema.cores.cinza, },
    textoDataValor: { fontSize: 14, fontWeight: '600', },
    containerAcoes: { width: LARGURA_COLUNAS.acoes, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});

export default LinhaTabelaBoleto;