import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';
import EtiquetaStatus from './EtiquetaStatus';

const CartaoBoleto = ({ boleto, onEditar, onExcluir, onPagar, onDesmarcar }) => {
  const ehPago = boleto.status === 'pago';
  const valorFormatado = (boleto.valor || 0).toFixed(2).replace('.', ',');

  return (
    <View style={styles.cartao}>
      <View style={styles.cabecalho}>
        <View style={{flex: 1}}>
          <Text style={styles.emissor} numberOfLines={2}>{boleto.emissor}</Text>
          <Text style={styles.descricao}>{boleto.descricao}</Text>
        </View>
        <EtiquetaStatus status={boleto.status} />
      </View>
      <View style={styles.linhaInfo}>
        <Ionicons name="cash-outline" size={20} color={tema.cores.primaria} />
        <Text style={styles.valor}>R$ {valorFormatado}</Text>
      </View>
      {boleto.jurosMulta > 0 && (
        <View style={styles.linhaInfo}>
          <Ionicons name="add-circle-outline" size={20} color={tema.cores.aviso} />
          <Text style={styles.textoJuros}>
            Juros/Multa Pago: R$ {boleto.jurosMulta.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      )}
      {!ehPago && boleto.vencimento && (
        <View style={styles.linhaInfo}>
          <Ionicons name="calendar-outline" size={20} color={tema.cores.primaria} />
          <Text style={styles.textoInfo}>Vencimento: {format(parseISO(boleto.vencimento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</Text>
        </View>
      )}
      {ehPago && boleto.dataPagamento && (
         <View style={styles.linhaInfo}>
          <Ionicons name="checkmark-circle-outline" size={20} color={tema.cores.sucesso} />
          <Text style={[styles.textoInfo, {color: tema.cores.sucesso}]}>Pago em: {format(parseISO(boleto.dataPagamento), "dd/MM/yyyy", { locale: ptBR })}</Text>
        </View>
      )}
      <View style={styles.containerAcoes}>
        {!ehPago ? (
          <>
            <TouchableOpacity style={styles.botaoAcao} onPress={() => onPagar(boleto)}><Ionicons name="checkmark-done-circle-outline" size={24} color={tema.cores.sucesso} /><Text style={[styles.textoAcao, {color: tema.cores.sucesso}]}>Pagar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.botaoAcao} onPress={() => onEditar(boleto)}><Ionicons name="pencil-outline" size={24} color={tema.cores.aviso} /><Text style={[styles.textoAcao, {color: tema.cores.aviso}]}>Editar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.botaoAcao} onPress={() => onExcluir(boleto.id)}><Ionicons name="trash-outline" size={24} color={tema.cores.erro} /><Text style={[styles.textoAcao, {color: tema.cores.erro}]}>Excluir</Text></TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.botaoAcao} onPress={() => onDesmarcar(boleto.id)}><Ionicons name="arrow-undo-outline" size={24} color={tema.cores.erro} /><Text style={[styles.textoAcao, {color: tema.cores.erro}]}>Desmarcar</Text></TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cartao: { backgroundColor: '#FFFFFF', borderRadius: tema.raioBorda.medio, padding: tema.espacamento.medio, marginVertical: tema.espacamento.pequeno, marginHorizontal: tema.espacamento.medio, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: tema.espacamento.pequeno, },
  emissor: { fontSize: 18, fontWeight: 'bold', color: tema.cores.texto, },
  descricao: { fontSize: 14, color: tema.cores.cinza, },
  linhaInfo: { flexDirection: 'row', alignItems: 'center', marginVertical: 4, },
  valor: { fontSize: 20, fontWeight: 'bold', color: tema.cores.primaria, marginLeft: tema.espacamento.pequeno, },
  textoInfo: { fontSize: 14, color: tema.cores.cinza, marginLeft: tema.espacamento.pequeno, },
  textoJuros: { fontSize: 14, color: tema.cores.aviso, marginLeft: tema.espacamento.pequeno, fontWeight: 'bold', },
  containerAcoes: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: tema.cores.borda, marginTop: tema.espacamento.medio, paddingTop: tema.espacamento.medio, },
  botaoAcao: { alignItems: 'center', paddingHorizontal: 10, flex: 1 },
  textoAcao: { fontSize: 12, marginTop: 4, }
});
export default CartaoBoleto;